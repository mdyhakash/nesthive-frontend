import type { Notification } from "@/types";

export const notifications: Notification[] = [];

export const notificationsForUser = (userId: string) => notifications.filter((n) => n.userId === userId);
