"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";

/** Animated progress bar (width eases to the new value). */
function Progress({
  className,
  value = 0,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }) {
  const pct = Math.max(0, Math.min(100, value ?? 0));
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={pct}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild>
        <motion.div
          className={cn("h-full rounded-full bg-primary", indicatorClassName)}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={transition.slow}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
