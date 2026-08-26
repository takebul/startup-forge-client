import { protectedFetch } from "../core/server";

export const getBookmarksById = async (userId) => {
  return protectedFetch(`/api/my/bookmarks?userId=${userId}`);
};
