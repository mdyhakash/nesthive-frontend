"use client";

import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, Users } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { Section } from "@/components/marketing/section";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/format";

const MONTHS = [
  { m: "May", v: 38 },
  { m: "Jun", v: 52 },
  { m: "Jul", v: 47 },
  { m: "Aug", v: 66 },
  { m: "Sep", v: 78 },
  { m: "Oct", v: 91 },
];

/** Static, decorative mini dashboard. */
function DashboardMock() {
  return (
    <div
      role="img"
      aria-label="Preview of the owner dashboard showing monthly income, occupied rooms and recent applications"
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl shadow-black/10 sm:p-5"
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Properties", value: 9, icon: Building2, prefix: "" },
          { label: "Occupied", value: 24, icon: Users, prefix: "" },
          { label: "Income", value: 181500, icon: TrendingUp, prefix: "৳" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-muted p-3">
            <s.icon className="size-4 text-secondary" aria-hidden="true" />
            <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
            <p className="text-base font-semibold sm:text-lg">
              <AnimatedCounter value={s.value} prefix={s.prefix} />
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-muted p-3">
        <p className="text-xs text-muted-foreground">Rent collected</p>
        <div className="mt-3 flex h-24 items-end gap-2" aria-hidden="true">
          {MONTHS.map((b) => (
            <div key={b.m} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="w-full rounded-t-md bg-secondary" style={{ height: `${b.v}%`, minHeight: 4, opacity: 0.45 + b.v / 180 }} />
              <span className="text-[10px] text-muted-foreground">{b.m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        {[
          { name: "Farhana Akter", room: "Room 3, Green Nest", status: "PENDING" },
          { name: "Imran Hossain", room: "Room B, Lakeview", status: "APPROVED" },
        ].map((a) => (
          <div key={a.name} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{a.name}</p>
              <p className="truncate text-xs text-muted-foreground">{a.room}</p>
            </div>
            <StatusBadge status={a.status} />
          </div>
        ))}
      </div>
      <p className="sr-only">{formatBDT(181500)} collected this month</p>
    </div>
  );
}

export function OwnersCta() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-10 text-secondary-foreground sm:px-10 sm:py-14 lg:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/25 blur-3xl"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <RevealGroup>
            <RevealItem>
              <h2 className="text-section">Own a flat in Dhaka? Fill it with people you trust.</h2>
            </RevealItem>
            <RevealItem>
              <p className="mt-4 max-w-md text-base opacity-90 sm:text-lg">
                List rooms once, review verified applicants, collect rent through bKash and split utility bills without a
                spreadsheet.
              </p>
            </RevealItem>
            <RevealItem>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  <Link href="/register?role=OWNER">
                    List your property
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-secondary-foreground hover:bg-white/10 dark:hover:bg-black/10"
                >
                  <Link href="/for-owners">How it works for owners</Link>
                </Button>
              </div>
            </RevealItem>
          </RevealGroup>
          <RevealGroup>
            <RevealItem>
              <DashboardMock />
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
