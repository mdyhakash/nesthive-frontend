"use client";

import { LeasesView } from "@/components/portal/records-views";
import { useData } from "@/components/data-provider";

export default function AdminLeases() {
  const d = useData();
  return <LeasesView leases={d.leases} title="All leases" description="Every lease across all owners." showOwner />;
}
