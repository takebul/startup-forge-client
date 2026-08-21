import { serverFetch } from "../core/server";

export const getNotifications = async (userId, role) => {
  if (!userId) return { notifications: [], unreadCount: 0 };
  return serverFetch(`/api/notifications?userId=${userId}&role=${role}`);
};
