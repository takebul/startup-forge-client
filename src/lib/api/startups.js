import { serverFetch } from "../core/server";

export const getStartups = async () => {
  return serverFetch("/api/startups");
};
