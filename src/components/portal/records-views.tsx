"use client";

import * as React from "react";
import { CreditCard, FileText } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FilterSheet } from "@/components/shared/filter-sheet";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLookup } from "@/hooks/use-lookup";
import { useMockQuery } from "@/hooks/use-mock-query";
import { formatBDT, formatDate } from "@/lib/format";
import type { Lease, Payment } from "@/types";

/** Leases list (owner, manager read-only, admin). */
export function LeasesView({ leases, title = "Leases", description, showOwner }: { leases: Lease[]; title?: string; description: string; showOwner?: boolean }) {
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [tab, setTab] = React.useState<"ALL" | "ACTIVE" | "TERMINATED">("ALL");
  const rows = leases.filter((l) => tab === "ALL" || l.status === tab).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const count = (s: "ALL" | "ACTIVE" | "TERMINATED") => (s === "ALL" ? leases.length : leases.filter((l) => l.status === s).length);

  const columns: Column<Lease>[] = [
    { key: "tenant", header: "Tenant", primary: true, cell: (l) => <span className="font-semibold">{l.tenantName}</span> },
    { key: "place", header: "Property", cell: (l) => <span>{look.propertyTitle(l.propertyId)} · {look.roomName(l.roomId)}</span> },
    ...(showOwner ? [{ key: "owner", header: "Owner", cell: (l: Lease) => look.owner(l.ownerId)?.name ?? "—" }] : []),
    { key: "term", header: "Term", cell: (l) => <span>{formatDate(l.startDate)} – {formatDate(l.terminatedAt ?? l.endDate)}</span> },
    { key: "rent", header: "Rent", align: "right", cell: (l) => <span className="num">{formatBDT(l.monthlyRent)}</span> },
    { key: "deposit", header: "Deposit", align: "right", cell: (l) => <span className="num">{formatBDT(l.deposit)}</span> },
    { key: "status", header: "Status", cell: (l) => <StatusBadge status={l.status} /> },
  ];

  return (
    <>
      <PageHeader title={title} description={description} />
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList aria-label="Filter leases by status">
          {(["ALL", "ACTIVE", "TERMINATED"] as const).map((s) => (
            <TabsTrigger key={s} value={s}>
              {s === "ALL" ? "All" : s === "ACTIVE" ? "Active" : "Terminated"}
              <span className="num text-xs text-muted-foreground">{count(s)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-4">
        <DataTable caption={title} columns={columns} rows={rows} rowKey={(l) => l.id} status={status} onRetry={retry} emptyIcon={FileText} emptyTitle="No leases here" emptyDescription="Leases show up once a tenant moves in." />
      </div>
    </>
  );
}

const PAGE_SIZE = 8;

/** Payments list with status/type filters, a total summary and pagination. */
export function PaymentsView({ payments, title = "Payments", description, showTenant = true }: { payments: Payment[]; title?: string; description: string; showTenant?: boolean }) {
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [pay, setPay] = React.useState("ALL");
  const [type, setType] = React.useState("ALL");
  const [page, setPage] = React.useState(1);

  const filtered = payments
    .filter((p) => (pay === "ALL" || p.status === pay) && (type === "ALL" || p.type === type))
    .sort((a, b) => (b.paidAt ?? b.createdAt).localeCompare(a.paidAt ?? a.createdAt));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const sum = (s: string) => filtered.filter((p) => p.status === s).reduce((t, p) => t + p.amount, 0);
  const active = (pay !== "ALL" ? 1 : 0) + (type !== "ALL" ? 1 : 0);

  const columns: Column<Payment>[] = [
    { key: "desc", header: "Payment", primary: true, cell: (p) => <span className="font-semibold">{p.description}</span> },
    ...(showTenant ? [{ key: "tenant", header: "Tenant", cell: (p: Payment) => p.tenantName }] : []),
    { key: "place", header: "Property", cell: (p) => look.propertyTitle(p.propertyId) },
    { key: "type", header: "Type", cell: (p) => <StatusBadge status={p.type} dot={false} /> },
    { key: "amount", header: "Amount", align: "right", cell: (p) => <span className="num font-semibold">{formatBDT(p.amount)}</span> },
    { key: "date", header: "Date", cell: (p) => <span className="text-muted-foreground">{formatDate(p.paidAt ?? p.createdAt)}</span> },
    { key: "trx", header: "bKash trx", cell: (p) => (p.bkashTrxId ? <span className="num text-xs">{p.bkashTrxId}</span> : <span className="text-muted-foreground">—</span>) },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
  ];

  const controls = (
    <>
      <div className="grid gap-2">
        <Label htmlFor="pay-status">Status</Label>
        <Select value={pay} onValueChange={(v) => { setPay(v); setPage(1); }}>
          <SelectTrigger id="pay-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pay-type">Type</Label>
        <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
          <SelectTrigger id="pay-type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            <SelectItem value="RENT">Rent</SelectItem>
            <SelectItem value="DEPOSIT">Deposit</SelectItem>
            <SelectItem value="UTILITY">Utility</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <>
      <PageHeader title={title} description={description} />
      <dl className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Received", value: sum("PAID"), tone: "text-success-strong" },
          { label: "Pending", value: sum("PENDING"), tone: "text-warning-strong" },
          { label: "Failed", value: sum("FAILED"), tone: "text-danger-strong" },
        ].map((s) => (
          <div key={s.label} className="min-w-0 rounded-2xl border border-border bg-card p-3 sm:p-4">
            <dt className="text-xs text-muted-foreground sm:text-sm">{s.label}</dt>
            <dd className={`num mt-1 truncate text-base font-semibold sm:text-xl ${s.tone}`}>{formatBDT(s.value)}</dd>
          </div>
        ))}
      </dl>
      <div className="mb-4 flex items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground"><span className="num font-semibold text-foreground">{filtered.length}</span> payments</p>
        <div className="hidden gap-3 lg:flex [&>div]:w-40">{controls}</div>
        <div className="lg:hidden">
          <FilterSheet activeCount={active} onReset={() => { setPay("ALL"); setType("ALL"); setPage(1); }}>{controls}</FilterSheet>
        </div>
      </div>
      <DataTable caption={title} columns={columns} rows={rows} rowKey={(p) => p.id} status={status} onRetry={retry} emptyIcon={CreditCard} emptyTitle="No payments match" emptyDescription="Try changing the filters." />
      {status === "success" && <PaginationBar page={safePage} pageCount={pageCount} onPageChange={setPage} className="mt-4" />}
    </>
  );
}
