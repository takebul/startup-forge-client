import { serverFetch } from "../core/server";

export const getFounderStartups = async (startupId) => {
  return serverFetch(`/api/my/startups?startupId=${startupId}`);
};

export const getStartupDetails = async (startupData) => {
  return serverFetch(`/api/startup/${startupData}`);
};
