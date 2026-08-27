import { protectedFetch } from "../core/server";

// Fetch the current user's saved opportunities.
export const getBookmarksById = async (userId) => {
  return protectedFetch(`/api/my/bookmarks?userId=${userId}`);
};
