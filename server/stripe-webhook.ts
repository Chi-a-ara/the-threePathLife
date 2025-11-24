import { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { payments, subscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Webhook] Error processing ${event.type}:`, error);
    res.status(500).json({ error: error.message });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Processing checkout.session.completed:", session.id);

  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return;
  }

  const userId = session.metadata?.user_id;
  const matrixId = session.metadata?.matrix_id;
  const productType = session.metadata?.product_type;

  if (!userId) {
    console.error("[Webhook] Missing user_id in session metadata");
    return;
  }

  // Handle subscription
  if (session.mode === "subscription" && session.subscription) {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.insert(subscriptions).values({
      userId: parseInt(userId, 10),
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: stripeSubscription.customer as string,
      status: "active",
      currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
    });

    console.log(`[Webhook] Created subscription for user ${userId}`);
  }

  // Handle one-time payment
  if (session.mode === "payment" && session.payment_intent) {
    const type = productType === "single_question" ? "single_question" : "full_unlock";

    await db.insert(payments).values({
      userId: parseInt(userId, 10),
      matrixId: matrixId ? parseInt(matrixId, 10) : null,
      type,
      amount: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || "EUR",
      stripePaymentId: session.payment_intent as string,
      status: "completed",
    });

    console.log(`[Webhook] Created ${type} payment for user ${userId}`);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Processing payment_intent.succeeded:", paymentIntent.id);

  const db = await getDb();
  if (!db) return;

  // Update payment status if it exists
  await db
    .update(payments)
    .set({ status: "completed" })
    .where(eq(payments.stripePaymentId, paymentIntent.id));
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("[Webhook] Processing invoice.paid:", invoice.id);

  const db = await getDb();
  if (!db) return;

  // Update subscription period end
  const invoiceSubscription = (invoice as any).subscription;
  if (invoiceSubscription && typeof invoiceSubscription === "string") {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      invoiceSubscription
    );

    await db
      .update(subscriptions)
      .set({
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        status: "active",
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscription.id));
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log("[Webhook] Processing subscription change:", subscription.id);

  const db = await getDb();
  if (!db) return;

  const status = subscription.status === "active" ? "active" :
                 subscription.status === "past_due" ? "past_due" : "canceled";

  await db
    .update(subscriptions)
    .set({
      status,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}
