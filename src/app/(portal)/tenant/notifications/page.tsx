"use client";

import { NotificationsView } from "@/components/portal/notifications-view";
import { useAuthStore } from "@/store/auth.store";

export default function TenantNotifications() {
  const { user } = useAuthStore();
  return <NotificationsView userId={user?.id || ""} />;
}
