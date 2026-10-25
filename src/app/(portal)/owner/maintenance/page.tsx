"use client";

import { MaintenanceBoard } from "@/components/portal/maintenance-board";
import { useOwner } from "@/hooks/use-owner";

export default function OwnerMaintenance() {
  const o = useOwner();
  return <MaintenanceBoard tickets={o.tickets} description="Issues reported by tenants in your properties. Update the status as work progresses." actor={{ id: o.owner.userId, name: o.owner.name, role: "OWNER" }} canUpdate />;
}
