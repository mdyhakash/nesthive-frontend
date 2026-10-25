"use client";

import * as React from "react";
import { useData } from "@/components/data-provider";
import { CURRENT_MANAGER_ID } from "@/data/users";

/** Everything the signed-in demo manager can see: only properties assigned to them. */
export function useManager() {
  const d = useData();
  const id = CURRENT_MANAGER_ID;

  return React.useMemo(() => {
    const manager = d.managers.find((m) => m.id === id)!;
    const properties = d.properties.filter((p) => !p.isDeleted && (p.managerId === id || manager.assignedPropertyIds.includes(p.id)));
    const ids = new Set(properties.map((p) => p.id));
    const rooms = d.rooms.filter((r) => ids.has(r.propertyId));
    const tickets = d.tickets.filter((t) => ids.has(t.propertyId));
    const leases = d.leases.filter((l) => ids.has(l.propertyId));
    return { id, manager, properties, rooms, tickets, leases };
  }, [d.managers, d.properties, d.rooms, d.tickets, d.leases, id]);
}
