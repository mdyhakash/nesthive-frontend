"use client";

import { CheckCircle2, CreditCard, RotateCw } from "lucide-react";
import { DataTable, ListSkeleton, type Column } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/portal/section-card";
import { usePay } from "@/components/portal/use-pay";
import { Button } from "@/components/ui/button";
import { UTILITY_LABELS } from "@/data/utilities";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useTenant } from "@/hooks/use-tenant";
import { daysUntil, formatBDT, formatDate, formatMonth } from "@/lib/format";
import type { Payment } from "@/types";

export default function TenantPayments() {
  const t = useTenant();
  const { start, dialog } = usePay();
  const { status, retry } = useMockQuery(null);

  const history = t.payments
    .filter((p) => p.status !== "PENDING")
    .sort((a, b) => (b.paidAt ?? b.createdAt).localeCompare(a.paidAt ?? a.createdAt));
  const dues = [...t.dues].sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));

  const columns: Column<Payment>[] = [
    { key: "desc", header: "Payment", primary: true, cell: (p) => <span className="font-medium">{p.description}</span> },
    { key: "type", header: "Type", cell: (p) => <StatusBadge status={p.type} dot={false} /> },
    { key: "amount", header: "Amount", align: "right", cell: (p) => <span className="num font-semibold">{formatBDT(p.amount)}</span> },
    {
      key: "date",
      header: "Date",
      cell: (p) => <span className="text-muted-foreground">{formatDate(p.paidAt ?? p.createdAt)}</span>,
    },
    {
      key: "trx",
      header: "bKash trx",
      cell: (p) => (p.bkashTrxId ? <span className="num text-xs">{p.bkashTrxId}</span> : <span className="text-muted-foreground">—</span>),
    },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <>
      <PageHeader title="Payments" description="Pay rent, deposit instalments and utility shares with bKash, and see everything you have paid." />

      {status === "loading" && <ListSkeleton count={4} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" && (
        <div className="grid gap-6">
          <SectionCard title="Due now" description="Newest deadlines first.">
            {dues.length + t.unpaidSplits.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="You're all paid up" description="Nothing is due right now. We'll tell you when the next bill arrives." className="py-8" />
            ) : (
              <ul className="grid gap-3">
                {dues.map((p) => {
                  const days = p.dueDate ? daysUntil(p.dueDate) : null;
                  return (
                    <li key={p.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{p.description}</p>
                          <StatusBadge status={p.type} dot={false} />
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {p.dueDate ? `Due ${formatDate(p.dueDate)}${days !== null ? ` · in ${days} days` : ""}` : "No due date"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span className="num text-lg font-semibold">{formatBDT(p.amount)}</span>
                        <Button variant="bkash" onClick={() => start({ kind: "payment", payment: p })}>
                          Pay with bKash
                        </Button>
                      </div>
                    </li>
                  );
                })}
                {t.unpaidSplits.map(({ bill, split }) => (
                  <li key={bill.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {UTILITY_LABELS[bill.type]} · {formatMonth(bill.month)}
                        </p>
                        <StatusBadge status="UTILITY" dot={false} />
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Your share · due {formatDate(bill.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="num text-lg font-semibold">{formatBDT(split.amount)}</span>
                      <Button variant="bkash" onClick={() => start({ kind: "split", bill, split })}>
                        Pay with bKash
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <section aria-labelledby="history-title">
            <h2 id="history-title" className="mb-3 text-lg font-bold">
              Payment history
            </h2>
            <DataTable
              caption="Payment history"
              columns={columns}
              rows={history}
              rowKey={(p) => p.id}
              emptyIcon={CreditCard}
              emptyTitle="No payments yet"
              emptyDescription="Your receipts will appear here after your first payment."
              rowActions={(p) =>
                p.status === "FAILED" ? (
                  <Button size="sm" variant="outline" onClick={() => start({ kind: "payment", payment: p })}>
                    <RotateCw aria-hidden="true" />
                    Retry
                  </Button>
                ) : null
              }
            />
          </section>
        </div>
      )}
      {dialog}
    </>
  );
}
