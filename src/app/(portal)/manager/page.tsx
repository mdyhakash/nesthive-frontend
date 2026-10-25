"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Building2, FileText, Wrench } from "lucide-react";
import { ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLookup } from "@/hooks/use-lookup";
import { useManager } from "@/hooks/use-manager";
import { useMockQuery } from "@/hooks/use-mock-query";
import { timeAgo } from "@/lib/format";

export default function ManagerDashboard() {
  const m = useManager();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);

  const open = m.tickets.filter((t) => t.status !== "RESOLVED");
  const urgent = open.filter((t) => t.priority === "URGENT" || t.priority === "HIGH");
  const queue = [...open].sort((a, b) => (a.priority === "URGENT" ? -1 : 0) - (b.priority === "URGENT" ? -1 : 0) || b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);

  return (
    <>
      <PageHeader title={`Hello, ${m.manager.name.split(" ")[0]}`} description="What needs attention across the properties you manage." action={<Button asChild><Link href="/manager/maintenance">Open queue</Link></Button>} />
      {status === "loading" && (
        <div role="status" aria-label="Loading" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28" />)}
          <Skeleton className="h-64 sm:col-span-2 lg:col-span-4" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" && (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Assigned properties" value={m.properties.length} icon={Building2} tone="teal" />
            <StatCard label="Open tickets" value={open.length} icon={Wrench} tone="info" />
            <StatCard label="Urgent or high" value={urgent.length} icon={AlertTriangle} tone={urgent.length ? "danger" : "success"} hint={urgent.length ? "Handle these first" : "Nothing urgent"} />
            <StatCard label="Active leases" value={m.leases.filter((l) => l.status === "ACTIVE").length} icon={FileText} tone="amber" />
          </div>
          <SectionCard title="Maintenance queue" action={<Button asChild variant="ghost" size="sm"><Link href="/manager/maintenance">All tickets <ArrowRight aria-hidden="true" /></Link></Button>}>
            {queue.length === 0 ? (
              <p className="text-sm text-muted-foreground">The queue is empty. Nice work.</p>
            ) : (
              <ul className="divide-y divide-border">
                {queue.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{t.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{look.propertyTitle(t.propertyId)} · {timeAgo(t.updatedAt)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <StatusBadge status={t.priority} dot={false} />
                      <StatusBadge status={t.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      )}
    </>
  );
}
