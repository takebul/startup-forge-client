import { serverMutation } from "../core/server";

export const subscription = async (addPaymentData) => {
  return serverMutation("/api/subscriptions", addPaymentData);
};
