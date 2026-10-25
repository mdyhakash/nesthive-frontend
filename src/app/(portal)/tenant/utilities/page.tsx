"use client";

import { Receipt, Zap } from "lucide-react";
import { ListSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { usePay } from "@/components/portal/use-pay";
import { Button } from "@/components/ui/button";
import { UTILITY_LABELS } from "@/data/utilities";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useTenant } from "@/hooks/use-tenant";
import { formatBDT, formatDate, formatMonth } from "@/lib/format";

export default function TenantUtilities() {
  const t = useTenant();
  const { start, dialog } = usePay();
  const { status, retry } = useMockQuery(null);

  const rows = [...t.splits].sort((a, b) => b.bill.month.localeCompare(a.bill.month) || a.bill.type.localeCompare(b.bill.type));
  const owed = t.unpaidSplits.reduce((s, x) => s + x.split.amount, 0);

  return (
    <>
      <PageHeader
        title="Utility splits"
        description="Shared bills are divided between everyone in your flat. Here is your share of each."
      />

      {status === "loading" && <ListSkeleton count={4} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (rows.length === 0 ? (
          <EmptyState icon={Receipt} title="No utility bills yet" description="When your owner adds a bill for your flat, your share shows up here." />
        ) : (
          <div className="grid gap-4">
            {owed > 0 && (
              <p className="rounded-2xl border border-warning/30 bg-amber-soft px-4 py-3 text-sm">
                You owe <span className="num font-semibold">{formatBDT(owed)}</span> across {t.unpaidSplits.length}{" "}
                {t.unpaidSplits.length === 1 ? "bill" : "bills"}.
              </p>
            )}
            <ul className="grid gap-3 lg:grid-cols-2">
              {rows.map(({ bill, split }) => (
                <li key={bill.id} className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-soft text-warning-strong">
                        <Zap className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate font-bold">{UTILITY_LABELS[bill.type]}</h2>
                        <p className="text-sm text-muted-foreground">{formatMonth(bill.month)}</p>
                      </div>
                    </div>
                    <StatusBadge status={split.paid ? "PAID" : "PENDING"} label={split.paid ? "Paid" : "To pay"} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Bill total</dt>
                      <dd className="num font-medium">{formatBDT(bill.total)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Split between</dt>
                      <dd className="font-medium">{bill.splits.length} people</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Your share</dt>
                      <dd className="num text-lg font-semibold">{formatBDT(split.amount)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{split.paid ? "Paid on" : "Due"}</dt>
                      <dd className="font-medium">{formatDate(split.paid && split.paidAt ? split.paidAt : bill.dueDate)}</dd>
                    </div>
                  </dl>
                  {!split.paid && (
                    <Button variant="bkash" className="mt-4 w-full" onClick={() => start({ kind: "split", bill, split })}>
                      Pay {formatBDT(split.amount)} with bKash
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      {dialog}
    </>
  );
}
