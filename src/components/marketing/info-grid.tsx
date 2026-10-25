"use client";

import { motion } from "framer-motion";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { iconFor } from "@/lib/icons";
import { cardInteraction } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface InfoItem {
  title: string;
  body: string;
  icon: string;
}

const TINTS = [
  "bg-teal-soft text-secondary",
  "bg-amber-soft text-warning-strong",
  "bg-info-soft text-info-strong",
  "bg-success-soft text-success-strong",
];

/** Icon + title + body cards in a responsive grid. */
export function InfoGrid({ items, columns = 3, id }: { items: readonly InfoItem[]; columns?: 2 | 3; id?: string }) {
  return (
    <RevealGroup
      id={id}
      className={cn("grid scroll-mt-24 gap-4 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3")}
    >
      {items.map((item, i) => {
        const Icon = iconFor(item.icon);
        return (
          <RevealItem key={item.title} className="flex">
            <motion.article {...cardInteraction} className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <span className={cn("flex size-12 items-center justify-center rounded-xl", TINTS[i % TINTS.length])}>
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </motion.article>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
