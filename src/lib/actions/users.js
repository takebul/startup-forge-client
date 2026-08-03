import { serverMutation } from "../core/server";

export const updateUserProfile = async (userId, profileData) => {
  return serverMutation(`/api/user/profile/${userId}`, profileData, "PATCH");
};
