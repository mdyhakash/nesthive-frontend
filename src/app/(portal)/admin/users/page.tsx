"use client";

import * as React from "react";
import { Search, Users } from "lucide-react";
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
import { useAdminUsers, useUpdateUserStatusMutation } from "@/hooks/useAdmin";
import { formatDate, timeAgo } from "@/lib/format";
import type { User } from "@/types";

const PAGE_SIZE = 8;
const ROLES = ["TENANT", "OWNER", "MANAGER", "ADMIN"] as const;

export default function AdminUsers() {
  const { users, isLoading, isError, refetch } = useAdminUsers();
  const updateStatusMutation = useUpdateUserStatusMutation();

  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("ALL");
  const [state, setState] = React.useState("ALL");
  const [page, setPage] = React.useState(1);
  const [block, setBlock] = React.useState<User | null>(null);

  const filtered = users.filter(
    (u) =>
      (role === "ALL" || u.role === role) &&
      (state === "ALL" || u.status === state) &&
      `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safe = Math.min(page, pageCount);
  const rows = filtered.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);
  const active = (role !== "ALL" ? 1 : 0) + (state !== "ALL" ? 1 : 0);

  const setStatus = (u: User, next: "ACTIVE" | "BLOCKED") => {
    updateStatusMutation.mutate(
      { userId: u.id, status: next },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User",
      primary: true,
      cell: (u) => (
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={u.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{u.name}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", cell: (u) => <span className="capitalize">{u.role.toLowerCase()}</span> },
    { key: "phone", header: "Phone", cell: (u) => <span className="num">{u.phone}</span> },
    { key: "joined", header: "Joined", cell: (u) => (u.createdAt ? formatDate(u.createdAt) : "—") },
    { key: "active", header: "Last active", cell: (u) => (u.lastActiveAt ? timeAgo(u.lastActiveAt) : "Never") },
    { key: "status", header: "Status", cell: (u) => <StatusBadge status={u.status} /> },
  ];

  const controls = (
    <>
      <div className="grid gap-2">
        <Label htmlFor="u-role">Role</Label>
        <Select
          value={role}
          onValueChange={(v) => {
            setRole(v);
            setPage(1);
          }}
        >
          <SelectTrigger id="u-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="u-status">Status</Label>
        <Select
          value={state}
          onValueChange={(v) => {
            setState(v);
            setPage(1);
          }}
        >
          <SelectTrigger id="u-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All states</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <>
      <PageHeader
        title="User directory"
        description="Live registered users from database across NestHive."
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, phone…"
            className="pl-9"
          />
        </div>
        <FilterSheet
          title="Filter users"
          activeCount={active}
          onReset={() => {
            setRole("ALL");
            setState("ALL");
            setPage(1);
          }}
        >
          {controls}
        </FilterSheet>
      </div>

      <div className="mt-4">
        <DataTable
          caption="Registered users"
          columns={columns}
          rows={rows}
          rowKey={(u) => u.id}
          status={isLoading ? "loading" : isError ? "error" : "success"}
          onRetry={() => refetch()}
          emptyIcon={Users}
          emptyTitle="No users found"
          emptyDescription="Try clearing filters or search query."
          rowActions={(u) =>
            u.role === "ADMIN" ? null : (
              <Button
                size="sm"
                variant={u.status === "ACTIVE" ? "destructive" : "outline"}
                disabled={updateStatusMutation.isPending}
                onClick={() => (u.status === "ACTIVE" ? setBlock(u) : setStatus(u, "ACTIVE"))}
              >
                {u.status === "ACTIVE" ? "Block" : "Unblock"}
              </Button>
            )
          }
        />
        {pageCount > 1 && (
          <div className="mt-4">
            <PaginationBar page={safe} pageCount={pageCount} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={block !== null}
        onOpenChange={(v) => !v && setBlock(null)}
        title={`Block ${block?.name}?`}
        description="Blocked users cannot log in or submit bookings. You can unblock them at any time."
        confirmLabel="Block account"
        destructive
        onConfirm={() => block && setStatus(block, "BLOCKED")}
      />
    </>
  );
}
