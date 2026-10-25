"use client";

import * as React from "react";
import { LeasesView } from "@/components/portal/records-views";
import { useAdminLeases } from "@/hooks/useAdmin";
import { extractData } from "@/lib/api-helper";
import type { Lease } from "@/types";

export default function AdminLeases() {
  const { data: leasesRes } = useAdminLeases();
  const rawLeases = extractData<any[]>(leasesRes) || [];

  const mappedLeases: Lease[] = React.useMemo(() => {
    if (!Array.isArray(rawLeases)) return [];
    return rawLeases.map((l: any) => ({
      id: l.id,
      propertyId: l.room?.property?.id || l.roomId,
      roomId: l.roomId,
      tenantId: l.tenantId,
      tenantName: l.tenant?.name || "Tenant",
      ownerId: l.ownerId,
      status: (l.status === "ACTIVE" ? "ACTIVE" : "TERMINATED") as any,
      startDate: l.startDate,
      endDate: l.endDate || l.startDate,
      deposit: Number(l.securityDeposit || l.depositAmount || 0),
      monthlyRent: Number(l.rentAmount || l.monthlyRent || 0),
      rentDueDay: 1,
      terms: [],
      terminatedAt: l.terminatedAt || undefined,
    }));
  }, [rawLeases]);

  return (
    <LeasesView
      leases={mappedLeases}
      title="All leases"
      description="Live leases from backend database across all owners."
      showOwner
    />
  );
}
