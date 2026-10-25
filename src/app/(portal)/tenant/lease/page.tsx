"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, ScrollText } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState, EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyImage } from "@/components/shared/property-image";
import { StatusBadge } from "@/components/shared/status-badge";
import { InfoRow, SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useLookup } from "@/hooks/use-lookup";
import { useTenant } from "@/hooks/use-tenant";
import { formatBDT, formatDate, MOCK_NOW } from "@/lib/format";

export default function TenantLease() {
  const d = useData();
  const t = useTenant();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [confirm, setConfirm] = React.useState(false);

  const lease = t.lease;
  const property = look.property(lease?.propertyId);
  const room = look.room(lease?.roomId);
  const owner = look.owner(lease?.ownerId);

  const terminate = () => {
    if (!lease) return;
    d.setLeases((prev) => prev.map((l) => (l.id === lease.id ? { ...l, status: "TERMINATED", terminatedAt: MOCK_NOW.toISOString() } : l)));
    d.audit({ actorId: t.id, actorName: lease.tenantName, actorRole: "TENANT", action: "UPDATE", entity: "Lease", entityId: lease.id, summary: `${lease.tenantName} terminated their lease` });
    toast.success("Lease terminated", { description: "Your owner has been notified." });
  };

  return (
    <>
      <PageHeader title="My lease" description="Your agreement, terms and key dates in one place." />

      {status === "loading" && (
        <div role="status" aria-label="Loading" className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (!lease || !property ? (
          <div className="grid gap-6">
            <EmptyState
              icon={FileText}
              title="No active lease"
              description="You don't have a lease right now. Browse rooms and apply to get started."
              action={
                <Button asChild>
                  <Link href="/browse">Browse rooms</Link>
                </Button>
              }
            />
            {t.pastLeases.length > 0 && (
              <SectionCard title="Past leases">
                <ul className="divide-y divide-border">
                  {t.pastLeases.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <span className="min-w-0 truncate font-medium">{look.propertyTitle(l.propertyId)}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-muted-foreground">{formatDate(l.startDate)} – {formatDate(l.terminatedAt ?? l.endDate)}</span>
                        <StatusBadge status={l.status} />
                      </span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Lease details" action={<StatusBadge status={lease.status} />}>
              <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                <PropertyImage src={room?.images[0] ?? property.images[0]} alt={`${property.title}`} sizes="(min-width: 1024px) 40vw, 90vw" />
              </div>
              <dl className="divide-y divide-border">
                <InfoRow label="Property">{property.title}</InfoRow>
                <InfoRow label="Room">{room?.name ?? "—"}</InfoRow>
                <InfoRow label="Address">{property.address}</InfoRow>
                <InfoRow label="Owner">{owner?.name ?? "—"}</InfoRow>
                <InfoRow label="Start date">{formatDate(lease.startDate)}</InfoRow>
                <InfoRow label="End date">{formatDate(lease.endDate)}</InfoRow>
                <InfoRow label="Monthly rent"><span className="num">{formatBDT(lease.monthlyRent)}</span></InfoRow>
                <InfoRow label="Rent due on"><span className="num">{lease.rentDueDay}th</span> of each month</InfoRow>
                <InfoRow label="Security deposit"><span className="num">{formatBDT(lease.deposit)}</span></InfoRow>
              </dl>
            </SectionCard>

            <div className="grid content-start gap-4">
              <SectionCard title="Terms">
                <ol className="grid gap-3">
                  {lease.terms.map((term, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="num flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-soft text-xs font-semibold text-secondary">{i + 1}</span>
                      <span className="min-w-0 pt-0.5">{term}</span>
                    </li>
                  ))}
                </ol>
              </SectionCard>

              <SectionCard title="End your lease" description="Ending early may forfeit part of your deposit, as set out in the terms above.">
                <Button variant="destructive" onClick={() => setConfirm(true)}>
                  <ScrollText aria-hidden="true" />
                  Terminate lease
                </Button>
              </SectionCard>
            </div>
          </div>
        ))}

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Terminate your lease?"
        description={
          <>
            This ends your agreement for <strong>{property?.title}</strong> and tells your owner. It can&apos;t be undone from here.
          </>
        }
        confirmLabel="Terminate lease"
        cancelLabel="Keep my lease"
        onConfirm={terminate}
      />
    </>
  );
}
