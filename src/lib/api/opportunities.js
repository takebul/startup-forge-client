import { serverFetch } from "../core/server";

export const getOpportunitiesByUserId = async (startupId) => {
  return serverFetch(`/api/my/opportunities?opportunityId=${startupId}`);
};

export const getOpportunities = async () => {
  return serverFetch("/api/opportunities");
};

export const getOpportunityDetails = async (params) => {
  return serverFetch(`/api/opportunity/${params}`);
};
