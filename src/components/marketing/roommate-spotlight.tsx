"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { Section } from "@/components/marketing/section";
import { ScoreRing } from "@/components/shared/score-ring";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMatches, defaultAnswers } from "@/data/roommates";
import { formatBDT } from "@/lib/format";
import { listItemProps } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { NoisePref, SleepSchedule } from "@/types";

const SLEEP: { value: SleepSchedule; label: string }[] = [
  { value: "EARLY_BIRD", label: "Early bird" },
  { value: "NIGHT_OWL", label: "Night owl" },
  { value: "FLEXIBLE", label: "Flexible" },
];
const NOISE: { value: NoisePref; label: string }[] = [
  { value: "QUIET", label: "Quiet" },
  { value: "MODERATE", label: "Moderate" },
  { value: "LIVELY", label: "Lively" },
];

function Chips<T extends string | number>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "min-h-11 rounded-xl border px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-secondary bg-teal-soft text-secondary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function RoommateSpotlight() {
  const [sleep, setSleep] = React.useState<SleepSchedule>("EARLY_BIRD");
  const [clean, setClean] = React.useState<number>(4);
  const [noise, setNoise] = React.useState<NoisePref>("QUIET");

  const matches = React.useMemo(
    () =>
      buildMatches({ ...defaultAnswers, sleepSchedule: sleep, cleanliness: clean as 1 | 2 | 3 | 4 | 5, noise }).slice(0, 3),
    [sleep, clean, noise],
  );

  return (
    <Section id="matching">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <RevealGroup className="min-w-0 max-w-lg">
          <RevealItem>
            <h2 className="text-section">Share a flat with someone who gets your routine</h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Answer eight short questions about sleep, cleanliness, smoking, pets, guests, noise, budget and who you&apos;d
              like to live with. NestHive compares your answers and shows a compatibility score for every match.
            </p>
          </RevealItem>
          <RevealItem>
            <ul className="mt-6 grid gap-2 text-sm text-muted-foreground">
              <li>Scores are based on your answers, never on guesses.</li>
              <li>You see the traits you share before you ever message anyone.</li>
              <li>Matches only include people inside your budget.</li>
            </ul>
          </RevealItem>
          <RevealItem>
            <Button asChild size="lg" className="mt-8">
              <Link href="/for-tenants#matching">
                See how matching works
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </RevealItem>
        </RevealGroup>

        {/* Interactive mock questionnaire + live matches */}
        <RevealGroup className="grid min-w-0 gap-4">
          <RevealItem className="grid min-w-0 gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold">Try it: three of the eight questions</h3>
              <Badge tone="teal">Sample</Badge>
            </div>
            <Chips legend="When do you sleep?" options={SLEEP} value={sleep} onChange={setSleep} />
            <Chips
              legend="How tidy are you? (1 relaxed, 5 spotless)"
              options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))}
              value={clean}
              onChange={setClean}
            />
            <Chips legend="Noise at home" options={NOISE} value={noise} onChange={setNoise} />
          </RevealItem>

          <RevealItem className="min-w-0">
            <ul className="grid min-w-0 gap-3" aria-live="polite" aria-label="Your top matches">
              <AnimatePresence mode="popLayout" initial={false}>
                {matches.map((m) => (
                  <motion.li
                    key={m.id}
                    {...listItemProps}
                    className="flex min-w-0 items-center gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <ScoreRing score={m.score} size={64} strokeWidth={6} label={`${m.name} compatibility`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={m.name} size="xs" />
                        <p className="truncate font-bold">{m.name}</p>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {m.occupation} · {m.area} · <span className="num">{formatBDT(m.budget)}</span>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.sharedTraits.slice(0, 3).map((t) => (
                          <Badge key={t} tone="teal">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </RevealItem>
        </RevealGroup>
      </div>
    </Section>
  );
}
