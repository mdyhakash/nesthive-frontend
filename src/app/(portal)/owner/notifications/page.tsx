"use client";

import { NotificationsView } from "@/components/portal/notifications-view";
import { useOwner } from "@/hooks/use-owner";

export default function OwnerNotifications() {
  const o = useOwner();
  return <NotificationsView userId={o.owner.userId} />;
}
