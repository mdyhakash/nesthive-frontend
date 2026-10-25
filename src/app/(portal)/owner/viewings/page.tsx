"use client";

import * as React from "react";
import { CalendarClock, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { RejectDialog } from "@/components/portal/reject-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLookup } from "@/hooks/use-lookup";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useOwner } from "@/hooks/use-owner";
import { formatDate } from "@/lib/format";
import type { ViewingRequest, ViewingStatus } from "@/types";

const TABS: { value: "ALL" | ViewingStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OwnerViewings() {
  const d = useData();
  const o = useOwner();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [tab, setTab] = React.useState<"ALL" | ViewingStatus>("PENDING");
  const [rejecting, setRejecting] = React.useState<ViewingRequest | null>(null);

  const rows = o.viewings.filter((v) => tab === "ALL" || v.status === tab).sort((a, b) => b.date.localeCompare(a.date));
  const count = (s: "ALL" | ViewingStatus) => (s === "ALL" ? o.viewings.length : o.viewings.filter((v) => v.status === s).length);

  const decide = (v: ViewingRequest, next: "APPROVED" | "REJECTED", reason?: string) => {
    d.setViewings((prev) => prev.map((x) => (x.id === v.id ? { ...x, status: next, rejectReason: reason } : x)));
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: next === "APPROVED" ? "APPROVE" : "REJECT", entity: "ViewingRequest", entityId: v.id, summary: `${o.owner.name} ${next === "APPROVED" ? "approved" : "rejected"} a viewing for ${v.tenantName}` });
    d.notify({ userId: v.tenantId, kind: "VIEWING", title: next === "APPROVED" ? "Viewing approved" : "Viewing declined", body: next === "APPROVED" ? `Your visit to ${look.propertyTitle(v.propertyId)} on ${formatDate(v.date)} is confirmed.` : `Your visit request was declined: ${reason}`, href: "/tenant/viewings" });
    toast.success(next === "APPROVED" ? "Viewing approved" : "Viewing rejected");
  };

  const columns: Column<ViewingRequest>[] = [
    { key: "tenant", header: "Tenant", primary: true, cell: (v) => <span className="font-semibold">{v.tenantName}</span> },
    { key: "place", header: "Property", cell: (v) => <span>{look.propertyTitle(v.propertyId)}{v.roomId ? ` · ${look.roomName(v.roomId)}` : ""}</span> },
    { key: "when", header: "When", cell: (v) => <span>{formatDate(v.date)} · <span className="num">{v.timeSlot}</span></span> },
    { key: "status", header: "Status", cell: (v) => <StatusBadge status={v.status} /> },
  ];

  return (
    <>
      <PageHeader title="Viewing requests" description="People who want to see your rooms. Approve a time or decline with a reason." />
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
        <DataTable
          caption="Viewing requests"
          columns={columns}
          rows={rows}
          rowKey={(v) => v.id}
          status={status}
          onRetry={retry}
          emptyIcon={CalendarClock}
          emptyTitle="No requests here"
          emptyDescription="New viewing requests for your rooms will show up in this list."
          rowActions={(v) =>
            v.status === "PENDING" ? (
              <>
                <Button size="sm" onClick={() => decide(v, "APPROVED")}>
                  <Check aria-hidden="true" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => setRejecting(v)}>
                  <X aria-hidden="true" />
                  Reject
                </Button>
              </>
            ) : v.status === "REJECTED" && v.rejectReason ? (
              <span className="max-w-56 text-left text-xs text-muted-foreground">Reason: {v.rejectReason}</span>
            ) : null
          }
        />
      </div>
      <RejectDialog
        open={rejecting !== null}
        onOpenChange={(v) => !v && setRejecting(null)}
        title="Reject viewing request"
        description={`Tell ${rejecting?.tenantName ?? "the tenant"} why you can't host this visit. They will see your reason.`}
        onSubmit={(reason) => rejecting && decide(rejecting, "REJECTED", reason)}
      />
    </>
  );
}
