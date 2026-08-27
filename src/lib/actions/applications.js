import { deleteData, serverMutation } from "../core/server";

// Create a new collaborator application.
export const createApplication = async (addApplicationData) => {
  return serverMutation("/api/application", addApplicationData);
};

// Update an existing application.
export const updateApplication = async (applicationId, updateData) => {
  return serverMutation(
    `/api/application/${applicationId}`,
    updateData,
    "PATCH",
  );
};

// Delete an application by ID.
export const deleteApplications = async (dataId) => {
  return deleteData(`/api/application/${dataId}`);
};
