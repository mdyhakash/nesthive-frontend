"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo, LogoMark } from "@/components/shared/logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { isActive, NAV } from "@/lib/nav";
import { transition } from "@/lib/motion";
import { ROLE_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

/** Desktop sidebar (lg+). Collapses to an icon rail; labels become tooltips. */
export function Sidebar({ role, collapsed, onToggle }: { role: Role; collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-card transition-[width] duration-300 ease-out motion-reduce:transition-none lg:flex",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
        {collapsed ? (
          <Link href={`/${role.toLowerCase()}`} aria-label="NestHive dashboard">
            <LogoMark />
          </Link>
        ) : (
          <Logo href={`/${role.toLowerCase()}`} />
        )}
      </div>

      <nav aria-label={`${ROLE_LABEL[role]} navigation`} className="flex-1 overflow-y-auto p-3">
        <ul className="grid gap-1">
          {NAV[role].map((item) => {
            const active = isActive(pathname, item);
            const link = (
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  collapsed && "justify-center px-0",
                  active ? "text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-amber-soft ring-1 ring-primary/40"
                    transition={transition.layout}
                  />
                )}
                <item.icon className={cn("relative size-5 shrink-0", active && "text-secondary")} aria-hidden="true" />
                {!collapsed && <span className="relative truncate">{item.label}</span>}
              </Link>
            );
            return (
              <li key={item.href}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          className={cn(
            "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
