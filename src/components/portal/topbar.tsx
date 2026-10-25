"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useData } from "@/components/data-provider";
import { UserMenu } from "@/components/portal/user-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { titleFor } from "@/lib/nav";
import type { Role, User } from "@/types";

export function Topbar({ role, user }: { role: Role; user: User }) {
  const pathname = usePathname();
  const { notifications } = useData();
  const unread = notifications.filter((n) => n.userId === user.id && !n.read).length;
  const base = `/${role.toLowerCase()}`;

  return (
    <header className="glass sticky top-0 z-30 border-b border-border">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="lg:hidden">
            <Logo href={base} className="[&>span]:hidden" />
          </div>
          <p className="truncate font-heading text-lg font-bold lg:text-xl">
            {titleFor(role, pathname)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href={`${base}/notifications`} aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
              <Bell />
              {unread > 0 && (
                <span
                  aria-hidden="true"
                  className="num absolute right-1.5 top-1.5 flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-5 text-white ring-2 ring-background"
                >
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
