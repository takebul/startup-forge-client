import { protectedFetch } from "../core/server";

export const getPlansById = async (planId) => {
  return protectedFetch(`/api/plans?plan_id=${planId}`);
};
