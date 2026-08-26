import { protectedFetch } from "../core/server";

export const getApplicationsById = async (opportunityId) => {
  return protectedFetch(`/api/my/applications?applicationId=${opportunityId}`);
};

export const getApplicationsByCollaboratorId = async (collaboratorId) => {
  return protectedFetch(
    `/api/my/applications?collaboratorId=${collaboratorId}`,
  );
};

export const getApplicationsByStartupId = async (startupId) => {
  return protectedFetch(`/api/founder/applications?startupId=${startupId}`);
};
