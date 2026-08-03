import { deleteData, serverMutation } from "../core/server";

export const createBookmark = async (addBookmarkData) => {
  return serverMutation("/api/bookmark", addBookmarkData);
};

export const deleteBookmark = async (dataId, userId) => {
  return deleteData(`/api/bookmark/${dataId}?userId=${userId || ""}`);
};
