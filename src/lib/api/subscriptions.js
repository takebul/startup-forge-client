import { protectedFetch } from "../core/server";

export const getSubscriptions = async () => {
  return protectedFetch("/api/subscriptions");
};
