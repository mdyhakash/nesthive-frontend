"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, FileCheck2, ShieldCheck, Users } from "lucide-react";
import { ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { BarChartCard } from "@/components/portal/chart-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOverview } from "@/hooks/useAdmin";
import { extractData } from "@/lib/api-helper";
import type { PlatformOverview as PlatformOverviewType } from "@/api/admin.api";

export default function AdminOverview() {
  const { data: overviewRes, isLoading, isError, refetch } = useAdminOverview();
  const live = extractData<PlatformOverviewType>(overviewRes);

  const totalUsers = live?.totalUsers ?? 0;
  const activeProperties = live?.publishedProperties ?? 0;
  const totalProperties = live?.totalProperties ?? 0;
  const draftProperties = Math.max(0, totalProperties - activeProperties);
  const activeLeases = live?.activeLeases ?? 0;
  const pendingKyc = live?.pendingKycCount ?? 0;

  const totalOwners = live?.totalOwners ?? 0;
  const totalTenants = live?.totalTenants ?? 0;
  const adminCount = Math.max(1, totalUsers - totalOwners - totalTenants);

  const usersByRole = React.useMemo(() => [
    { role: "Owners", count: totalOwners },
    { role: "Tenants", count: totalTenants },
    { role: "Admin", count: adminCount },
  ], [totalOwners, totalTenants, adminCount]);

  const propertiesByStatus = React.useMemo(() => [
    { status: "Published", count: activeProperties },
    { status: "Draft", count: draftProperties },
  ], [activeProperties, draftProperties]);

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Live data across NestHive from backend API."
        action={
          <Button asChild>
            <Link href="/admin/kyc">
              Review KYC{pendingKyc ? ` (${pendingKyc})` : ""}
            </Link>
          </Button>
        }
      />
      {isLoading && (
        <div role="status" aria-label="Loading" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
          <Skeleton className="h-80 sm:col-span-2 lg:col-span-4" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total users"
              value={totalUsers}
              icon={Users}
              tone="teal"
              hint="Registered accounts in DB"
            />
            <StatCard
              label="Active properties"
              value={activeProperties}
              icon={Building2}
              tone="info"
              hint="Published and bookable"
            />
            <StatCard
              label="Active leases"
              value={activeLeases}
              icon={FileCheck2}
              tone="success"
              hint="Live rental agreements"
            />
            <StatCard
              label="Pending KYC"
              value={pendingKyc}
              icon={ShieldCheck}
              tone={pendingKyc ? "amber" : "success"}
              hint={pendingKyc ? "Owners waiting for review" : "Queue is clear"}
            />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
            <BarChartCard
              title="Users by role"
              description="Live counts from registered accounts in database."
              data={usersByRole}
              xKey="role"
              series={[{ key: "count", label: "Users", color: "var(--chart-1)" }]}
              height={250}
            />
            <BarChartCard
              title="Properties by status"
              description="Live count of published vs draft listings in database."
              data={propertiesByStatus}
              xKey="status"
              series={[{ key: "count", label: "Properties", color: "var(--chart-2)" }]}
              height={250}
            />
          </div>
        </div>
      )}
    </>
  );
}
