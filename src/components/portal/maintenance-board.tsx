"use client";

import * as React from "react";
import { Search, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FilterSheet } from "@/components/shared/filter-sheet";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLookup } from "@/hooks/use-lookup";
import { useMockQuery } from "@/hooks/use-mock-query";
import { MOCK_NOW, timeAgo } from "@/lib/format";
import type { MaintenanceTicket, Role, TicketStatus } from "@/types";

const PAGE_SIZE = 8;

interface Actor {
  id: string;
  name: string;
  role: Role;
}

/** Maintenance tickets with filters. Owners and managers can change status; admins view only. */
export function MaintenanceBoard({
  tickets,
  title = "Maintenance",
  description,
  actor,
  canUpdate,
}: {
  tickets: MaintenanceTicket[];
  title?: string;
  description: string;
  actor: Actor;
  canUpdate: boolean;
}) {
  const d = useData();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [q, setQ] = React.useState("");
  const [st, setSt] = React.useState("ALL");
  const [pr, setPr] = React.useState("ALL");
  const [page, setPage] = React.useState(1);

  const filtered = tickets
    .filter((t) => (st === "ALL" || t.status === st) && (pr === "ALL" || t.priority === pr) && `${t.title} ${t.tenantName} ${look.propertyTitle(t.propertyId)}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const active = (st !== "ALL" ? 1 : 0) + (pr !== "ALL" ? 1 : 0);

  const update = (t: MaintenanceTicket, next: TicketStatus) => {
    if (next === t.status) return;
    d.setTickets((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next, updatedAt: MOCK_NOW.toISOString() } : x)));
    d.audit({ actorId: actor.id, actorName: actor.name, actorRole: actor.role, action: "UPDATE", entity: "MaintenanceTicket", entityId: t.id, summary: `${actor.name} set "${t.title}" to ${next.toLowerCase().replace("_", " ")}` });
    d.notify({ userId: t.tenantId, kind: "MAINTENANCE", title: "Ticket updated", body: `"${t.title}" is now ${next.toLowerCase().replace("_", " ")}.`, href: `/tenant/maintenance/${t.id}` });
    toast.success("Ticket updated", { description: `Marked ${next.toLowerCase().replace("_", " ")}.` });
  };

  const columns: Column<MaintenanceTicket>[] = [
    {
      key: "title",
      header: "Ticket",
      primary: true,
      cell: (t) => (
        <div className="min-w-0">
          <p className="font-semibold">{t.title}</p>
          <p className="text-xs font-normal text-muted-foreground">{t.category} · {timeAgo(t.updatedAt)}</p>
        </div>
      ),
    },
    { key: "place", header: "Property", cell: (t) => <span>{look.propertyTitle(t.propertyId)}{t.roomId ? ` · ${look.roomName(t.roomId)}` : ""}</span> },
    { key: "tenant", header: "Tenant", cell: (t) => t.tenantName },
    { key: "priority", header: "Priority", cell: (t) => <StatusBadge status={t.priority} dot={false} /> },
    {
      key: "status",
      header: "Status",
      cell: (t) =>
        canUpdate ? (
          <Select value={t.status} onValueChange={(v) => update(t, v as TicketStatus)}>
            <SelectTrigger aria-label={`Status of ${t.title}`} className="h-10 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <StatusBadge status={t.status} />
        ),
    },
  ];

  const controls = (
    <>
      <div className="grid gap-2">
        <Label htmlFor="mt-status">Status</Label>
        <Select value={st} onValueChange={(v) => { setSt(v); setPage(1); }}>
          <SelectTrigger id="mt-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="mt-priority">Priority</Label>
        <Select value={pr} onValueChange={(v) => { setPr(v); setPage(1); }}>
          <SelectTrigger id="mt-priority"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All priorities</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="mb-4 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search tickets" placeholder="Search tickets, tenants or properties" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <div className="hidden gap-2 lg:flex [&>div]:w-40">{controls}</div>
        <div className="lg:hidden">
          <FilterSheet activeCount={active} onReset={() => { setSt("ALL"); setPr("ALL"); setPage(1); }}>{controls}</FilterSheet>
        </div>
      </div>
      <DataTable caption={title} columns={columns} rows={rows} rowKey={(t) => t.id} status={status} onRetry={retry} emptyIcon={Wrench} emptyTitle="No tickets match" emptyDescription="Try different filters, or enjoy the quiet: nothing needs fixing." />
      {status === "success" && <PaginationBar page={safePage} pageCount={pageCount} onPageChange={setPage} className="mt-4" />}
    </>
  );
}
