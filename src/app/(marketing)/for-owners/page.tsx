import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/marketing/final-cta";
import { InfoGrid, type InfoItem } from "@/components/marketing/info-grid";
import { OwnersCta } from "@/components/marketing/owners-cta";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For owners",
  description: "List rooms, review verified applicants, collect rent with bKash and split utility bills.",
};

const VERIFICATION: InfoItem[] = [
  { title: "Verify once", body: "Upload your NID (front and back) and a proof of ownership. An admin reviews it and tells you the result, with a reason if something needs fixing.", icon: "ShieldCheck" },
  { title: "Publish with confidence", body: "Listings can go live only after approval, which is why tenants trust them.", icon: "BadgeCheck" },
];

const PAYMENTS: InfoItem[] = [
  { title: "Rent and deposit via bKash", body: "Payments arrive with a transaction ID. Your dashboard totals what you've received.", icon: "Wallet" },
  { title: "One bill, fair splits", body: "Enter the type, month and total. See each occupant's share before you save.", icon: "Receipt" },
  { title: "Maintenance, organised", body: "Tickets arrive with priority and photos. Assign a manager and update status as work progresses.", icon: "Wrench" },
  { title: "Applications and viewings", body: "Approve or reject in one tap. Rejections ask for a reason so tenants always know why.", icon: "CalendarCheck" },
  { title: "Digital leases", body: "Every active and past lease with dates, deposit and monthly rent.", icon: "FileSignature" },
  { title: "Notifications", body: "Only what needs you: new applications, rent received, urgent tickets.", icon: "BellRing" },
];

export default function ForOwnersPage() {
  return (
    <>
      <PageHero
        title="Fill your rooms with people you trust"
        description="NestHive handles listings, verified applicants, rent collection and repairs, so managing a property takes minutes a day."
      >
        <Button asChild size="lg">
          <Link href="/register?role=OWNER">List your property</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Owner login</Link>
        </Button>
      </PageHero>

      <Section id="verification">
        <SectionHeading title="Verification that tenants notice" description="A verified badge is the first thing renters look for." />
        <InfoGrid items={VERIFICATION} columns={2} />
      </Section>

      <Section id="payments" tinted>
        <SectionHeading title="Everything you do after the listing" />
        <InfoGrid items={PAYMENTS} />
      </Section>

      <OwnersCta />
      <FinalCta
        title="Ready to list your first room?"
        description="Create an owner account, submit your documents and you could be live within days."
      />
    </>
  );
}
