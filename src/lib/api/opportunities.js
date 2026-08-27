import { protectedFetch, serverFetch } from "../core/server";

export const getOpportunitiesByUserId = async (startupId) => {
  return protectedFetch(`/api/my/opportunities?startupId=${startupId}`);
};

// Fetch paginated opportunities using the active search filters.
export const getOpportunities = async ({
  search = "",
  workType = "",
  industry = "",
  page = 1,
  limit = 9,
} = {}) => {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (workType && workType !== "All") params.set("workType", workType);
  if (industry && industry !== "All") params.set("industry", industry);
  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());

  return serverFetch(`/api/opportunities?${params.toString()}`);
};

export const getFeaturedOpportunities = async () => {
  return serverFetch("/api/featured/opportunities");
};

export const getOpportunityDetails = async (params) => {
  return serverFetch(`/api/opportunity/${params}`);
};
