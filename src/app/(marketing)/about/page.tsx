import type { Metadata } from "next";
import { FinalCta } from "@/components/marketing/final-cta";
import { PageHero } from "@/components/marketing/page-hero";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { Section, SectionHeading } from "@/components/marketing/section";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { UserAvatar } from "@/components/shared/user-avatar";
import { TEAM } from "@/data/marketing";

export const metadata: Metadata = {
  title: "About",
  description: "NestHive exists to make renting a room in Dhaka safer, fairer and a lot less stressful.",
};

const VALUES = [
  { title: "Trust before listings", body: "A beautiful photo means nothing if the owner isn't real. We verify first." },
  { title: "Fair for both sides", body: "Clear leases, receipts for every payment and reasons for every rejection." },
  { title: "Built for Dhaka", body: "bKash payments, area names you know and prices in taka." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Renting in Dhaka should not feel like a gamble"
        description="NestHive started with a simple frustration: finding a room meant calling strangers, trusting photos and hoping your flatmate was a good fit. We're fixing that."
      />

      <StatsStrip />

      <Section>
        <SectionHeading title="What we believe" />
        <RevealGroup className="grid gap-4 md:grid-cols-3">
          {VALUES.map((v) => (
            <RevealItem key={v.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tinted>
        <SectionHeading title="The people behind it" description="A small team in Dhaka, answering the emails ourselves." />
        <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TEAM.map((m) => (
            <RevealItem key={m.name} className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center">
              <UserAvatar name={m.name} size="xl" />
              <div>
                <p className="font-bold">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <FinalCta />
    </>
  );
}
