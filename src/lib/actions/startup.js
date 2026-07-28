import { serverMutation } from "../core/server";

export const createStartup = async (addStartupData) => {
  return serverMutation("/api/startup", addStartupData);
};
