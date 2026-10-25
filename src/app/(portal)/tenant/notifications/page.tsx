"use client";

import { NotificationsView } from "@/components/portal/notifications-view";
import { CURRENT_TENANT_ID } from "@/data/users";

export default function TenantNotifications() {
  return <NotificationsView userId={CURRENT_TENANT_ID} />;
}
