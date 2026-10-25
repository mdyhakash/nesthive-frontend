"use client";

import * as React from "react";
import { useData } from "@/components/data-provider";
import { CURRENT_OWNER_ID } from "@/data/users";

/** Everything that belongs to the signed-in demo owner, derived from the live store. */
export function useOwner() {
  const d = useData();
  const id = CURRENT_OWNER_ID;

  return React.useMemo(() => {
    const owner = d.owners.find((o) => o.id === id)!;
    const allProperties = d.properties.filter((p) => p.ownerId === id);
    const properties = allProperties.filter((p) => !p.isDeleted);
    const ids = new Set(allProperties.map((p) => p.id));
    const rooms = d.rooms.filter((r) => ids.has(r.propertyId));
    const viewings = d.viewings.filter((v) => ids.has(v.propertyId));
    const applications = d.applications.filter((a) => ids.has(a.propertyId));
    const leases = d.leases.filter((l) => l.ownerId === id);
    const payments = d.payments.filter((p) => ids.has(p.propertyId));
    const bills = d.bills.filter((b) => ids.has(b.propertyId));
    const tickets = d.tickets.filter((t) => ids.has(t.propertyId));
    const managers = d.managers.filter((m) => m.ownerId === id);
    const notifications = d.notifications.filter((n) => n.userId === owner.userId);
    return { id, owner, properties, allProperties, rooms, viewings, applications, leases, payments, bills, tickets, managers, notifications };
  }, [d.owners, d.properties, d.rooms, d.viewings, d.applications, d.leases, d.payments, d.bills, d.tickets, d.managers, d.notifications, id]);
}
