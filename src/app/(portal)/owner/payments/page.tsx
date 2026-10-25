"use client";

import { PaymentsView } from "@/components/portal/records-views";
import { useOwner } from "@/hooks/use-owner";

export default function OwnerPayments() {
  const o = useOwner();
  return <PaymentsView payments={o.payments} description="Rent, deposits and utility payments your tenants have made through bKash." />;
}
