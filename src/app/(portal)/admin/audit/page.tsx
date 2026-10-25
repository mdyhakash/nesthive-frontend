"use client";

import * as React from "react";
import { History } from "lucide-react";
import { ListSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { FilterSheet } from "@/components/shared/filter-sheet";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAuditLogs } from "@/hooks/useAdmin";
import { extractData } from "@/lib/api-helper";
import { formatDateTime } from "@/lib/format";
import type { AuditLogItem, PaginatedAuditLogs } from "@/api/admin.api";

const ACTIONS = ["ALL", "CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "BLOCK", "UNBLOCK", "LOGIN", "KYC_APPROVED", "CREATE_MANAGER", "DELETE_MANAGER"];
const ENTITIES = ["ALL", "User", "Owner", "Property", "Room", "Application", "ViewingRequest", "Lease", "Payment", "Maintenance", "MANAGER"];
const TONE: Record<string, "success" | "danger" | "info" | "warning" | "neutral"> = {
  APPROVE: "success",
  KYC_APPROVED: "success",
  PUBLISH: "success",
  CREATE: "info",
  CREATE_MANAGER: "info",
  PAYMENT: "info",
  UPDATE: "neutral",
  LOGIN: "neutral",
  REJECT: "danger",
  BLOCK: "danger",
  DELETE: "danger",
  DELETE_MANAGER: "danger",
  UNBLOCK: "warning",
};

export default function AdminAudit() {
  const [action, setAction] = React.useState("ALL");
  const [entity, setEntity] = React.useState("ALL");
  const [page, setPage] = React.useState(1);

  const { data: auditRes, isLoading, isError, refetch } = useAdminAuditLogs(page);
  const rawData = extractData<PaginatedAuditLogs | AuditLogItem[]>(auditRes);

  let rawLogs: AuditLogItem[] = [];
  let totalPages = 1;

  if (rawData && "data" in rawData && Array.isArray(rawData.data)) {
    rawLogs = rawData.data;
    totalPages = rawData.meta?.totalPages || 1;
  } else if (Array.isArray(rawData)) {
    rawLogs = rawData;
  }

  const mapped = React.useMemo(() => {
    return rawLogs.map((l) => {
      const ent = l.entityType || l.entity || "System";
      const summary =
        l.meta?.summary ||
        (l.action === "KYC_APPROVED"
          ? `Approved KYC verification for owner (${l.entityId})`
          : l.action === "CREATE_MANAGER"
          ? `Created manager ${l.meta?.name || ""} (${l.entityId})`
          : l.action === "DELETE_MANAGER"
          ? `Deleted manager account (${l.entityId})`
          : `${l.action} performed on ${ent}`);

      return {
        id: l.id,
        action: l.action,
        entity: ent,
        entityId: l.entityId || "N/A",
        summary,
        timestamp: l.createdAt,
        actorName: l.actor?.name || "System",
        actorRole: (l.actor?.role || "ADMIN") as any,
      };
    });
  }, [rawLogs]);

  const filtered = mapped.filter(
    (l) =>
      (action === "ALL" || l.action.toLowerCase().includes(action.toLowerCase())) &&
      (entity === "ALL" || l.entity.toLowerCase().includes(entity.toLowerCase())),
  );

  const active = (action !== "ALL" ? 1 : 0) + (entity !== "ALL" ? 1 : 0);

  const controls = (
    <>
      <div className="grid gap-2">
        <Label htmlFor="a-action">Action</Label>
        <Select
          value={action}
          onValueChange={(v) => {
            setAction(v);
            setPage(1);
          }}
        >
          <SelectTrigger id="a-action">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a === "ALL" ? "All actions" : a.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="a-entity">Entity</Label>
        <Select
          value={entity}
          onValueChange={(v) => {
            setEntity(v);
            setPage(1);
          }}
        >
          <SelectTrigger id="a-entity">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ENTITIES.map((e) => (
              <SelectItem key={e} value={e}>
                {e === "ALL" ? "All entities" : e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <>
      <PageHeader
        title="Audit logs"
        description="Live platform activity recorded in database, newest first."
      />
      <div className="mb-4 flex items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="num font-semibold text-foreground">{filtered.length}</span> events
        </p>
        <div className="hidden gap-3 lg:flex [&>div]:w-48">{controls}</div>
        <div className="lg:hidden">
          <FilterSheet
            activeCount={active}
            onReset={() => {
              setAction("ALL");
              setEntity("ALL");
              setPage(1);
            }}
          >
            {controls}
          </FilterSheet>
        </div>
      </div>
      {isLoading && <ListSkeleton count={5} />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError &&
        (filtered.length === 0 ? (
          <EmptyState icon={History} title="No events match" description="Try clearing a filter." />
        ) : (
          <>
            <ol className="relative grid gap-0 border-l-2 border-border pl-5" aria-label="Audit timeline">
              {filtered.map((l) => (
                <li key={l.id} className="relative pb-5 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[1.6rem] top-1.5 size-3 rounded-full border-2 border-card bg-secondary"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={TONE[l.action] ?? "neutral"}>
                      {l.action.replace(/_/g, " ")}
                    </Badge>
                    <Badge tone="outline">{l.entity}</Badge>
                    <time dateTime={l.timestamp} className="num text-xs text-muted-foreground">
                      {formatDateTime(l.timestamp)}
                    </time>
                  </div>
                  <p className="mt-1.5 text-sm font-medium">{l.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.actorName} · {l.actorRole.toLowerCase()} · <span className="num">{l.entityId}</span>
                  </p>
                </li>
              ))}
            </ol>
            {totalPages > 1 && (
              <PaginationBar page={page} pageCount={totalPages} onPageChange={setPage} className="mt-6" />
            )}
          </>
        ))}
    </>
  );
}
