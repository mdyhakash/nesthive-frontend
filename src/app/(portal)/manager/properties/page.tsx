"use client";

import { Building2 } from "lucide-react";
import { CardGridSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyImage } from "@/components/shared/property-image";
import { StatusBadge } from "@/components/shared/status-badge";
import { useManager } from "@/hooks/use-manager";
import { useMockQuery } from "@/hooks/use-mock-query";
import { formatBDT } from "@/lib/format";

export default function ManagerProperties() {
  const m = useManager();
  const { status, retry } = useMockQuery(null);
  return (
    <>
      <PageHeader title="Assigned properties" description="Properties your owner has put in your care." />
      {status === "loading" && <CardGridSkeleton count={3} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (m.properties.length === 0 ? (
          <EmptyState icon={Building2} title="No properties assigned" description="Your owner can assign properties to you from their Properties page." />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {m.properties.map((p) => {
              const rooms = m.rooms.filter((r) => r.propertyId === p.id);
              const open = m.tickets.filter((t) => t.propertyId === p.id && t.status !== "RESOLVED").length;
              return (
                <li key={p.id} className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative aspect-[16/10] bg-muted">
                    <PropertyImage src={p.images[0]} alt={p.title} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="truncate font-bold">{p.title}</h2>
                        <p className="text-sm text-muted-foreground">{p.area}, Dhaka · {p.type}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div><dt className="text-xs text-muted-foreground">Rooms</dt><dd className="num font-semibold">{rooms.length}</dd></div>
                      <div><dt className="text-xs text-muted-foreground">Occupied</dt><dd className="num font-semibold">{rooms.filter((r) => r.occupantCount > 0).length}</dd></div>
                      <div><dt className="text-xs text-muted-foreground">Open tickets</dt><dd className="num font-semibold">{open}</dd></div>
                    </dl>
                    <p className="num mt-3 text-sm text-muted-foreground">From {formatBDT(p.rent)}/month</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ))}
    </>
  );
}
