import { serverMutation } from "../core/server";

export const createOpportunity = (addOpportunityData) => {
  return serverMutation("/api/opportunity", addOpportunityData);
};

export const updateOpportunity = async (params, updateData) => {
  return serverMutation(`/api/opportunity/${params}`, updateData, "PATCH");
};

export const deleteOpportunity = async (deleteData) => {
  return serverMutation("/api/opportunity", deleteData, "DELETE");
};
