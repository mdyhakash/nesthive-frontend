import type { RoommateMatch, RoommatePreference } from "@/types";

type Answers = Omit<RoommatePreference, "userId" | "completedAt">;

export interface QuestionOption<T extends string | number = string> {
  value: T;
  label: string;
  hint?: string;
}

export const questionnaire = {
  sleepSchedule: {
    title: "When do you usually sleep?",
    description: "Rhythms matter more than most people expect when sharing a flat.",
    options: [
      { value: "EARLY_BIRD", label: "Early bird", hint: "In bed by 10, up before 7" },
      { value: "NIGHT_OWL", label: "Night owl", hint: "Up past midnight most days" },
      { value: "FLEXIBLE", label: "Flexible", hint: "Depends on the day" },
    ] satisfies QuestionOption[],
  },
  cleanliness: {
    title: "How tidy do you keep shared spaces?",
    description: "1 is relaxed, 5 is everything has a place.",
    options: [
      { value: 1, label: "Relaxed" },
      { value: 2, label: "Casual" },
      { value: 3, label: "Balanced" },
      { value: 4, label: "Tidy" },
      { value: 5, label: "Spotless" },
    ] satisfies QuestionOption<number>[],
  },
  smoking: {
    title: "Smoking at home?",
    description: "Be honest, this one is often a deal-breaker.",
    options: [
      { value: "NO", label: "No smoking", hint: "Not at home, not on the balcony" },
      { value: "OUTSIDE", label: "Outside only", hint: "Fine with smoke-free indoors" },
      { value: "YES", label: "I smoke", hint: "Or I'm fine with smokers" },
    ] satisfies QuestionOption[],
  },
  pets: {
    title: "How do you feel about pets?",
    description: "Cats and birds are common in Dhaka flats.",
    options: [
      { value: "NO_PETS", label: "No pets please" },
      { value: "FINE_WITH_PETS", label: "Fine with pets" },
      { value: "HAS_PETS", label: "I have a pet" },
    ] satisfies QuestionOption[],
  },
  guests: {
    title: "How often do you have guests over?",
    description: "Friends, family or colleagues visiting.",
    options: [
      { value: "NEVER", label: "Never" },
      { value: "RARELY", label: "Rarely" },
      { value: "SOMETIMES", label: "Sometimes" },
      { value: "OFTEN", label: "Often" },
    ] satisfies QuestionOption[],
  },
  noise: {
    title: "What is your noise level at home?",
    description: "Music, calls, cooking and everything in between.",
    options: [
      { value: "QUIET", label: "Quiet", hint: "Headphones and calm" },
      { value: "MODERATE", label: "Moderate", hint: "Normal everyday sound" },
      { value: "LIVELY", label: "Lively", hint: "Music and friends are fine" },
    ] satisfies QuestionOption[],
  },
  budget: {
    title: "What is your monthly budget for a room?",
    description: "Pick a range. We only match you to rooms and people within it.",
  },
  genderPreference: {
    title: "Roommate gender preference?",
    description: "Some homes are women-only or men-only.",
    options: [
      { value: "ANY", label: "No preference" },
      { value: "FEMALE", label: "Women only" },
      { value: "MALE", label: "Men only" },
    ] satisfies QuestionOption[],
  },
} as const;

export const BUDGET_MIN = 4000;
export const BUDGET_MAX = 30000;

/** The signed-in tenant's saved answers (null = questionnaire not completed). */
export const myPreference: RoommatePreference = {
  userId: "u-t1",
  sleepSchedule: "EARLY_BIRD",
  cleanliness: 4,
  smoking: "NO",
  pets: "FINE_WITH_PETS",
  guests: "RARELY",
  noise: "QUIET",
  budgetMin: 9000,
  budgetMax: 16000,
  genderPreference: "ANY",
  completedAt: "2026-09-28T09:30:00Z",
};

export const defaultAnswers: Answers = {
  sleepSchedule: "FLEXIBLE",
  cleanliness: 3,
  smoking: "NO",
  pets: "FINE_WITH_PETS",
  guests: "SOMETIMES",
  noise: "MODERATE",
  budgetMin: 8000,
  budgetMax: 16000,
  genderPreference: "ANY",
};

/* ---------- Scoring ---------- */

const ORDER = {
  guests: ["NEVER", "RARELY", "SOMETIMES", "OFTEN"],
  noise: ["QUIET", "MODERATE", "LIVELY"],
  smoking: ["NO", "OUTSIDE", "YES"],
} as const;

const closeness = (list: readonly string[], a: string, b: string) => {
  const d = Math.abs(list.indexOf(a) - list.indexOf(b));
  return 1 - d / (list.length - 1);
};

