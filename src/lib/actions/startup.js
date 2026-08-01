import { serverMutation } from "../core/server";

export const createStartup = async (addStartupData) => {
  return serverMutation("/api/startup", addStartupData);
};

export const updateStartup = async (params, updateData) => {
  return serverMutation(`/api/startup/${params}`, updateData, "PATCH");
};

export const deleteStartup = async (deleteData) => {
  return serverMutation("/api/startup", deleteData, "DELETE");
};
