"use client";

import * as React from "react";
import { MaintenanceBoard } from "@/components/portal/maintenance-board";
import { useAdminMaintenance } from "@/hooks/useAdmin";
import { useAuthStore } from "@/store/auth.store";
import { extractData } from "@/lib/api-helper";
import type { MaintenanceTicket } from "@/types";

export default function AdminMaintenance() {
  const { user } = useAuthStore();
  const { data: ticketsRes } = useAdminMaintenance();
  const rawTickets = extractData<any>(ticketsRes);

  const mappedTickets: MaintenanceTicket[] = React.useMemo(() => {
    let list: any[] = [];
    if (rawTickets && "data" in rawTickets && Array.isArray(rawTickets.data)) {
      list = rawTickets.data;
    } else if (Array.isArray(rawTickets)) {
      list = rawTickets;
    }
    return list.map((m: any) => ({
      id: m.id,
      propertyId: m.room?.property?.id || "p-1",
      roomId: m.roomId,
      tenantId: m.tenantId,
      tenantName: m.tenant?.name || "Tenant",
      title: m.title,
      description: m.description,
      category: (m.category === "PLUMBING" ? "Plumbing" : m.category === "ELECTRICAL" ? "Electrical" : "Other") as any,
      priority: (m.priority === "EMERGENCY" ? "URGENT" : m.priority || "MEDIUM") as any,
      status: (m.status === "RESOLVED" ? "RESOLVED" : m.status === "IN_PROGRESS" ? "IN_PROGRESS" : "OPEN") as any,
      imageUrl: m.imageUrl,
      comments: [],
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }, [rawTickets]);

  return (
    <MaintenanceBoard
      tickets={mappedTickets}
      title="All maintenance tickets"
      description="Live platform-wide maintenance requests from database."
      actor={{ id: user?.id || "u-a1", name: user?.name || "Admin", role: "ADMIN" }}
      canUpdate={false}
    />
  );
}
