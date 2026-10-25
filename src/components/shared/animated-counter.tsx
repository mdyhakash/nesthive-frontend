"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { groupDigits } from "@/lib/format";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** Custom formatter for the running number (default: lakh-style digit grouping). */
  format?: (n: number) => string;
  className?: string;
  mono?: boolean;
}

/** Counts up from 0 to `value` when scrolled into view. */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.2,
  format = groupDigits,
  className,
  mono = true,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={[mono ? "num" : "tabular-nums", className].filter(Boolean).join(" ")}>
      {prefix}
      {format(display)}
      {suffix}
    </span>
  );
}
