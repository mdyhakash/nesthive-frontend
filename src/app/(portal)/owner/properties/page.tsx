"use client";

import * as React from "react";
import Link from "next/link";
import { BedDouble, Building2, Lock, Pencil, Plus, Search, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FilterSheet } from "@/components/shared/filter-sheet";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyImage } from "@/components/shared/property-image";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useOwnerPortal } from "@/hooks/useOwnerPortal";
import { formatBDT } from "@/lib/format";
import type { Property } from "@/types";

const NONE = "none";

export default function OwnerProperties() {
  const d = useData();
  const o = useOwnerPortal();
  const { status, retry } = useMockQuery(null);
  const [q, setQ] = React.useState("");
  const [state, setState] = React.useState("ALL");
  const [del, setDel] = React.useState<Property | null>(null);
  const [assign, setAssign] = React.useState<Property | null>(null);
  const [mgr, setMgr] = React.useState(NONE);

  const kycOk = o.owner.kycStatus === "APPROVED";
  const rows = o.properties.filter(
    (p) => (state === "ALL" || p.status === state) && `${p.title} ${p.area} ${p.type}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const managerName = (id?: string) => o.managers.find((m) => m.id === id)?.name;
  const roomCount = (id: string) => o.rooms.filter((r) => r.propertyId === id).length;

  const togglePublish = (p: Property) => {
    const next = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    o.publishPropertyMutation.mutate(p.id);
    d.setProperties((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "PUBLISH", entity: "Property", entityId: p.id, summary: `${o.owner.name} ${next === "PUBLISHED" ? "published" : "unpublished"} ${p.title}` });
    toast.success(next === "PUBLISHED" ? "Property published" : "Moved back to draft");
  };

  const remove = () => {
    if (!del) return;
    o.deletePropertyMutation.mutate(del.id);
    d.setProperties((prev) => prev.map((x) => (x.id === del.id ? { ...x, isDeleted: true, status: "DRAFT" } : x)));
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "DELETE", entity: "Property", entityId: del.id, summary: `${o.owner.name} deleted ${del.title}` });
    toast.success("Property deleted", { description: "It was soft-deleted and hidden from Browse." });
  };

  const saveAssign = () => {
    if (!assign) return;
    const managerId = mgr === NONE ? undefined : mgr;
    d.setProperties((prev) => prev.map((x) => (x.id === assign.id ? { ...x, managerId } : x)));
    d.setManagers((prev) =>
      prev.map((m) => {
        const without = m.assignedPropertyIds.filter((id) => id !== assign.id);
        return m.id === managerId ? { ...m, assignedPropertyIds: [...without, assign.id] } : { ...m, assignedPropertyIds: without };
      }),
    );
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "UPDATE", entity: "Property", entityId: assign.id, summary: `${o.owner.name} ${managerId ? `assigned ${managerName(managerId)} to` : "removed the manager from"} ${assign.title}` });
    toast.success(managerId ? "Manager assigned" : "Manager removed");
    setAssign(null);
  };

  const columns: Column<Property>[] = [
    {
      key: "title",
      header: "Property",
      primary: true,
      cell: (p) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            <PropertyImage src={p.images[0]} alt="" sizes="48px" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{p.title}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">
              {p.area} · {p.type}
            </p>
          </div>
        </div>
      ),
    },
    { key: "rent", header: "From", align: "right", cell: (p) => <span className="num">{formatBDT(p.rent)}</span> },
    { key: "rooms", header: "Rooms", cell: (p) => <span className="num">{roomCount(p.id)}</span> },
    { key: "manager", header: "Manager", cell: (p) => managerName(p.managerId) ?? <span className="text-muted-foreground">Unassigned</span> },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
  ];

  const filterControl = (
    <div className="grid gap-2">
      <Label htmlFor="prop-status">Status</Label>
      <Select value={state} onValueChange={setState}>
        <SelectTrigger id="prop-status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          <SelectItem value="PUBLISHED">Published</SelectItem>
          <SelectItem value="DRAFT">Draft</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Properties"
        description="Manage your listings, rooms and managers."
        action={
          <Button asChild>
            <Link href="/owner/properties/new">
              <Plus aria-hidden="true" />
              Add property
            </Link>
          </Button>
        }
      />

      {!kycOk && (
        <p className="mb-4 flex items-start gap-2 rounded-2xl border border-warning/40 bg-amber-soft px-4 py-3 text-sm">
          <Lock className="mt-0.5 size-4 shrink-0 text-warning-strong" aria-hidden="true" />
          <span>
            Publishing is locked until your verification is approved.{" "}
            <Link href="/owner/kyc" className="font-semibold underline underline-offset-2">
              Go to verification
            </Link>
          </span>
        </p>
      )}

      <div className="mb-4 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search properties" placeholder="Search by name, area or type" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
        </div>
        <div className="hidden w-48 lg:block">{filterControl}</div>
        <div className="lg:hidden">
          <FilterSheet activeCount={state === "ALL" ? 0 : 1} onReset={() => setState("ALL")}>
            {filterControl}
          </FilterSheet>
        </div>
      </div>

      <DataTable
        caption="Your properties"
        columns={columns}
        rows={rows}
        rowKey={(p) => p.id}
        status={status}
        onRetry={retry}
        emptyIcon={Building2}
        emptyTitle={o.properties.length ? "No properties match" : "No properties yet"}
        emptyDescription={o.properties.length ? "Try a different search or status." : "Add your first property to start receiving applications."}
        emptyAction={
          !o.properties.length ? (
            <Button asChild>
              <Link href="/owner/properties/new">Add property</Link>
            </Button>
          ) : undefined
        }
        rowActions={(p) => (
          <>
            <Button asChild size="icon" variant="ghost" aria-label={`Rooms in ${p.title}`}>
              <Link href={`/owner/properties/${p.id}/rooms`}>
                <BedDouble aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="icon" variant="ghost" aria-label={`Edit ${p.title}`}>
              <Link href={`/owner/properties/${p.id}/edit`}>
                <Pencil aria-hidden="true" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" aria-label={`Assign manager to ${p.title}`} onClick={() => { setAssign(p); setMgr(p.managerId ?? NONE); }}>
              <UserCog aria-hidden="true" />
            </Button>
            <Button size="sm" variant="outline" disabled={p.status === "DRAFT" && !kycOk} onClick={() => togglePublish(p)} title={p.status === "DRAFT" && !kycOk ? "Verification required to publish" : undefined}>
              {p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
            </Button>
            <Button size="icon" variant="ghost" aria-label={`Delete ${p.title}`} onClick={() => setDel(p)}>
              <Trash2 className="text-danger-strong" aria-hidden="true" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        open={del !== null}
        onOpenChange={(v) => !v && setDel(null)}
        title="Delete this property?"
        description={
          <>
            <strong>{del?.title}</strong> will be hidden from Browse and from your list. Existing leases and payment history are kept.
          </>
        }
        confirmLabel="Delete property"
        cancelLabel="Keep property"
        onConfirm={remove}
      />

      <Dialog open={assign !== null} onOpenChange={(v) => !v && setAssign(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign a manager</DialogTitle>
            <DialogDescription>{assign?.title}. Managers can handle maintenance and see leases for the properties you give them.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="assign-manager">Manager</Label>
            <Select value={mgr} onValueChange={setMgr}>
              <SelectTrigger id="assign-manager">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>No manager</SelectItem>
                {o.managers
                  .filter((m) => m.status === "ACTIVE")
                  .map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssign(null)}>
              Cancel
            </Button>
            <Button onClick={saveAssign}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
