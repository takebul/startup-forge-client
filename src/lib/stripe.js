import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const SUBSCRIPTION_PLAN_PRICE_ID = {
  founder_premium: "price_1U0kZA2LvaRGsgAccS3Ftqcs",
  founder_enterprise: "price_1U0kao2LvaRGsgAcrvjj4o44",
  collaborator_premium: "price_1U1UnZ2LvaRGsgAc6LC5p6Rc",
  collaborator_enterprise: "price_1U1Uol2LvaRGsgAcefiJoAzE",
};
