import { serverMutation } from "../core/server";

export const createBookmark = async (addBookmarkData) => {
  return serverMutation("/api/bookmark", addBookmarkData);
};