export function computeScore(a: Answers, b: Answers): { score: number; shared: string[] } {
  const shared: string[] = [];
  let total = 0;

  // Sleep (18)
  if (a.sleepSchedule === b.sleepSchedule) {
    total += 18;
    shared.push(a.sleepSchedule === "EARLY_BIRD" ? "Early bird" : a.sleepSchedule === "NIGHT_OWL" ? "Night owl" : "Flexible sleeper");
  } else if (a.sleepSchedule === "FLEXIBLE" || b.sleepSchedule === "FLEXIBLE") total += 12;
  else total += 3;

  // Cleanliness (18)
  const cd = Math.abs(a.cleanliness - b.cleanliness);
  total += Math.max(0, 18 - cd * 5);
  if (cd <= 1) shared.push(a.cleanliness >= 4 ? "Keeps things tidy" : "Relaxed about mess");

  // Smoking (16)
  const sm = closeness(ORDER.smoking, a.smoking, b.smoking);
  total += 16 * (a.smoking === "YES" && b.smoking === "NO" ? 0 : b.smoking === "YES" && a.smoking === "NO" ? 0 : sm);
  if (a.smoking === b.smoking) shared.push(a.smoking === "NO" ? "Smoke-free" : a.smoking === "OUTSIDE" ? "Smokes outside only" : "Smoker-friendly");

  // Pets (10)
  const petsOk = !(a.pets === "NO_PETS" && b.pets === "HAS_PETS") && !(b.pets === "NO_PETS" && a.pets === "HAS_PETS");
  total += petsOk ? 10 : 0;
  if (petsOk && (a.pets !== "NO_PETS" || b.pets !== "NO_PETS") && a.pets !== "HAS_PETS" && b.pets !== "HAS_PETS") shared.push("Pet-friendly");
  if (a.pets === "NO_PETS" && b.pets === "NO_PETS") shared.push("No pets");

  // Guests (12)
  const gu = closeness(ORDER.guests, a.guests, b.guests);
  total += 12 * gu;
  if (gu >= 0.66) shared.push("Similar guest habits");

  // Noise (14)
  const no = closeness(ORDER.noise, a.noise, b.noise);
  total += 14 * no;
  if (a.noise === b.noise) shared.push(a.noise === "QUIET" ? "Quiet home" : a.noise === "LIVELY" ? "Lively home" : "Moderate noise");

  // Budget overlap (12)
  const overlap = Math.min(a.budgetMax, b.budgetMax) - Math.max(a.budgetMin, b.budgetMin);
  const span = Math.max(1, Math.min(a.budgetMax - a.budgetMin, b.budgetMax - b.budgetMin));
  total += 12 * Math.max(0, Math.min(1, overlap / span));
  if (overlap > 0) shared.push("Budget overlaps");

  return { score: Math.round(total), shared: shared.slice(0, 5) };
}

/* ---------- Candidate pool (answers only; scores are computed) ---------- */

interface Candidate {
  id: string;
  name: string;
  occupation: string;
  area: string;
  budget: number;
  preference: Answers;
}

const candidates: Candidate[] = [
  { id: "rm-1", name: "Nusrat Jahan", occupation: "Graduate student", area: "Dhanmondi", budget: 11000, preference: { sleepSchedule: "EARLY_BIRD", cleanliness: 4, smoking: "NO", pets: "FINE_WITH_PETS", guests: "RARELY", noise: "QUIET", budgetMin: 9000, budgetMax: 13000, genderPreference: "ANY" } },
  { id: "rm-2", name: "Arman Hossain", occupation: "Data analyst", area: "Mirpur", budget: 13000, preference: { sleepSchedule: "EARLY_BIRD", cleanliness: 5, smoking: "NO", pets: "NO_PETS", guests: "RARELY", noise: "QUIET", budgetMin: 11000, budgetMax: 15000, genderPreference: "ANY" } },
  { id: "rm-3", name: "Tasnim Rahman", occupation: "Pharmacist", area: "Mohammadpur", budget: 10000, preference: { sleepSchedule: "FLEXIBLE", cleanliness: 4, smoking: "NO", pets: "FINE_WITH_PETS", guests: "SOMETIMES", noise: "MODERATE", budgetMin: 8000, budgetMax: 12000, genderPreference: "ANY" } },
  { id: "rm-4", name: "Arif Chowdhury", occupation: "Sales manager", area: "Banani", budget: 17000, preference: { sleepSchedule: "NIGHT_OWL", cleanliness: 3, smoking: "OUTSIDE", pets: "HAS_PETS", guests: "OFTEN", noise: "LIVELY", budgetMin: 14000, budgetMax: 20000, genderPreference: "ANY" } },
  { id: "rm-5", name: "Sumaiya Sultana", occupation: "Content writer", area: "Uttara", budget: 9500, preference: { sleepSchedule: "NIGHT_OWL", cleanliness: 4, smoking: "NO", pets: "FINE_WITH_PETS", guests: "SOMETIMES", noise: "MODERATE", budgetMin: 8000, budgetMax: 11000, genderPreference: "ANY" } },
  { id: "rm-6", name: "Rakib Hasan", occupation: "Civil engineer", area: "Dhanmondi", budget: 14000, preference: { sleepSchedule: "EARLY_BIRD", cleanliness: 3, smoking: "OUTSIDE", pets: "FINE_WITH_PETS", guests: "SOMETIMES", noise: "MODERATE", budgetMin: 11000, budgetMax: 16000, genderPreference: "ANY" } },
  { id: "rm-7", name: "Mehzabin Noor", occupation: "Architect", area: "Gulshan", budget: 16000, preference: { sleepSchedule: "FLEXIBLE", cleanliness: 5, smoking: "NO", pets: "HAS_PETS", guests: "RARELY", noise: "QUIET", budgetMin: 13000, budgetMax: 18000, genderPreference: "FEMALE" } },
  { id: "rm-8", name: "Zahid Hasan", occupation: "Consultant", area: "Banani", budget: 20000, preference: { sleepSchedule: "NIGHT_OWL", cleanliness: 2, smoking: "YES", pets: "NO_PETS", guests: "OFTEN", noise: "LIVELY", budgetMin: 18000, budgetMax: 24000, genderPreference: "ANY" } },
];

export function buildMatches(answers: Answers): RoommateMatch[] {
  return candidates
    .map((c) => {
      const { score, shared } = computeScore(answers, c.preference);
      return {
        id: c.id,
        name: c.name,
        occupation: c.occupation,
        area: c.area,
        budget: c.budget,
        score,
        sharedTraits: shared,
        preference: c.preference,
      } satisfies RoommateMatch;
    })
    .sort((a, b) => b.score - a.score);
}

export const myMatches = buildMatches(myPreference);
