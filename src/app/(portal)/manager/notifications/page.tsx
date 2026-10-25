"use client";

import { NotificationsView } from "@/components/portal/notifications-view";
import { useManager } from "@/hooks/use-manager";

export default function ManagerNotifications() {
  const m = useManager();
  return <NotificationsView userId={m.manager.userId} />;
}
