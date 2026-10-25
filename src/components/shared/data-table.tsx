"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { listItemProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  /** Cell renderer. */
  cell: (row: T) => React.ReactNode;
  /** Hide this column in the desktop table header alignment, e.g. "right". */
  align?: "left" | "right";
  /** On mobile cards: show as the card title (first column is used by default). */
  primary?: boolean;
  /** On mobile cards: omit this field. */
  hideOnMobile?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  status?: "loading" | "error" | "success";
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
  /** Actions rendered at the end of each row / card. */
  rowActions?: (row: T) => React.ReactNode;
  skeletonRows?: number;
  caption: string;
  className?: string;
}

/**
 * Table on md+, stacked cards below md. Handles skeleton, empty and error states
 * so every list in the app behaves the same way.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  status = "success",
  onRetry,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyIcon,
  emptyAction,
  rowActions,
  skeletonRows = 5,
  caption,
  className,
}: DataTableProps<T>) {
  if (status === "loading") return <TableSkeleton rows={skeletonRows} cols={Math.min(columns.length, 4)} />;
  if (status === "error") return <ErrorState onRetry={onRetry} />;
  if (rows.length === 0)
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} action={emptyAction} />;

  const primary = columns.find((c) => c.primary) ?? columns[0];
  const rest = columns.filter((c) => c !== primary && !c.hideOnMobile);

  return (
    <div className={className}>
      {/* Desktop table */}
      <div className="relative hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-muted/60 text-left text-xs font-semibold text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-4 py-3", c.align === "right" && "text-right")}>
                  {c.header}
                </th>
              ))}
              {rowActions && (
                <th scope="col" className="px-4 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.tr
                  key={rowKey(row)}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="transition-colors hover:bg-muted/40"
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-4 py-3.5 align-middle", c.align === "right" && "text-right", c.className)}>
                      {c.cell(row)}
                    </td>
                  ))}
                  {rowActions && <td className="px-4 py-3.5 text-right">{<div className="flex justify-end gap-2">{rowActions(row)}</div>}</td>}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="grid gap-3 md:hidden" aria-label={caption}>
        <AnimatePresence initial={false}>
          {rows.map((row) => (
            <motion.li key={rowKey(row)} {...listItemProps} className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 font-semibold">{primary.cell(row)}</div>
              <dl className="grid gap-2.5">
                {rest.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-4 text-sm">
                    <dt className="shrink-0 text-muted-foreground">{c.header}</dt>
                    <dd className="min-w-0 text-right">{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
              {rowActions && <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">{rowActions(row)}</div>}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div role="status" aria-label="Loading">
      <span className="sr-only">Loading…</span>
      <div className="relative hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
        <div className="h-11 bg-muted/60" />
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex items-center gap-6 border-t border-border px-4 py-4">
            {Array.from({ length: cols }, (_, c) => (
              <Skeleton key={c} className={cn("h-4", c === 0 ? "w-1/4" : "w-1/6")} />
            ))}
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:hidden">
        {Array.from({ length: Math.min(rows, 4) }, (_, r) => (
          <div key={r} className="rounded-2xl border border-border bg-card p-4">
            <Skeleton className="mb-4 h-5 w-2/3" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for card grids (properties, rooms, tickets...). */
export function CardGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      <span className="sr-only">Loading…</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="grid gap-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for stacked list cards. */
export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading" className="grid gap-3">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
