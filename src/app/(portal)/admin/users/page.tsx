"use client";

import * as React from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FilterSheet } from "@/components/shared/filter-sheet";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useUpdateUserStatusMutation } from "@/hooks/useAdmin";
import { formatDate, timeAgo } from "@/lib/format";
import type { User } from "@/types";

const PAGE_SIZE = 8;
const ROLES = ["TENANT", "OWNER", "MANAGER", "ADMIN"] as const;

export default function AdminUsers() {
  const d = useData();
  const updateStatusMutation = useUpdateUserStatusMutation();
  const { status, retry } = useMockQuery(null);
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("ALL");
  const [state, setState] = React.useState("ALL");
  const [page, setPage] = React.useState(1);
  const [block, setBlock] = React.useState<User | null>(null);

  const filtered = d.users.filter(
    (u) => (role === "ALL" || u.role === role) && (state === "ALL" || u.status === state) && `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safe = Math.min(page, pageCount);
  const rows = filtered.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);
  const active = (role !== "ALL" ? 1 : 0) + (state !== "ALL" ? 1 : 0);

  const setStatus = (u: User, next: "ACTIVE" | "BLOCKED") => {
    updateStatusMutation.mutate({ userId: u.id, status: next });
    d.setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    d.audit({ actorId: "u-a1", actorName: "Tahmina Akter", actorRole: "ADMIN", action: next === "BLOCKED" ? "BLOCK" : "UNBLOCK", entity: "User", entityId: u.id, summary: `${next === "BLOCKED" ? "Blocked" : "Unblocked"} ${u.name}` });
    toast.success(next === "BLOCKED" ? `${u.name} blocked` : `${u.name} unblocked`);
  };

  const columns: Column<User>[] = [
    { key: "name", header: "User", primary: true, cell: (u) => <div className="flex min-w-0 items-center gap-3"><UserAvatar name={u.name} size="sm" /><div className="min-w-0"><p className="truncate font-semibold">{u.name}</p><p className="truncate text-xs font-normal text-muted-foreground">{u.email}</p></div></div> },
    { key: "role", header: "Role", cell: (u) => <span className="capitalize">{u.role.toLowerCase()}</span> },
    { key: "phone", header: "Phone", cell: (u) => <span className="num">{u.phone}</span> },
    { key: "joined", header: "Joined", cell: (u) => formatDate(u.createdAt) },
    { key: "active", header: "Last active", cell: (u) => (u.lastActiveAt ? timeAgo(u.lastActiveAt) : "Never") },
    { key: "status", header: "Status", cell: (u) => <StatusBadge status={u.status} /> },
  ];

  const controls = (
    <>
      <div className="grid gap-2">
        <Label htmlFor="u-role">Role</Label>
        <Select value={role} onValueChange={(v) => { setRole(v); setPage(1); }}>
          <SelectTrigger id="u-role"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            {ROLES.map((r) => <SelectItem key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="u-status">Status</Label>
        <Select value={state} onValueChange={(v) => { setState(v); setPage(1); }}>
          <SelectTrigger id="u-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <>
      <PageHeader title="Users" description="Search everyone on the platform. Blocked users can't sign in." />
      <div className="mb-4 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search users" placeholder="Search by name, email or phone" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <div className="hidden gap-2 lg:flex [&>div]:w-40">{controls}</div>
        <div className="lg:hidden"><FilterSheet activeCount={active} onReset={() => { setRole("ALL"); setState("ALL"); setPage(1); }}>{controls}</FilterSheet></div>
      </div>
      <DataTable
        caption="Users"
        columns={columns}
        rows={rows}
        rowKey={(u) => u.id}
        status={status}
        onRetry={retry}
        emptyIcon={Users}
        emptyTitle="No users match"
        emptyDescription="Try a different search or filter."
        rowActions={(u) =>
          u.role === "ADMIN" ? null : u.status === "ACTIVE" ? (
            <Button size="sm" variant="outline" onClick={() => setBlock(u)}>Block</Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setStatus(u, "ACTIVE")}>Unblock</Button>
          )
        }
      />
      {status === "success" && <PaginationBar page={safe} pageCount={pageCount} onPageChange={setPage} className="mt-4" />}
      <ConfirmDialog
        open={block !== null}
        onOpenChange={(v) => !v && setBlock(null)}
        title="Block this user?"
        description={<><strong>{block?.name}</strong> will be signed out and can&apos;t log in until you unblock them.</>}
        confirmLabel="Block user"
        cancelLabel="Cancel"
        onConfirm={() => block && setStatus(block, "BLOCKED")}
      />
    </>
  );
}
