import { serverFetch } from "../core/server";

export const getOpportunitiesByUserId = async (startupId) => {
  return serverFetch(`/api/my/opportunities?startupId=${startupId}`);
};

export const getOpportunities = async (search, page, limit) => {
  return serverFetch(
    `/api/opportunities?search=${search}&page=${page}&limit=${limit}`,
  );
};

export const getFeaturedOpportunities = async () => {
  return serverFetch("/api/featured/opportunities");
};

export const getOpportunityDetails = async (params) => {
  return serverFetch(`/api/opportunity/${params}`);
};
