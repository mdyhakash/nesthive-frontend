"use client";

import { MaintenanceBoard } from "@/components/portal/maintenance-board";
import { useData } from "@/components/data-provider";

export default function AdminMaintenance() {
  const d = useData();
  return <MaintenanceBoard tickets={d.tickets} title="All maintenance tickets" description="Platform-wide view. Owners and managers handle status changes." actor={{ id: "u-a1", name: "Tahmina Akter", role: "ADMIN" }} canUpdate={false} />;
}
