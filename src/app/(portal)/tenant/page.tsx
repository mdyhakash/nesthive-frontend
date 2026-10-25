"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, CreditCard, FileText, HeartHandshake, Receipt, Search, Wrench } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyImage } from "@/components/shared/property-image";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useLookup } from "@/hooks/use-lookup";
import { useTenant } from "@/hooks/use-tenant";
import { daysUntil, formatBDT, formatDate, MOCK_NOW } from "@/lib/format";

const ACTIONS = [
  { label: "Pay rent", href: "/tenant/payments", icon: CreditCard },
  { label: "Report an issue", href: "/tenant/maintenance", icon: Wrench },
  { label: "Roommate matches", href: "/tenant/roommates", icon: HeartHandshake },
  { label: "Browse rooms", href: "/browse", icon: Search },
];

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="grid gap-4 lg:grid-cols-3">
      <Skeleton className="h-64 lg:col-span-2" />
      <Skeleton className="h-64" />
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-28" />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function TenantDashboard() {
  const { status, retry } = useMockQuery(null);
  const t = useTenant();
  const look = useLookup();

  const lease = t.lease;
  const property = look.property(lease?.propertyId);
  const room = look.room(lease?.roomId);

  const nextRent = t.dues
    .filter((p) => p.type === "RENT")
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))[0];
  const depositBalance = t.dues.filter((p) => p.type === "DEPOSIT").reduce((s, p) => s + p.amount, 0);
  const unpaidTotal = t.unpaidSplits.reduce((s, x) => s + x.split.amount, 0);
  const openTickets = t.tickets.filter((x) => x.status !== "RESOLVED");
  const upcoming = t.viewings
    .filter((v) => (v.status === "APPROVED" || v.status === "PENDING") && daysUntil(v.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const elapsed = lease
    ? Math.round(
        ((MOCK_NOW.getTime() - new Date(lease.startDate).getTime()) /
          (new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime())) *
          100,
      )
    : 0;

  return (
    <>
      <PageHeader
        title="Welcome back, Rafiq"
        description="Here is what needs your attention this month."
        action={
          <Button asChild>
            <Link href="/tenant/payments">
              <CreditCard aria-hidden="true" />
              Pay rent
            </Link>
          </Button>
        }
      />

      {status === "loading" && <DashboardSkeleton />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Current lease */}
          <SectionCard
            title="Your home"
            className="lg:col-span-2"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/tenant/lease">
                  Lease details
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            }
          >
            {lease && property && room ? (
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-56">
                  <PropertyImage src={room.images[0]} alt={`${room.name} at ${property.title}`} sizes="(min-width: 640px) 224px, 90vw" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{property.title}</h3>
                    <StatusBadge status={lease.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {room.name} · {property.area}, Dhaka
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Monthly rent</dt>
                      <dd className="num text-base font-semibold">{formatBDT(lease.monthlyRent)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Lease ends</dt>
                      <dd className="font-semibold">{formatDate(lease.endDate)}</dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>Lease progress</span>
                      <span className="num">{Math.max(0, Math.min(100, elapsed))}%</span>
                    </div>
                    <Progress value={elapsed} aria-label="Lease progress" />
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No active lease"
                description="When an owner approves your application and you sign, your lease shows up here."
                action={
                  <Button asChild>
                    <Link href="/browse">Browse rooms</Link>
                  </Button>
                }
              />
            )}
          </SectionCard>

          {/* Next rent */}
          <SectionCard title="Next rent due">
            {nextRent ? (
              <div>
                <p className="num text-3xl font-semibold">{formatBDT(nextRent.amount)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {nextRent.description}
                </p>
                <p className="mt-4 text-sm">
                  Due <span className="font-semibold">{formatDate(nextRent.dueDate ?? "")}</span>
                  {nextRent.dueDate && (
                    <span className="text-muted-foreground"> · in {daysUntil(nextRent.dueDate)} days</span>
                  )}
                </p>
                <Button asChild variant="secondary" className="mt-5 w-full">
                  <Link href="/tenant/payments">Pay with bKash</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You are all paid up. Nothing is due right now.</p>
            )}
          </SectionCard>

          {/* Stats */}
          <StatCard
            label="Unpaid utility splits"
            value={unpaidTotal}
            prefix="৳"
            icon={Receipt}
            tone="amber"
            hint={`${t.unpaidSplits.length} ${t.unpaidSplits.length === 1 ? "bill" : "bills"} waiting for you`}
          />
          <StatCard
            label="Open tickets"
            value={openTickets.length}
            icon={Wrench}
            tone="info"
            hint={openTickets.length ? "Tap Maintenance to follow up" : "Nothing needs fixing"}
          />
          <StatCard
            label="Deposit balance"
            value={depositBalance}
            prefix="৳"
            icon={CreditCard}
            tone={depositBalance ? "danger" : "success"}
            hint={depositBalance ? "Second instalment due 15 Nov" : "Deposit fully paid"}
          />

          {/* Viewings */}
          <SectionCard
            title="Upcoming viewings"
            className="lg:col-span-2"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/tenant/viewings">View all</Link>
              </Button>
            }
          >
            {upcoming.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No viewings booked"
                description="Request a visit on any room page and it will show up here."
                className="py-8"
              />
            ) : (
              <ul className="grid gap-3">
                {upcoming.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{look.propertyTitle(v.propertyId)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(v.date)} · <span className="num">{v.timeSlot}</span>
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Quick actions */}
          <SectionCard title="Quick actions">
            <ul className="grid grid-cols-2 gap-2">
              {ACTIONS.map((a) => (
                <li key={a.label}>
                  <Link
                    href={a.href}
                    className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-3 text-center text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <a.icon className="size-5 text-secondary" aria-hidden="true" />
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}
    </>
  );
}
