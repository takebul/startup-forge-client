import { serverFetch } from "../core/server";

export const getBookmarksById = async (userId) => {
  return serverFetch(`/api/my/bookmarks?userId=${userId}`);
};
