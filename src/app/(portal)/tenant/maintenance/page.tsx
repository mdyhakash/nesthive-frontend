"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Plus, Wrench } from "lucide-react";
import { ListSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useLookup } from "@/hooks/use-lookup";
import { useTenant } from "@/hooks/use-tenant";
import { timeAgo } from "@/lib/format";
import { listItemProps } from "@/lib/motion";
import type { TicketStatus } from "@/types";

const TABS: { value: "ALL" | TicketStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
];

export default function TenantMaintenance() {
  const t = useTenant();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [tab, setTab] = React.useState<"ALL" | TicketStatus>("ALL");

  const count = (s: "ALL" | TicketStatus) => (s === "ALL" ? t.tickets.length : t.tickets.filter((x) => x.status === s).length);
  const rows = t.tickets.filter((x) => tab === "ALL" || x.status === tab).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <>
      <PageHeader
        title="Maintenance"
        description="Report something that needs fixing and follow it until it is resolved."
        action={
          <Button asChild>
            <Link href="/tenant/maintenance/new">
              <Plus aria-hidden="true" />
              New ticket
            </Link>
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList aria-label="Filter tickets by status">
          {TABS.map((x) => (
            <TabsTrigger key={x.value} value={x.value}>
              {x.label}
              <span className="num text-xs text-muted-foreground">{count(x.value)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {status === "loading" && <ListSkeleton count={4} />}
        {status === "error" && <ErrorState onRetry={retry} />}
        {status === "success" &&
          (rows.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title={tab === "ALL" ? "No tickets yet" : "No tickets in this state"}
              description="Something broken? Create a ticket and your manager will pick it up."
              action={
                <Button asChild>
                  <Link href="/tenant/maintenance/new">New ticket</Link>
                </Button>
              }
            />
          ) : (
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3">
              <AnimatePresence initial={false}>
                {rows.map((x) => (
                  <motion.li key={x.id} {...listItemProps}>
                    <Link
                      href={`/tenant/maintenance/${x.id}`}
                      className="block rounded-2xl border border-border bg-card p-4 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate font-bold">{x.title}</h2>
                          <p className="text-sm text-muted-foreground">
                            {x.category} · {look.propertyTitle(x.propertyId)}
                          </p>
                        </div>
                        <StatusBadge status={x.status} />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <StatusBadge status={x.priority} label={`${x.priority.charAt(0)}${x.priority.slice(1).toLowerCase()} priority`} dot={false} />
                        <span>Updated {timeAgo(x.updatedAt)}</span>
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="size-3.5" aria-hidden="true" />
                          <span className="num">{x.comments.length}</span>
                        </span>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ))}
      </div>
    </>
  );
}
