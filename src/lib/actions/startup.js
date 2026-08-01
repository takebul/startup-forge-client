import { deleteData, serverMutation } from "../core/server";

export const createStartup = async (addStartupData) => {
  return serverMutation("/api/startup", addStartupData);
};

export const updateStartup = async (params, updateData) => {
  return serverMutation(`/api/startup/${params}`, updateData, "PATCH");
};

export const deleteStartup = async (dataId) => {
  return deleteData(`/api/startup/${dataId}`);
};
