/**
 * Stripe Products Configuration
 * Centralized product definitions for the Destiny Matrix app
 */

export const PRODUCTS = {
  FULL_UNLOCK: {
    name: "Full Matrix Unlock",
    description: "Complete AI interpretation of your Destiny Matrix with lifetime access",
    price: 799, // €7.99 in cents
    currency: "eur",
    type: "one_time" as const,
  },
  SINGLE_QUESTION: {
    name: "Single Question",
    description: "Ask one specific question about your Destiny Matrix",
    price: 400, // €4.00 in cents
    currency: "eur",
    type: "one_time" as const,
  },
  MONTHLY_SUBSCRIPTION: {
    name: "Unlimited Access",
    description: "Unlimited questions, multiple matrices, and premium features",
    price: 3990, // €39.90 in cents
    currency: "eur",
    type: "subscription" as const,
    interval: "month" as const,
  },
} as const;

export type ProductType = keyof typeof PRODUCTS;
