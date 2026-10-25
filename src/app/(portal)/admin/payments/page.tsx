"use client";

import * as React from "react";
import { PaymentsView } from "@/components/portal/records-views";
import { useAdminPayments } from "@/hooks/useAdmin";
import { extractData } from "@/lib/api-helper";
import type { Payment } from "@/types";

export default function AdminPayments() {
  const { data: paymentsRes } = useAdminPayments();
  const rawPayments = extractData<any>(paymentsRes);

  const mappedPayments: Payment[] = React.useMemo(() => {
    let list: any[] = [];
    if (rawPayments && "data" in rawPayments && Array.isArray(rawPayments.data)) {
      list = rawPayments.data;
    } else if (Array.isArray(rawPayments)) {
      list = rawPayments;
    }
    return list.map((p: any) => ({
      id: p.id,
      leaseId: p.leaseId || "",
      tenantId: p.tenantId || "",
      tenantName: p.tenant?.name || "Tenant",
      propertyId: p.propertyId || "",
      type: p.type || "RENT",
      amount: Number(p.amount || 0),
      status: p.status || "PENDING",
      bkashTrxId: p.transactionId,
      description: `${p.type || "Rent"} payment`,
      createdAt: p.createdAt,
      paidAt: p.paidAt,
    }));
  }, [rawPayments]);

  return (
    <PaymentsView
      payments={mappedPayments}
      title="All payments"
      description="Live platform transaction records from database."
    />
  );
}
