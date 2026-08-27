import { protectedFetch, serverFetch } from "../core/server";

// Fetch the founder's startup workspace.
export const getFounderStartup = async (startupId) => {
  return protectedFetch(`/api/my/startup?startupId=${startupId}`);
};

// Fetch the public startup directory.
export const getStartups = async () => {
  return serverFetch("/api/startups");
};

// Fetch featured startups for the homepage.
export const getFeaturedStartups = async () => {
  return serverFetch("/api/featured/startups");
};

// Fetch one public startup profile.
export const getStartupDetails = async (startupData) => {
  return serverFetch(`/api/startup/${startupData}`);
};
