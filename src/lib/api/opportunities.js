import { serverFetch } from "../core/server";

export const getOpportunitiesByUserId = async (startupId) => {
  return serverFetch(`/api/my/opportunities?startupId=${startupId}`);
};
