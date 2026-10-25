"use client";

import { MaintenanceBoard } from "@/components/portal/maintenance-board";
import { useManager } from "@/hooks/use-manager";

export default function ManagerMaintenance() {
  const m = useManager();
  return <MaintenanceBoard tickets={m.tickets} title="Maintenance queue" description="Tickets for the properties you manage. Change the status as work moves along." actor={{ id: m.manager.userId, name: m.manager.name, role: "MANAGER" }} canUpdate />;
}
