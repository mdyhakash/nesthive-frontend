"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { BottomNav } from "@/components/portal/bottom-nav";
import { RoleSwitcher } from "@/components/portal/role-switcher";
import { Sidebar } from "@/components/portal/sidebar";
import { Topbar } from "@/components/portal/topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { demoAccounts } from "@/data/users";
import type { Role } from "@/types";

const SIDEBAR_KEY = "nesthive.sidebar.collapsed";

function ShellSkeleton() {
  return (
    <div className="flex min-h-dvh" role="status" aria-label="Loading">
      <div className="hidden w-64 border-r border-border bg-card p-4 lg:block">
        <Skeleton className="mb-6 h-8 w-32" />
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="mb-2 h-11 w-full" />
        ))}
      </div>
      <div className="flex-1">
        <div className="h-16 border-b border-border" />
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Skeleton className="mb-6 h-9 w-56" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/**
 * The portal frame for one role: top bar, sidebar (lg+) or bottom tabs (<lg),
 * and the content container. Also the (mock) route guard.
 */
export function PortalShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { role: current, ready, switchRole } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    if (!current) router.replace("/login");
    // Demo convenience: deep-linking to another role's portal adopts that role.
    else if (current !== role) switchRole(role);
  }, [ready, current, role, router, switchRole]);

  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(SIDEBAR_KEY, c ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !c;
    });

  if (!ready || !current) return <ShellSkeleton />;

  return (
    <div className="flex min-h-dvh">
      <a
        href="#portal-main"
        className="sr-only z-50 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Sidebar role={role} collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} user={demoAccounts[role]} />
        <main id="portal-main" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>
      <BottomNav role={role} />
      <RoleSwitcher />
    </div>
  );
}
