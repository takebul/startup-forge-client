import { serverFetch } from "../core/server";

export const getPlansById = async (planId) => {
  return serverFetch(`/api/plans?plan_id=${planId}`);
};
