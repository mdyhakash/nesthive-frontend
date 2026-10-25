"use client";

import Link from "next/link";
import { Banknote, Building2, ShieldCheck, Users } from "lucide-react";
import { ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { BarChartCard } from "@/components/portal/chart-card";
import { useData } from "@/components/data-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { platformStats, propertiesByStatus, revenueByMonth, usersByRole } from "@/data/analytics";
import { useMockQuery } from "@/hooks/use-mock-query";

export default function AdminOverview() {
  const d = useData();
  const { status, retry } = useMockQuery(null);
  const pendingKyc = d.owners.filter((o) => o.kycStatus === "PENDING").length;

  return (
    <>
      <PageHeader title="Platform overview" description="Users, revenue and listings across NestHive." action={<Button asChild><Link href="/admin/kyc">Review KYC{pendingKyc ? ` (${pendingKyc})` : ""}</Link></Button>} />
      {status === "loading" && (
        <div role="status" aria-label="Loading" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28" />)}
          <Skeleton className="h-80 sm:col-span-2 lg:col-span-4" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" && (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total users" value={platformStats.totalUsers} icon={Users} tone="teal" hint="Across all roles" />
            <StatCard label="Active properties" value={platformStats.activeProperties} icon={Building2} tone="info" hint="Published and bookable" />
            <StatCard label="Monthly revenue" value={platformStats.monthlyRevenue} prefix="৳" icon={Banknote} tone="success" hint="Rent, deposits, utilities" />
            <StatCard label="Pending KYC" value={pendingKyc} icon={ShieldCheck} tone={pendingKyc ? "amber" : "success"} hint={pendingKyc ? "Owners waiting for review" : "Queue is clear"} />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
            <BarChartCard title="Revenue by month" description="Last 7 months, by payment type." data={revenueByMonth} xKey="month" money series={[
              { key: "rent", label: "Rent", color: "var(--chart-1)" },
              { key: "deposit", label: "Deposits", color: "var(--chart-3)" },
              { key: "utility", label: "Utilities", color: "var(--chart-2)" },
            ]} />
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
              <BarChartCard title="Users by role" description="Registered accounts." data={usersByRole as unknown as Record<string, string | number>[]} xKey="role" series={[{ key: "count", label: "Users", color: "var(--chart-1)" }]} height={200} />
            </div>
          </div>
          <BarChartCard title="Properties by status" description="Published, draft and soft-deleted listings." data={propertiesByStatus as unknown as Record<string, string | number>[]} xKey="status" series={[{ key: "count", label: "Properties", color: "var(--chart-1)" }]} height={200} />
        </div>
      )}
    </>
  );
}
