import { protectedFetch } from "../core/server";

export const getNotifications = async (userId, role) => {
  if (!userId) return { notifications: [], unreadCount: 0 };
  return protectedFetch(`/api/notifications?userId=${userId}&role=${role}`);
};
