import { serverFetch } from "../core/server";

export const getOpportunitiesByUserId = async (startupId) => {
  return serverFetch(`/api/my/opportunities?startupId=${startupId}`);
};

// export const getOpportunities = async (search, page, limit) => {
//   return serverFetch(
//     `/api/opportunities?search=${search}&page=${page}&limit=${limit}`,
//   );
// };

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
