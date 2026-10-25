"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ListSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useLookup } from "@/hooks/use-lookup";
import { useTenantPortal } from "@/hooks/useTenantPortal";
import { formatDate } from "@/lib/format";
import { listItemProps } from "@/lib/motion";
import type { ViewingStatus } from "@/types";
import Link from "next/link";

const TABS: { value: "ALL" | ViewingStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function TenantViewings() {
  const d = useData();
  const t = useTenantPortal();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [tab, setTab] = React.useState<"ALL" | ViewingStatus>("ALL");
  const [cancelId, setCancelId] = React.useState<string | null>(null);

  const count = (s: "ALL" | ViewingStatus) => (s === "ALL" ? t.viewings.length : t.viewings.filter((v: any) => v.status === s).length);
  const rows = (t.viewings as any[])
    .filter((v) => tab === "ALL" || v.status === tab)
    .sort((a, b) => ((b.date || b.preferredDate || "") as string).localeCompare((a.date || a.preferredDate || "") as string));

  const cancel = () => {
    const v = (t.viewings as any[]).find((x) => x.id === cancelId);
    if (!v) return;
    t.cancelViewing(v.id);
    d.setViewings((prev) => prev.map((x) => (x.id === v.id ? { ...x, status: "CANCELLED" } : x)));
    d.audit({ actorId: t.user?.id || "demo-tenant", actorName: v.tenantName || t.user?.name || "Tenant", actorRole: "TENANT", action: "UPDATE", entity: "ViewingRequest", entityId: v.id, summary: `Cancelled a viewing request` });
    toast.success("Viewing request cancelled");
  };

  return (
    <>
      <PageHeader
        title="My viewing requests"
        description="Track the visits you have asked for. You can cancel a request while it is still pending."
        action={
          <Button asChild variant="outline">
            <Link href="/browse">Find a room</Link>
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList aria-label="Filter viewings by status">
          {TABS.map((x) => (
            <TabsTrigger key={x.value} value={x.value}>
              {x.label}
              <span className="num text-xs text-muted-foreground">{count(x.value)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {status === "loading" && <ListSkeleton count={4} />}
        {status === "error" && <ErrorState onRetry={retry} />}
        {status === "success" &&
          (rows.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title={tab === "ALL" ? "No viewing requests yet" : `No ${tab.toLowerCase()} requests`}
              description="Open any room and choose Request viewing to book a visit."
              action={
                tab === "ALL" ? (
                  <Button asChild>
                    <Link href="/browse">Browse rooms</Link>
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <ul className="grid gap-3">
              <AnimatePresence initial={false}>
                {rows.map((v) => (
                  <motion.li key={v.id} {...listItemProps} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-bold">{look.propertyTitle(v.propertyId)}</h2>
                        <p className="text-sm text-muted-foreground">
                          {v.roomId ? `${look.roomName(v.roomId)} · ` : ""}
                          {look.property(v.propertyId)?.area}
                        </p>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                    <p className="mt-3 text-sm">
                      <span className="font-semibold">{formatDate(v.date)}</span> · <span className="num">{v.timeSlot}</span>
                    </p>
                    {v.note && <p className="mt-2 text-sm text-muted-foreground">“{v.note}”</p>}
                    {v.status === "REJECTED" && v.rejectReason && (
                      <p className="mt-3 rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger-strong">
                        <span className="font-semibold">Reason: </span>
                        {v.rejectReason}
                      </p>
                    )}
                    {v.status === "PENDING" && (
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => setCancelId(v.id)}>
                        Cancel request
                      </Button>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ))}
      </div>

      <ConfirmDialog
        open={cancelId !== null}
        onOpenChange={(o) => !o && setCancelId(null)}
        title="Cancel this viewing request?"
        description="The owner will be told you are no longer coming. You can always request another time."
        confirmLabel="Cancel request"
        cancelLabel="Keep request"
        onConfirm={cancel}
      />
    </>
  );
}
