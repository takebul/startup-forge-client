import { serverFetch } from "../core/server";

export const getProfileData = async (userId) => {
  return serverFetch(`/api/user/profile/${userId}`);
};

export const getUsersData = async () => {
  return serverFetch("/api/users");
};
