"use client";

import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { Section, SectionHeading } from "@/components/marketing/section";
import { FEATURES } from "@/data/marketing";
import { iconFor } from "@/lib/icons";
import { cardInteraction } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TINTS = [
  "bg-teal-soft text-secondary",
  "bg-amber-soft text-warning-strong",
  "bg-info-soft text-info-strong",
  "bg-success-soft text-success-strong",
  "bg-amber-soft text-warning-strong",
  "bg-teal-soft text-secondary",
];

export function FeaturesBento() {
  return (
    <Section tinted>
      <SectionHeading
        title="Everything after the move-in, handled"
        description="Renting doesn't end when you get the keys. NestHive covers the monthly routine too."
      />
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => {
          const Icon = iconFor(f.icon);
          return (
            <RevealItem key={f.title} className={cn("flex", f.span)}>
              <motion.article
                {...cardInteraction}
                className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <span className={cn("flex size-12 items-center justify-center rounded-xl", TINTS[i % TINTS.length])}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </motion.article>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
