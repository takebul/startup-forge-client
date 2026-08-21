import { serverMutation } from "../core/server";

export const markAllNotificationsRead = async (userId, role) => {
  return serverMutation(
    "/api/notifications/mark-all-read",
    { userId, role },
    "PATCH",
  );
};

export const markNotificationAsRead = async (notificationId) => {
  return serverMutation(
    `/api/notifications/${notificationId}/read`,
    {},
    "PATCH",
  );
};
