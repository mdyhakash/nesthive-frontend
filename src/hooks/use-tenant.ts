"use client";

import * as React from "react";
import { useData } from "@/components/data-provider";
import { CURRENT_TENANT_ID } from "@/data/users";

/** Everything that belongs to the signed-in demo tenant, derived from the live store. */
export function useTenant() {
  const d = useData();
  const id = CURRENT_TENANT_ID;

  return React.useMemo(() => {
    const lease = d.leases.find((l) => l.tenantId === id && l.status === "ACTIVE");
    const pastLeases = d.leases.filter((l) => l.tenantId === id && l.status === "TERMINATED");
    const viewings = d.viewings.filter((v) => v.tenantId === id);
    const applications = d.applications.filter((a) => a.tenantId === id);
    const payments = d.payments.filter((p) => p.tenantId === id);
    const dues = payments.filter((p) => p.status === "PENDING");
    const tickets = d.tickets.filter((t) => t.tenantId === id);
    const splits = d.bills
      .filter((b) => b.propertyId === lease?.propertyId)
      .flatMap((b) => {
        const s = b.splits.find((x) => x.occupantId === id);
        return s ? [{ bill: b, split: s }] : [];
      });
    const unpaidSplits = splits.filter((x) => !x.split.paid);
    const notifications = d.notifications.filter((n) => n.userId === id);
    return { id, lease, pastLeases, viewings, applications, payments, dues, tickets, splits, unpaidSplits, notifications };
  }, [d.leases, d.viewings, d.applications, d.payments, d.tickets, d.bills, d.notifications, id]);
}
