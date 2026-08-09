import { serverMutation } from "../core/server";

export const updateUserProfile = async (userId, profileData) => {
  return serverMutation(`/api/user/profile/${userId}`, profileData, "PATCH");
};

export const updateUserStatus = async (userId, statusData) => {
  return serverMutation(`/api/user/${userId}`, statusData, "PATCH");
};
