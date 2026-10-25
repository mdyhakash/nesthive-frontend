"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ClipboardList, X } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ListSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useLookup } from "@/hooks/use-lookup";
import { useTenantPortal } from "@/hooks/useTenantPortal";
import { formatBDT, formatDate } from "@/lib/format";
import { listItemProps } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

type StepState = "done" | "current" | "end-good" | "end-bad" | "todo";

/** Timeline: Submitted → Under review → decision. */
function timeline(a: Application): { label: string; note?: string; state: StepState }[] {
  const decided = a.status !== "PENDING";
  const last =
    a.status === "APPROVED"
      ? { label: "Approved", note: `Updated ${formatDate(a.updatedAt)}`, state: "end-good" as const }
      : a.status === "REJECTED"
        ? { label: "Rejected", note: a.rejectReason, state: "end-bad" as const }
        : a.status === "WITHDRAWN"
          ? { label: "Withdrawn by you", note: `On ${formatDate(a.updatedAt)}`, state: "end-bad" as const }
          : { label: "Decision", note: "The owner usually replies within 2 days", state: "todo" as const };
  return [
    { label: "Submitted", note: formatDate(a.createdAt), state: "done" },
    { label: "Under review", state: decided ? "done" : "current" },
    last,
  ];
}

function Dot({ state }: { state: StepState }) {
  const base = "flex size-6 shrink-0 items-center justify-center rounded-full border-2";
  if (state === "done") return <span className={cn(base, "border-secondary bg-secondary text-white")}><Check className="size-3.5" aria-hidden="true" /></span>;
  if (state === "end-good") return <span className={cn(base, "border-success bg-success text-white")}><Check className="size-3.5" aria-hidden="true" /></span>;
  if (state === "end-bad") return <span className={cn(base, "border-danger bg-danger text-white")}><X className="size-3.5" aria-hidden="true" /></span>;
  if (state === "current") return <span className={cn(base, "border-amber bg-amber-soft")}><span className="size-2 animate-pulse rounded-full bg-amber" /></span>;
  return <span className={cn(base, "border-border bg-card")} />;
}

export default function TenantApplications() {
  const d = useData();
  const t = useTenantPortal();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [withdrawId, setWithdrawId] = React.useState<string | null>(null);

  const rows = [...(t.applications as any[])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const withdraw = () => {
    const a = (t.applications as any[]).find((x) => x.id === withdrawId);
    if (!a) return;
    t.withdrawApplication(a.id);
    d.setApplications((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "WITHDRAWN", updatedAt: new Date().toISOString() } : x)));
    d.audit({ actorId: t.user?.id || "demo-tenant", actorName: a.tenantName || t.user?.name || "Tenant", actorRole: "TENANT", action: "UPDATE", entity: "Application", entityId: a.id, summary: `Withdrew an application` });
    toast.success("Application withdrawn");
  };

  return (
    <>
      <PageHeader title="My applications" description="Follow each application from submission to the owner's decision." />

      {status === "loading" && <ListSkeleton count={3} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (rows.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No applications yet"
            description="Found a room you like? Apply from its page and it will be tracked here."
            action={
              <Button asChild>
                <Link href="/browse">Browse rooms</Link>
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            <AnimatePresence initial={false}>
              {rows.map((a) => {
                const room = look.room(a.roomId);
                return (
                  <motion.li key={a.id} {...listItemProps} className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-bold">{look.propertyTitle(a.propertyId)}</h2>
                        <p className="text-sm text-muted-foreground">
                          {room?.name ?? "Room"}
                          {room && (
                            <>
                              {" · "}
                              <span className="num">{formatBDT(room.price)}</span>/mo
                            </>
                          )}
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Move-in <span className="font-medium text-foreground">{formatDate(a.moveInDate)}</span>
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">“{a.message}”</p>

                    <ol className="mt-5 grid gap-0" aria-label="Application progress">
                      {timeline(a).map((s, i, arr) => (
                        <li key={s.label} className="relative flex gap-3 pb-4 last:pb-0">
                          {i < arr.length - 1 && <span aria-hidden="true" className="absolute left-3 top-6 -ml-px h-[calc(100%-1.5rem)] w-0.5 bg-border" />}
                          <Dot state={s.state} />
                          <div className="min-w-0">
                            <p className={cn("text-sm font-semibold", s.state === "todo" && "text-muted-foreground")}>{s.label}</p>
                            {s.note && <p className="text-sm text-muted-foreground">{s.note}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>

                    {a.status === "PENDING" && (
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => setWithdrawId(a.id)}>
                        Withdraw application
                      </Button>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        ))}

      <ConfirmDialog
        open={withdrawId !== null}
        onOpenChange={(o) => !o && setWithdrawId(null)}
        title="Withdraw this application?"
        description="The owner will stop considering you for this room. You can apply again later if it is still available."
        confirmLabel="Withdraw"
        cancelLabel="Keep application"
        onConfirm={withdraw}
      />
    </>
  );
}
