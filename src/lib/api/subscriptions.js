import { serverFetch } from "../core/server";

export const getSubscriptions = async () => {
  return serverFetch("/api/subscriptions");
};
