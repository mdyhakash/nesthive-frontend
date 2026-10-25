"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UserCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newId, useData } from "@/components/data-provider";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useOwner } from "@/hooks/use-owner";
import { formatDate, MOCK_NOW } from "@/lib/format";
import { emailSchema, phoneSchema } from "@/lib/validation";
import type { Manager } from "@/types";

const schema = z.object({ name: z.string().min(2, "Enter the manager's full name"), email: emailSchema, phone: phoneSchema });
type Values = z.infer<typeof schema>;

export default function OwnerManagers() {
  const d = useData();
  const o = useOwner();
  const { status, retry } = useMockQuery(null);
  const [adding, setAdding] = React.useState(false);
  const [target, setTarget] = React.useState<Manager | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", phone: "" } });

  React.useEffect(() => {
    if (adding) reset({ name: "", email: "", phone: "" });
  }, [adding, reset]);

  const add = async (v: Values) => {
    await new Promise((r) => setTimeout(r, 400));
    if (o.managers.some((m) => m.email.toLowerCase() === v.email.toLowerCase())) {
      toast.error("That email is already a manager", { description: "Use a different email address." });
      return;
    }
    const userId = newId("u-m");
    const m: Manager = { id: newId("m"), userId, ownerId: o.id, name: v.name, email: v.email, phone: v.phone, status: "ACTIVE", assignedPropertyIds: [], joinedAt: MOCK_NOW.toISOString() };
    d.setManagers((prev) => [...prev, m]);
    d.setUsers((prev) => [...prev, { id: userId, name: v.name, email: v.email, phone: v.phone, role: "MANAGER", status: "ACTIVE", emailVerified: false, createdAt: MOCK_NOW.toISOString() }]);
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "CREATE", entity: "User", entityId: userId, summary: `${o.owner.name} added manager ${v.name}` });
    toast.success("Manager added", { description: "In a real setup they would get an invite email." });
    setAdding(false);
  };

  const setActive = (m: Manager, active: boolean) => {
    d.setManagers((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: active ? "ACTIVE" : "INACTIVE", assignedPropertyIds: active ? x.assignedPropertyIds : [] } : x)));
    if (!active) d.setProperties((prev) => prev.map((p) => (p.managerId === m.id ? { ...p, managerId: undefined } : p)));
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: active ? "UNBLOCK" : "BLOCK", entity: "User", entityId: m.userId, summary: `${o.owner.name} ${active ? "reactivated" : "deactivated"} manager ${m.name}` });
    toast.success(active ? "Manager reactivated" : "Manager deactivated");
  };

  const columns: Column<Manager>[] = [
    {
      key: "name",
      header: "Manager",
      primary: true,
      cell: (m) => (
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={m.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{m.name}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">{m.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", cell: (m) => <span className="num">{m.phone}</span> },
    { key: "props", header: "Properties", cell: (m) => <span className="num">{m.assignedPropertyIds.length}</span> },
    { key: "joined", header: "Joined", cell: (m) => formatDate(m.joinedAt) },
    { key: "status", header: "Status", cell: (m) => <StatusBadge status={m.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Managers"
        description="People who handle day-to-day maintenance for the properties you assign them."
        action={
          <Button onClick={() => setAdding(true)}>
            <Plus aria-hidden="true" />
            Add manager
          </Button>
        }
      />
      <DataTable
        caption="Managers"
        columns={columns}
        rows={o.managers}
        rowKey={(m) => m.id}
        status={status}
        onRetry={retry}
        emptyIcon={UserCog}
        emptyTitle="No managers yet"
        emptyDescription="Add a manager to hand off maintenance and day-to-day questions."
        emptyAction={<Button onClick={() => setAdding(true)}>Add manager</Button>}
        rowActions={(m) =>
          m.status === "ACTIVE" ? (
            <Button size="sm" variant="outline" onClick={() => setTarget(m)}>
              Deactivate
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setActive(m, true)}>
              Reactivate
            </Button>
          )
        }
      />

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add a manager</DialogTitle>
            <DialogDescription>You can assign properties to them from the Properties page.</DialogDescription>
          </DialogHeader>
          <form noValidate onSubmit={handleSubmit(add)} className="grid gap-4">
            <Field label="Full name" required error={errors.name?.message}>
              {(a) => <Input autoComplete="off" {...a} {...register("name")} />}
            </Field>
            <Field label="Email" required error={errors.email?.message}>
              {(a) => <Input type="email" autoComplete="off" {...a} {...register("email")} />}
            </Field>
            <Field label="Mobile number" required error={errors.phone?.message}>
              {(a) => <Input type="tel" inputMode="tel" placeholder="01712-345678" {...a} {...register("phone")} />}
            </Field>
            <DialogFooter className="mt-0">
              <Button type="button" variant="outline" onClick={() => setAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding…" : "Add manager"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(v) => !v && setTarget(null)}
        title="Deactivate this manager?"
        description={
          <>
            <strong>{target?.name}</strong> loses access and is removed from their {target?.assignedPropertyIds.length ?? 0} assigned properties. You can reactivate them later.
          </>
        }
        confirmLabel="Deactivate"
        cancelLabel="Keep active"
        onConfirm={() => target && setActive(target, false)}
      />
    </>
  );
}
