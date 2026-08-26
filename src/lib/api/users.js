import { protectedFetch } from "../core/server";

export const getProfileData = async (userId) => {
  return protectedFetch(`/api/user/profile/${userId}`);
};

export const getUsersData = async () => {
  return protectedFetch("/api/users");
};
