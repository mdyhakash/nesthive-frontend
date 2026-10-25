"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt, Users } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newId, useData } from "@/components/data-provider";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { occupants as allOccupants } from "@/data/rooms";
import { UTILITY_LABELS } from "@/data/utilities";
import { useLookup } from "@/hooks/use-lookup";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useOwner } from "@/hooks/use-owner";
import { splitEqually } from "@/lib/split";
import { formatBDT, formatDate, formatMonth, MOCK_NOW } from "@/lib/format";
import type { UtilityBill, UtilitySplit, UtilityType } from "@/types";

const TYPES = Object.keys(UTILITY_LABELS) as UtilityType[];

const schema = z.object({
  propertyId: z.string().min(1, "Choose a property"),
  type: z.enum(["ELECTRICITY", "GAS", "WATER", "INTERNET", "SERVICE_CHARGE"], { message: "Choose a bill type" }),
  month: z.string().min(1, "Pick the billing month"),
  total: z.coerce.number({ message: "Enter the bill amount" }).int("Use whole taka").min(100, "Amount must be at least ৳100").max(500000, "That seems too high"),
  dueDate: z.string().min(1, "Pick a due date"),
});
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

export default function OwnerUtilities() {
  const d = useData();
  const o = useOwner();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({ resolver: zodResolver(schema), defaultValues: { propertyId: "", month: "2026-10", total: undefined, dueDate: "" } });

  const propertyId = useWatch({ control, name: "propertyId" });
  const totalRaw = useWatch({ control, name: "total" });
  const total = Number(totalRaw) > 0 ? Math.floor(Number(totalRaw)) : 0;

  const people = React.useMemo(() => {
    if (!propertyId) return [];
    const ids = new Set(d.rooms.filter((r) => r.propertyId === propertyId).map((r) => r.id));
    return allOccupants.filter((x) => ids.has(x.roomId));
  }, [propertyId, d.rooms]);
  const shares = splitEqually(total, people.length);

  const onSubmit = async (v: Out) => {
    if (people.length === 0) {
      toast.error("Nobody lives here yet", { description: "Pick a property with occupants to split the bill." });
      return;
    }
    await new Promise((r) => setTimeout(r, 400));
    const parts = splitEqually(v.total, people.length);
    const splits: UtilitySplit[] = people.map((p, i) => ({ occupantId: p.userId, name: p.name, amount: parts[i], paid: false }));
    const bill: UtilityBill = { id: newId("ub"), propertyId: v.propertyId, type: v.type, month: v.month, total: v.total, dueDate: v.dueDate, splits, createdAt: MOCK_NOW.toISOString() };
    d.setBills((prev) => [bill, ...prev]);
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "CREATE", entity: "UtilityBill", entityId: bill.id, summary: `${o.owner.name} added ${UTILITY_LABELS[v.type].toLowerCase()} bill ${formatBDT(v.total)} for ${look.propertyTitle(v.propertyId)}` });
    splits.filter((s) => s.occupantId.startsWith("u-")).forEach((s) =>
      d.notify({ userId: s.occupantId, kind: "UTILITY", title: "New utility split", body: `Your share of ${formatMonth(v.month)} ${UTILITY_LABELS[v.type].toLowerCase()} is ${formatBDT(s.amount)}. Due ${formatDate(v.dueDate)}.`, href: "/tenant/utilities" }),
    );
    toast.success("Bill created and split", { description: `${people.length} people notified.` });
    reset({ propertyId: v.propertyId, month: v.month, total: undefined, dueDate: "", type: undefined });
  };

  const history = [...o.bills].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const columns: Column<UtilityBill>[] = [
    { key: "bill", header: "Bill", primary: true, cell: (b) => <span className="font-semibold">{UTILITY_LABELS[b.type]} · {formatMonth(b.month)}</span> },
    { key: "place", header: "Property", cell: (b) => look.propertyTitle(b.propertyId) },
    { key: "total", header: "Total", align: "right", cell: (b) => <span className="num">{formatBDT(b.total)}</span> },
    { key: "due", header: "Due", cell: (b) => formatDate(b.dueDate) },
    {
      key: "paid",
      header: "Paid",
      cell: (b) => {
        const paid = b.splits.filter((s) => s.paid).length;
        return <StatusBadge status={paid === b.splits.length ? "PAID" : "PENDING"} label={`${paid} of ${b.splits.length} paid`} />;
      },
    },
  ];

  return (
    <>
      <PageHeader title="Utility bills" description="Add a bill and we split it equally between everyone living in the property." />

      <div className="grid gap-4 lg:grid-cols-5">
        <SectionCard title="New bill" className="lg:col-span-3">
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <Field label="Property" required error={errors.propertyId?.message}>
              {(a) => (
                <Controller
                  control={control}
                  name="propertyId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger {...a}><SelectValue placeholder="Choose a property" /></SelectTrigger>
                      <SelectContent>
                        {o.properties.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bill type" required error={errors.type?.message}>
                {(a) => (
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger {...a}><SelectValue placeholder="Choose a type" /></SelectTrigger>
                        <SelectContent>
                          {TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{UTILITY_LABELS[t]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </Field>
              <Field label="Month" required error={errors.month?.message}>
                {(a) => <Input type="month" {...a} {...register("month")} />}
              </Field>
              <Field label="Total amount (৳)" required error={errors.total?.message}>
                {(a) => <Input type="number" inputMode="numeric" placeholder="e.g. 4400" {...a} {...register("total")} />}
              </Field>
              <Field label="Due date" required error={errors.dueDate?.message}>
                {(a) => <Input type="date" {...a} {...register("dueDate")} />}
              </Field>
            </div>
            <Button type="submit" disabled={isSubmitting} className="justify-self-start">
              {isSubmitting ? "Creating…" : "Create and split bill"}
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Split preview" description="Updates as you type." className="self-start lg:col-span-2">
          <div aria-live="polite">
            {!propertyId ? (
              <p className="text-sm text-muted-foreground">Choose a property to see who shares the bill.</p>
            ) : people.length === 0 ? (
              <p className="flex items-start gap-2 text-sm text-muted-foreground"><Users className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Nobody lives in this property yet, so there is nobody to split with.</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {formatBDT(total)} between <span className="num font-semibold text-foreground">{people.length}</span> {people.length === 1 ? "person" : "people"}
                </p>
                <ul className="mt-3 divide-y divide-border">
                  {people.map((p, i) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="min-w-0 truncate">{p.name}</span>
                      <span className="num shrink-0 font-semibold">{formatBDT(shares[i] ?? 0)}</span>
                    </li>
                  ))}
                </ul>
                <p className="num mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatBDT(shares.reduce((s, x) => s + x, 0))}</span>
                </p>
              </>
            )}
          </div>
        </SectionCard>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">Bill history</h2>
      <DataTable caption="Utility bill history" columns={columns} rows={history} rowKey={(b) => b.id} status={status} onRetry={retry} emptyIcon={Receipt} emptyTitle="No bills yet" emptyDescription="Create your first bill above and it will be listed here." />
    </>
  );
}
