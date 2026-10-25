"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Ellipsis } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BOTTOM_BAR, isActive, NAV } from "@/lib/nav";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

/** Fixed mobile tab bar: up to 5 slots, animated indicator, extra items live in "More". */
export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const items = NAV[role];
  const count = BOTTOM_BAR[role];
  const primary = items.slice(0, count);
  const more = items.slice(count);
  const moreActive = more.some((i) => isActive(pathname, i));

  const tab =
    "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <nav
      aria-label="Main"
      className="glass fixed inset-x-0 bottom-0 z-30 border-t border-border pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-xl items-stretch px-1">
        {primary.map((item) => {
          const active = isActive(pathname, item);
          return (
            <li key={item.href} className="flex flex-1">
              <Link href={item.href} aria-current={active ? "page" : undefined} className={cn(tab, active ? "text-secondary" : "text-muted-foreground")}>
                {active && (
                  <motion.span
                    layoutId="bottom-tab"
                    className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-secondary"
                    transition={transition.layout}
                  />
                )}
                <item.icon className="size-5" aria-hidden="true" />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
        {more.length > 0 && (
          <li className="flex flex-1">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button type="button" className={cn(tab, moreActive ? "text-secondary" : "text-muted-foreground")} aria-label="More">
                  {moreActive && (
                    <motion.span
                      layoutId="bottom-tab"
                      className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-secondary"
                      transition={transition.layout}
                    />
                  )}
                  <Ellipsis className="size-5" aria-hidden="true" />
                  <span>More</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>More</SheetTitle>
                  <SheetDescription className="sr-only">Other sections</SheetDescription>
                </SheetHeader>
                <ul className="grid grid-cols-3 gap-2 px-4 pb-6">
                  {more.map((item) => {
                    const active = isActive(pathname, item);
                    return (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border p-2 text-center text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              active ? "border-secondary bg-teal-soft text-secondary" : "border-border bg-card",
                            )}
                          >
                            <item.icon className="size-6" aria-hidden="true" />
                            {item.label}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </SheetContent>
            </Sheet>
          </li>
        )}
      </ul>
    </nav>
  );
}
