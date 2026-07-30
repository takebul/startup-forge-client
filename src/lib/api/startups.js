import { serverFetch } from "../core/server";

export const getStartups = async (userId) => {
  return serverFetch(`/api/startups?userId=${userId}`);
};
