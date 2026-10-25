"use client";

import * as React from "react";
import { History } from "lucide-react";
import { useData } from "@/components/data-provider";
import { ListSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { FilterSheet } from "@/components/shared/filter-sheet";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMockQuery } from "@/hooks/use-mock-query";
import { formatDateTime } from "@/lib/format";
import type { AuditLog } from "@/types";

const PAGE_SIZE = 8;
const ACTIONS: AuditLog["action"][] = ["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "BLOCK", "UNBLOCK", "LOGIN", "PAYMENT", "PUBLISH"];
const ENTITIES: AuditLog["entity"][] = ["User", "Owner", "Property", "Room", "Application", "ViewingRequest", "Lease", "Payment", "UtilityBill", "MaintenanceTicket"];
const TONE: Record<string, "success" | "danger" | "info" | "warning" | "neutral"> = { APPROVE: "success", PUBLISH: "success", CREATE: "info", PAYMENT: "info", UPDATE: "neutral", LOGIN: "neutral", REJECT: "danger", BLOCK: "danger", DELETE: "danger", UNBLOCK: "warning" };

export default function AdminAudit() {
  const d = useData();
  const { status, retry } = useMockQuery(null);
  const [action, setAction] = React.useState("ALL");
  const [entity, setEntity] = React.useState("ALL");
  const [page, setPage] = React.useState(1);

  const filtered = d.auditLogs.filter((l) => (action === "ALL" || l.action === action) && (entity === "ALL" || l.entity === entity)).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safe = Math.min(page, pageCount);
  const rows = filtered.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);
  const active = (action !== "ALL" ? 1 : 0) + (entity !== "ALL" ? 1 : 0);

  const controls = (
    <>
      <div className="grid gap-2">
        <Label htmlFor="a-action">Action</Label>
        <Select value={action} onValueChange={(v) => { setAction(v); setPage(1); }}>
          <SelectTrigger id="a-action"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All actions</SelectItem>
            {ACTIONS.map((a) => <SelectItem key={a} value={a}>{a.charAt(0) + a.slice(1).toLowerCase()}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="a-entity">Entity</Label>
        <Select value={entity} onValueChange={(v) => { setEntity(v); setPage(1); }}>
          <SelectTrigger id="a-entity"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All entities</SelectItem>
            {ENTITIES.map((e) => <SelectItem key={e} value={e}>{e.replace(/([a-z])([A-Z])/g, "$1 $2")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <>
      <PageHeader title="Audit logs" description="Who did what, newest first." />
      <div className="mb-4 flex items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground"><span className="num font-semibold text-foreground">{filtered.length}</span> events</p>
        <div className="hidden gap-3 lg:flex [&>div]:w-48">{controls}</div>
        <div className="lg:hidden"><FilterSheet activeCount={active} onReset={() => { setAction("ALL"); setEntity("ALL"); setPage(1); }}>{controls}</FilterSheet></div>
      </div>
      {status === "loading" && <ListSkeleton count={5} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (rows.length === 0 ? (
          <EmptyState icon={History} title="No events match" description="Try clearing a filter." />
        ) : (
          <>
            <ol className="relative grid gap-0 border-l-2 border-border pl-5" aria-label="Audit timeline">
              {rows.map((l) => (
                <li key={l.id} className="relative pb-5 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-[1.6rem] top-1.5 size-3 rounded-full border-2 border-card bg-secondary" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={TONE[l.action] ?? "neutral"}>{l.action.charAt(0) + l.action.slice(1).toLowerCase()}</Badge>
                    <Badge tone="outline">{l.entity.replace(/([a-z])([A-Z])/g, "$1 $2")}</Badge>
                    <time dateTime={l.timestamp} className="num text-xs text-muted-foreground">{formatDateTime(l.timestamp)}</time>
                  </div>
                  <p className="mt-1.5 text-sm font-medium">{l.summary}</p>
                  <p className="text-xs text-muted-foreground">{l.actorName} · {l.actorRole.toLowerCase()} · <span className="num">{l.entityId}</span></p>
                </li>
              ))}
            </ol>
            <PaginationBar page={safe} pageCount={pageCount} onPageChange={setPage} className="mt-6" />
          </>
        ))}
    </>
  );
}
