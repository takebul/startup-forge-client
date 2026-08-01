import { serverFetch } from "../core/server";

export const getFounderStartups = async (userId) => {
  return serverFetch(`/api/my/startups?userId=${userId}`);
};

export const getStartupDetails = async (startupData) => {
  return serverFetch(`/api/startup/${startupData}`);
};
