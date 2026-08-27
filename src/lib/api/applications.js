import { protectedFetch } from "../core/server";

// Fetch applications submitted by the current collaborator.
export const getApplicationsByCollaboratorId = async (collaboratorId) => {
  return protectedFetch(
    `/api/my/applications?collaboratorId=${collaboratorId}`,
  );
};

// Fetch applications received by a founder's startup.
export const getApplicationsByStartupId = async (startupId) => {
  return protectedFetch(`/api/founder/applications?startupId=${startupId}`);
};
