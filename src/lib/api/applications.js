import { serverFetch } from "../core/server";

export const getApplicationsById = async (opportunityId) => {
  return serverFetch(`/api/my/applications?applicationId=${opportunityId}`);
};
