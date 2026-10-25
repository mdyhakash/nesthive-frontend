"use client";

import Link from "next/link";
import { ArrowRight, Banknote, BedDouble, Building2, ClipboardList, ShieldAlert } from "lucide-react";
import { ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLookup } from "@/hooks/use-lookup";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useOwnerPortal } from "@/hooks/useOwnerPortal";
import { formatBDT, timeAgo } from "@/lib/format";

export default function OwnerDashboard() {
  const o = useOwnerPortal();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);

  const occupied = o.rooms.filter((r) => r.occupantCount > 0).length;
  const income = o.leases.filter((l) => l.status === "ACTIVE").reduce((s, l) => s + l.monthlyRent, 0);
  const pending = o.applications.filter((a) => a.status === "PENDING").length;

  const activity = [
    ...o.applications.map((a) => ({ id: a.id, at: a.createdAt, text: `${a.tenantName} applied for ${look.roomName(a.roomId)}`, place: look.propertyTitle(a.propertyId), status: a.status })),
    ...o.viewings.map((v) => ({ id: v.id, at: v.createdAt, text: `${v.tenantName} requested a viewing`, place: look.propertyTitle(v.propertyId), status: v.status })),
    ...o.payments.filter((p) => p.status === "PAID").map((p) => ({ id: p.id, at: p.paidAt ?? p.createdAt, text: `${p.tenantName} paid ${formatBDT(p.amount)}`, place: p.description, status: p.status })),
    ...o.tickets.map((t) => ({ id: t.id, at: t.createdAt, text: `${t.tenantName} reported: ${t.title}`, place: look.propertyTitle(t.propertyId), status: t.status })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 7);

  const kyc = o.owner.kycStatus;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${o.owner.name.split(" ")[0]}`}
        description="A quick look at your properties, rooms and income."
        action={
          <Button asChild>
            <Link href="/owner/properties/new">Add property</Link>
          </Button>
        }
      />

      {kyc !== "APPROVED" && (
        <div role="status" className="mb-6 flex flex-col gap-3 rounded-2xl border border-warning/40 bg-amber-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning-strong" aria-hidden="true" />
            <p className="text-sm">
              <span className="font-semibold">
                {kyc === "PENDING" ? "Your verification is under review." : "Your verification was rejected."}
              </span>{" "}
              {kyc === "PENDING" ? "You can add properties, but publishing unlocks once we approve your documents." : "Fix the issues and resubmit so you can publish your listings."}
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/owner/kyc">{kyc === "PENDING" ? "View status" : "Resubmit documents"}</Link>
          </Button>
        </div>
      )}

      {status === "loading" && (
        <div role="status" aria-label="Loading" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
          <Skeleton className="h-72 sm:col-span-2 lg:col-span-4" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" && (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Properties" value={o.properties.length} icon={Building2} tone="teal" hint={`${o.properties.filter((p) => p.status === "PUBLISHED").length} published`} />
            <StatCard label="Occupied rooms" value={occupied} suffix={` / ${o.rooms.length}`} icon={BedDouble} tone="info" hint={`${o.rooms.length ? Math.round((occupied / o.rooms.length) * 100) : 0}% occupancy`} />
            <StatCard label="Monthly income" value={income} prefix="৳" icon={Banknote} tone="success" hint="From active leases" />
            <StatCard label="Pending applications" value={pending} icon={ClipboardList} tone="amber" hint={pending ? "Waiting for your decision" : "All reviewed"} />
          </div>

          <SectionCard
            title="Recent activity"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/owner/applications">
                  Applications <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            }
          >
            <ul className="divide-y divide-border">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.text}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.place} · {timeAgo(a.at)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}
    </>
  );
}
