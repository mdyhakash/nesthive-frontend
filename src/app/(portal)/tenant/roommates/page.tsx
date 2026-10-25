"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, HeartHandshake, MapPin, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { ListSkeleton } from "@/components/shared/data-table";
import { ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreRing } from "@/components/shared/score-ring";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { BUDGET_MAX, BUDGET_MIN, buildMatches, myPreference, questionnaire } from "@/data/roommates";
import { useMockQuery } from "@/hooks/use-mock-query";
import { formatBDT } from "@/lib/format";
import { listItemProps } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { RoommatePreference } from "@/types";

type Answers = Omit<RoommatePreference, "userId" | "completedAt">;

const STEPS = [
  "sleepSchedule",
  "cleanliness",
  "smoking",
  "pets",
  "guests",
  "noise",
  "budget",
  "genderPreference",
] as const;
type StepKey = (typeof STEPS)[number];

const { userId: _u, completedAt: _c, ...MINE } = myPreference;
void _u;
void _c;

function Choice({ active, label, hint, onClick }: { active: boolean; label: string; hint?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-14 w-full flex-col items-start justify-center rounded-xl border px-4 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-secondary bg-teal-soft" : "border-border bg-card hover:bg-muted",
      )}
    >
      <span className={cn("text-sm font-semibold", active && "text-secondary")}>{label}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
}

function Questionnaire({ initial, onDone, onCancel }: { initial: Answers; onDone: (a: Answers) => void; onCancel?: () => void }) {
  const [answers, setAnswers] = React.useState<Answers>(initial);
  const [i, setI] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const key: StepKey = STEPS[i];
  const q = questionnaire[key];
  const last = i === STEPS.length - 1;

  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI(n);
  };

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers((a) => ({ ...a, [k]: v }));

  const options = key === "budget" ? [] : (questionnaire[key].options as readonly { value: string | number; label: string; hint?: string }[]);
  const cols = key === "cleanliness" ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-1 sm:grid-cols-3";

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">
          Question <span className="num">{i + 1}</span> of <span className="num">{STEPS.length}</span>
        </span>
        <span className="num text-muted-foreground">{Math.round(((i + 1) / STEPS.length) * 100)}%</span>
      </div>
      <Progress value={((i + 1) / STEPS.length) * 100} aria-label="Questionnaire progress" />

      <div className="relative mt-6 min-h-72 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={key}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 32 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -32 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <h2 className="text-xl font-bold">{q.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{q.description}</p>

            {key === "budget" ? (
              <div className="mt-8 px-1">
                <p className="num text-center text-2xl font-semibold">
                  {formatBDT(answers.budgetMin)} – {formatBDT(answers.budgetMax)}
                </p>
                <Slider
                  className="mt-8"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={500}
                  minStepsBetweenThumbs={2}
                  value={[answers.budgetMin, answers.budgetMax]}
                  onValueChange={([lo, hi]) => setAnswers((a) => ({ ...a, budgetMin: lo, budgetMax: hi }))}
                  aria-label="Monthly budget range"
                />
                <div className="num mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>{formatBDT(BUDGET_MIN)}</span>
                  <span>{formatBDT(BUDGET_MAX)}</span>
                </div>
              </div>
            ) : (
              <div role="group" aria-label={q.title} className={cn("mt-5 grid gap-2.5", cols)}>
                {options.map((o) => (
                  <Choice
                    key={String(o.value)}
                    label={o.label}
                    hint={o.hint}
                    active={answers[key as keyof Answers] === o.value}
                    onClick={() => set(key as keyof Answers, o.value as never)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {i > 0 ? (
          <Button variant="ghost" onClick={() => go(i - 1)}>
            <ArrowLeft aria-hidden="true" /> Back
          </Button>
        ) : onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <span />
        )}
        {last ? (
          <Button onClick={() => onDone(answers)}>
            <HeartHandshake aria-hidden="true" /> See my matches
          </Button>
        ) : (
          <Button onClick={() => go(i + 1)}>
            Next <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function TenantRoommates() {
  const { status, retry } = useMockQuery(null);
  const [answers, setAnswers] = React.useState<Answers | null>(MINE);
  const [editing, setEditing] = React.useState(false);
  const [contacted, setContacted] = React.useState<Set<string>>(new Set());

  const matches = React.useMemo(() => (answers ? buildMatches(answers).sort((a, b) => b.score - a.score) : []), [answers]);

  return (
    <>
      <PageHeader
        title="Roommate matches"
        description="Answer a few lifestyle questions and we'll rank people who'd be easy to live with."
        action={
          answers && !editing ? (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <RotateCcw aria-hidden="true" />
              Retake questionnaire
            </Button>
          ) : undefined
        }
      />

      {status === "loading" && <ListSkeleton count={4} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (editing || !answers ? (
          <Questionnaire
            initial={answers ?? MINE}
            onCancel={answers ? () => setEditing(false) : undefined}
            onDone={(a) => {
              setAnswers(a);
              setEditing(false);
              toast.success("Preferences saved", { description: "Your matches have been updated." });
            }}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              <span className="num font-semibold text-foreground">{matches.length}</span> people ranked by compatibility. Budget{" "}
              <span className="num">{formatBDT(answers.budgetMin)}–{formatBDT(answers.budgetMax)}</span>.
            </p>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence initial={false}>
                {matches.map((m) => (
                  <motion.li key={m.id} {...listItemProps} className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      <ScoreRing score={m.score} size={72} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <UserAvatar name={m.name} size="sm" />
                          <h2 className="truncate font-bold">{m.name}</h2>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{m.occupation}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="size-3.5" aria-hidden="true" /> {m.area}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm">
                      Budget <span className="num font-semibold">{formatBDT(m.budget)}</span>/mo
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Shared traits">
                      {m.sharedTraits.map((s) => (
                        <li key={s}>
                          <Badge tone="teal">{s}</Badge>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={contacted.has(m.id) ? "outline" : "secondary"}
                      className="mt-5"
                      disabled={contacted.has(m.id)}
                      onClick={() => {
                        setContacted((s) => new Set(s).add(m.id));
                        toast.success(`Intro sent to ${m.name.split(" ")[0]}`);
                      }}
                    >
                      {contacted.has(m.id) ? "Intro sent" : "Say hello"}
                    </Button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </>
        ))}
    </>
  );
}
