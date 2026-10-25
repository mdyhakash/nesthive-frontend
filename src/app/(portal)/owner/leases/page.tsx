"use client";

import { LeasesView } from "@/components/portal/records-views";
import { useOwner } from "@/hooks/use-owner";

export default function OwnerLeases() {
  const o = useOwner();
  return <LeasesView leases={o.leases} description="Every lease across your properties." />;
}
