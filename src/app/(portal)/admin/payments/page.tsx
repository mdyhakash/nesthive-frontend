"use client";

import { PaymentsView } from "@/components/portal/records-views";
import { useData } from "@/components/data-provider";

export default function AdminPayments() {
  const d = useData();
  return <PaymentsView payments={d.payments} title="All payments" description="Every bKash payment on the platform." />;
}
