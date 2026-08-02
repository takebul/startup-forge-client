import { serverFetch } from "../core/server";

export const getFounderStartup = async (startupId) => {
  return serverFetch(`/api/my/startup?startupId=${startupId}`);
};

export const getStartups = async () => {
  return serverFetch("/api/startups");
};

export const getStartupDetails = async (startupData) => {
  return serverFetch(`/api/startup/${startupData}`);
};
