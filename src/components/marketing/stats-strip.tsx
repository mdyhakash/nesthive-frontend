"use client";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { STATS } from "@/data/marketing";

export function StatsStrip() {
  return (
    <section aria-label="NestHive in numbers" className="border-y border-border bg-card">
      <RevealGroup className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((s) => (
          <RevealItem key={s.label} className="text-center">
            <p className="font-heading text-3xl font-extrabold sm:text-4xl">
              <AnimatedCounter value={s.value} suffix={s.suffix} mono={false} />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
