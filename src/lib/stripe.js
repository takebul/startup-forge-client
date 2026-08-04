import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const SUBSCRIPTION_PLAN_PRICE_ID = {
  plan_premium_founder_02: "price_1Txs0S2MBOuP2kLrxohUdPEu",
  plan_enterprise_scale_03: "price_1U0eU32MBOuP2kLr4zwEmB2Q",
};
