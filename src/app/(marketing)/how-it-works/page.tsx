import type { Metadata } from "next";
import Link from "next/link";
import { FeaturesBento } from "@/components/marketing/features-bento";
import { FinalCta } from "@/components/marketing/final-cta";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How it works",
  description: "Search, visit, apply and move in. See how NestHive takes you from a search to a signed lease.",
};

const DETAILS = [
  { step: "Search", points: ["Filter by area, budget, room type and amenities.", "Every listing shows its verified-owner badge.", "Open a room to see who already lives there."] },
  { step: "Visit", points: ["Pick a date and a one-hour slot on the room page.", "The owner approves or declines, and you get a notification.", "Need to change plans? Cancel a pending request any time."] },
  { step: "Apply", points: ["Send one application per room with your move-in date.", "Follow it from pending to approved on your dashboard.", "Changed your mind? Withdraw it before the owner decides."] },
  { step: "Move in", points: ["Review your digital lease: dates, rent, deposit and house rules.", "Pay the deposit and first month with bKash.", "Rent, utilities and maintenance all live in the same place afterwards."] },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        title="How NestHive works"
        description="Four steps from a search to a signed lease, with the same simple routine every month after."
      >
        <Button asChild size="lg">
          <Link href="/browse">Browse rooms</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/for-owners">I own a property</Link>
        </Button>
      </PageHero>

      <HowItWorks heading={false} />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {DETAILS.map((d, i) => (
            <article key={d.step} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-bold">
                <span className="num mr-2 text-secondary">{i + 1}.</span>
                {d.step}
              </h2>
              <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
                {d.points.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <FeaturesBento />
      <FinalCta />
    </>
  );
}
