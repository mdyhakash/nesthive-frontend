"use client";

import * as React from "react";
import { Check, ClipboardList, X } from "lucide-react";
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
import { formatBDT, formatDate, MOCK_NOW } from "@/lib/format";
import type { Application, ApplicationStatus } from "@/types";

const TABS: { value: "ALL" | ApplicationStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

export default function OwnerApplications() {
  const d = useData();
  const o = useOwner();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [tab, setTab] = React.useState<"ALL" | ApplicationStatus>("PENDING");
  const [rejecting, setRejecting] = React.useState<Application | null>(null);

  const rows = o.applications.filter((a) => tab === "ALL" || a.status === tab).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const count = (s: "ALL" | ApplicationStatus) => (s === "ALL" ? o.applications.length : o.applications.filter((a) => a.status === s).length);

  const decide = (a: Application, next: "APPROVED" | "REJECTED", reason?: string) => {
    d.setApplications((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: next, rejectReason: reason, updatedAt: MOCK_NOW.toISOString() } : x)));
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: next === "APPROVED" ? "APPROVE" : "REJECT", entity: "Application", entityId: a.id, summary: `${o.owner.name} ${next === "APPROVED" ? "approved" : "rejected"} ${a.tenantName}'s application` });
    d.notify({ userId: a.tenantId, kind: "APPLICATION", title: next === "APPROVED" ? "Application approved" : "Application not approved", body: next === "APPROVED" ? `Great news! Your application for ${look.roomName(a.roomId)} at ${look.propertyTitle(a.propertyId)} was approved.` : `Your application was not approved: ${reason}`, href: "/tenant/applications" });
    toast.success(next === "APPROVED" ? "Application approved" : "Application rejected");
  };

  const columns: Column<Application>[] = [
    { key: "tenant", header: "Applicant", primary: true, cell: (a) => <span className="font-semibold">{a.tenantName}</span> },
    { key: "room", header: "Room", cell: (a) => <span>{look.roomName(a.roomId)} · {look.propertyTitle(a.propertyId)}</span> },
    { key: "rent", header: "Rent", align: "right", cell: (a) => <span className="num">{formatBDT(look.room(a.roomId)?.price ?? 0)}</span> },
    { key: "move", header: "Move-in", cell: (a) => formatDate(a.moveInDate) },
    { key: "msg", header: "Message", hideOnMobile: false, cell: (a) => <span className="line-clamp-2 max-w-64 text-left text-muted-foreground">{a.message}</span> },
    { key: "status", header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
  ];

  return (
    <>
      <PageHeader title="Applications" description="Review who wants to move in. Rejections need a reason, which the applicant will see." />
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList aria-label="Filter applications by status">
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
          caption="Applications"
          columns={columns}
          rows={rows}
          rowKey={(a) => a.id}
          status={status}
          onRetry={retry}
          emptyIcon={ClipboardList}
          emptyTitle="No applications here"
          emptyDescription="Applications for your published rooms will appear in this list."
          rowActions={(a) =>
            a.status === "PENDING" ? (
              <>
                <Button size="sm" onClick={() => decide(a, "APPROVED")}>
                  <Check aria-hidden="true" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => setRejecting(a)}>
                  <X aria-hidden="true" />
                  Reject
                </Button>
              </>
            ) : a.status === "REJECTED" && a.rejectReason ? (
              <span className="max-w-56 text-left text-xs text-muted-foreground">Reason: {a.rejectReason}</span>
            ) : null
          }
        />
      </div>
      <RejectDialog
        open={rejecting !== null}
        onOpenChange={(v) => !v && setRejecting(null)}
        title="Reject application"
        description={`Explain why ${rejecting?.tenantName ?? "this applicant"} wasn't selected. They will see your reason.`}
        onSubmit={(reason) => rejecting && decide(rejecting, "REJECTED", reason)}
      />
    </>
  );
}
