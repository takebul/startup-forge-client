import { serverMutation } from "../core/server";

export const payment = async (addPaymentData) => {
  return serverMutation("/api/payments", addPaymentData);
};
