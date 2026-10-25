"use client";

import { LeasesView } from "@/components/portal/records-views";
import { useManager } from "@/hooks/use-manager";

export default function ManagerLeases() {
  const m = useManager();
  return <LeasesView leases={m.leases} title="Leases overview" description="Read-only view of leases in the properties you manage." />;
}
