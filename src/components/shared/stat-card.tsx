"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { cardInteraction } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  /** Short context line, e.g. "+12% vs last month". */
  hint?: string;
  tone?: "amber" | "teal" | "info" | "danger" | "success";
  format?: (n: number) => string;
  className?: string;
}

const TONES = {
  amber: "bg-amber-soft text-warning-strong",
  teal: "bg-teal-soft text-secondary",
  info: "bg-info-soft text-info-strong",
  danger: "bg-danger-soft text-danger-strong",
  success: "bg-success-soft text-success-strong",
} as const;

export function StatCard({ label, value, icon: Icon, prefix, suffix, hint, tone = "amber", format, className }: StatCardProps) {
  return (
    <motion.div
      {...cardInteraction}
      className={cn("flex items-start gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5", className)}
    >
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", TONES[tone])}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold leading-tight">
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} format={format} />
        </p>
        {hint && <p className="mt-1 text-caption text-muted-foreground">{hint}</p>}
      </div>
    </motion.div>
  );
}
