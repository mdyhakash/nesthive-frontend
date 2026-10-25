"use client";

import * as React from "react";
import { toast } from "sonner";
import { BkashCheckout, type CheckoutItem } from "@/components/portal/bkash-checkout";
import { newId, useData } from "@/components/data-provider";
import { UTILITY_LABELS } from "@/data/utilities";
import { formatMonth, MOCK_NOW } from "@/lib/format";
import { useTenant } from "@/hooks/use-tenant";
import type { Payment, UtilityBill, UtilitySplit } from "@/types";

export type PayTarget =
  | { kind: "payment"; payment: Payment }
  | { kind: "split"; bill: UtilityBill; split: UtilitySplit };

function describe(t: PayTarget): CheckoutItem {
  if (t.kind === "payment") {
    return {
      label: t.payment.description,
      amount: t.payment.amount,
      detail: t.payment.dueDate ? `Due ${t.payment.dueDate}` : undefined,
    };
  }
  return {
    label: `${UTILITY_LABELS[t.bill.type]} · ${formatMonth(t.bill.month)}`,
    amount: t.split.amount,
    detail: `Your share of the ${UTILITY_LABELS[t.bill.type].toLowerCase()} bill`,
  };
}

/**
 * Shared "pay with bKash" flow for rent, deposits and utility splits.
 * `start(target)` opens the mock checkout; the store is updated on success.
 */
export function usePay() {
  const d = useData();
  const t = useTenant();
  const [target, setTarget] = React.useState<PayTarget | null>(null);
  const [open, setOpen] = React.useState(false);

  const start = React.useCallback((next: PayTarget) => {
    setTarget(next);
    setOpen(true);
  }, []);

  const onSuccess = (trxId: string, number: string) => {
    if (!target) return;
    const paidAt = MOCK_NOW.toISOString();
    if (target.kind === "payment") {
      const p = target.payment;
      d.setPayments((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, status: "PAID", bkashTrxId: trxId, bkashNumber: number, paidAt } : x)),
      );
      d.audit({ actorId: t.id, actorName: p.tenantName, actorRole: "TENANT", action: "PAYMENT", entity: "Payment", entityId: p.id, summary: `${p.tenantName} paid ${p.description} via bKash` });
    } else {
      const { bill, split } = target;
      d.setBills((prev) =>
        prev.map((b) =>
          b.id === bill.id
            ? { ...b, splits: b.splits.map((s) => (s.occupantId === split.occupantId ? { ...s, paid: true, paidAt } : s)) }
            : b,
        ),
      );
      const record: Payment = {
        id: newId("pay"),
        leaseId: t.lease?.id ?? "",
        tenantId: t.id,
        tenantName: split.name,
        propertyId: bill.propertyId,
        type: "UTILITY",
        amount: split.amount,
        status: "PAID",
        bkashTrxId: trxId,
        bkashNumber: number,
        description: `${UTILITY_LABELS[bill.type]} · ${formatMonth(bill.month)}`,
        paidAt,
        createdAt: paidAt,
      };
      d.setPayments((prev) => [record, ...prev]);
      d.audit({ actorId: t.id, actorName: split.name, actorRole: "TENANT", action: "PAYMENT", entity: "UtilityBill", entityId: bill.id, summary: `${split.name} paid their ${UTILITY_LABELS[bill.type].toLowerCase()} share` });
    }
    toast.success("Payment received", { description: `bKash transaction ${trxId}` });
  };

  const onFailure = (number: string) => {
    if (!target || target.kind !== "payment" || target.payment.status === "FAILED") return;
    const p = target.payment;
    // Record the failed attempt so it shows up (with Retry) in history.
    d.setPayments((prev) => [
      { ...p, id: newId("pay"), status: "FAILED", bkashNumber: number, createdAt: MOCK_NOW.toISOString(), paidAt: undefined, dueDate: p.dueDate },
      ...prev,
    ]);
    toast.error("Payment failed", { description: "Nothing was charged. You can retry from your history." });
  };

  const dialog = (
    <BkashCheckout
      open={open}
      onOpenChange={setOpen}
      item={target ? describe(target) : null}
      onSuccess={onSuccess}
      onFailure={onFailure}
    />
  );

  return { start, dialog };
}
