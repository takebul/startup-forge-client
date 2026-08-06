import { deleteData, serverMutation } from "../core/server";

export const createApplication = async (addApplicationData) => {
  return serverMutation("/api/application", addApplicationData);
};

export const updateApplication = async (applicationId, updateData) => {
  return serverMutation(
    `/api/application/${applicationId}`,
    updateData,
    "PATCH",
  );
};

export const deleteApplications = async (dataId) => {
  return deleteData(`/api/application/${dataId}`);
};
