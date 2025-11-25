// Vercel Serverless Function Entry Point
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../dist/routers.js";
import { createContext } from "../dist/_core/context.js";

const app = express();

// Stripe webhook MUST be registered BEFORE express.json() middleware
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const { handleStripeWebhook } = await import("../dist/stripe-webhook.js");
  return handleStripeWebhook(req, res);
});

// Configure body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
