"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, CalendarClock, ClipboardList, CreditCard, FileText, Info, ReceiptText, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { ListSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useMockQuery } from "@/hooks/use-mock-query";
import { timeAgo } from "@/lib/format";
import { listItemProps } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { NotificationKind } from "@/types";

const ICONS: Record<NotificationKind, LucideIcon> = {
  PAYMENT: CreditCard,
  VIEWING: CalendarClock,
  APPLICATION: ClipboardList,
  LEASE: FileText,
  MAINTENANCE: Wrench,
  UTILITY: ReceiptText,
  KYC: ShieldCheck,
  SYSTEM: Info,
};

/** Notification list shared by every role: mark one or all as read. */
export function NotificationsView({ userId }: { userId: string }) {
  const d = useData();
  const { status, retry } = useMockQuery(null);
  const items = d.notifications.filter((n) => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unread = items.filter((n) => !n.read).length;

  const markOne = (id: string) => d.setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAll = () => {
    d.setNotifications((prev) => prev.map((n) => (n.userId === userId ? { ...n, read: true } : n)));
    toast.success("All caught up");
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        description={unread ? `You have ${unread} unread ${unread === 1 ? "notification" : "notifications"}.` : "You're all caught up."}
        action={
          <Button variant="outline" onClick={markAll} disabled={unread === 0}>
            <CheckCheck aria-hidden="true" />
            Mark all as read
          </Button>
        }
      />

      {status === "loading" && <ListSkeleton count={5} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="Updates about payments, viewings and tickets will show up here." />
        ) : (
          <ul className="grid gap-2">
            <AnimatePresence initial={false}>
              {items.map((n) => {
                const Icon = ICONS[n.kind];
                const inner = (
                  <>
                    <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", n.read ? "bg-muted text-muted-foreground" : "bg-teal-soft text-secondary")}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={cn("truncate text-sm", n.read ? "font-medium" : "font-bold")}>{n.title}</span>
                        {!n.read && <span className="size-2 shrink-0 rounded-full bg-secondary" aria-label="Unread" />}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{n.body}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                    </span>
                  </>
                );
                return (
                  <motion.li key={n.id} {...listItemProps} className="flex items-stretch gap-2 rounded-2xl border border-border bg-card">
                    {n.href ? (
                      <Link href={n.href} onClick={() => markOne(n.id)} className="flex min-w-0 flex-1 items-start gap-3 rounded-2xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex min-w-0 flex-1 items-start gap-3 p-4">{inner}</div>
                    )}
                    {!n.read && (
                      <Button variant="ghost" size="icon" className="my-auto mr-2 shrink-0" aria-label={`Mark "${n.title}" as read`} onClick={() => markOne(n.id)}>
                        <CheckCheck aria-hidden="true" />
                      </Button>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        ))}
    </>
  );
}
