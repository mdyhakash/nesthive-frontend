"use client";

import * as React from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  /** 0–100 compatibility score. */
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

function toneFor(score: number) {
  if (score >= 80) return "var(--secondary)";
  if (score >= 60) return "var(--primary)";
  return "var(--danger)";
}

/** Animated circular progress ring for roommate compatibility. */
export function ScoreRing({ score, size = 72, strokeWidth = 7, label, className }: ScoreRingProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));

  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(clamped);
      return;
    }
    const controls = animate(0, clamped, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, clamped, reduce]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${label ?? "Compatibility"}: ${clamped} percent`}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={toneFor(clamped)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: inView ? circumference * (1 - clamped / 100) : circumference }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="num font-semibold" style={{ fontSize: Math.max(12, size * 0.3) }}>
          {shown}
          <span className="text-muted-foreground" style={{ fontSize: Math.max(9, size * 0.17) }}>
            %
          </span>
        </span>
      </span>
    </div>
  );
}
