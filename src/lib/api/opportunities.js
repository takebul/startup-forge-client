import { serverFetch } from "../core/server";

export const getOpportunitiesByUserId = async (userId) => {
  return serverFetch(`/api/my/opportunities?userId=${userId}`);
};
