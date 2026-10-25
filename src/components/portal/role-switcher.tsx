"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FlaskConical } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useDemo } from "@/components/demo-provider";
import { Switch } from "@/components/ui/switch";
import { ROLE_ICON } from "@/lib/nav";
import { dropdownVariants } from "@/lib/motion";
import { ROLE_HOME, ROLE_LABEL, ROLES } from "@/lib/roles";
import { cn } from "@/lib/utils";

/** Small floating control, portal only: jump between roles and flip on error states. */
export function RoleSwitcher() {
  const { role, switchRole } = useAuth();
  const { simulateError, setSimulateError } = useDemo();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-20 left-3 z-40 lg:bottom-5 lg:left-auto lg:right-5">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Demo controls"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: "bottom left" }}
            className="absolute bottom-14 left-0 w-64 rounded-2xl border border-border bg-popover p-2 shadow-lg lg:left-auto lg:right-0"
          >
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">Demo: switch role</p>
            <ul className="grid gap-0.5">
              {ROLES.map((r) => {
                const Icon = ROLE_ICON[r];
                const active = r === role;
                return (
                  <li key={r}>
                    <button
                      type="button"
                      onClick={() => {
                        switchRole(r);
                        setOpen(false);
                        router.push(ROLE_HOME[r]);
                      }}
                      aria-current={active}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                        active && "bg-amber-soft",
                      )}
                    >
                      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                      <span className="flex-1 text-left">{ROLE_LABEL[r]}</span>
                      {active && <Check className="size-4 text-secondary" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-1 flex min-h-11 items-center justify-between gap-3 border-t border-border px-3 pt-2">
              <label htmlFor="sim-error" className="text-sm font-medium">
                Show error states
              </label>
              <Switch id="sim-error" checked={simulateError} onCheckedChange={setSimulateError} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Demo role switcher"
        className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-secondary shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <FlaskConical className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
