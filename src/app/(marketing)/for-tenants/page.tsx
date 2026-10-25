import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { InfoGrid, type InfoItem } from "@/components/marketing/info-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { RoommateSpotlight } from "@/components/marketing/roommate-spotlight";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For tenants",
  description: "Find a verified room, match with compatible roommates and manage rent, bills and repairs in one place.",
};

const BENEFITS: InfoItem[] = [
  { title: "Rooms you can trust", body: "Owners upload their NID and ownership proof, and our team reviews them before a listing goes live.", icon: "ShieldCheck" },
  { title: "Roommates who fit", body: "Eight questions turn into a compatibility score and a list of the habits you share.", icon: "Users" },
  { title: "Pay in a few taps", body: "Deposit, rent and your share of utilities through bKash, with a receipt every time.", icon: "Wallet" },
  { title: "Bills without arguments", body: "Each person sees exactly what they owe and whether the others have paid.", icon: "Receipt" },
  { title: "Fixes with a paper trail", body: "Report a problem with a photo and follow it from open to resolved.", icon: "Wrench" },
  { title: "Your lease, always handy", body: "Dates, rent, deposit and house rules stay in your dashboard.", icon: "FileSignature" },
];

export default function ForTenantsPage() {
  return (
    <>
      <PageHero
        title="Rent a room without the guesswork"
        description="Browse verified listings, meet people you will actually get along with, and run the monthly routine from your phone."
      >
        <Button asChild size="lg">
          <Link href="/register">Create a free account</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/browse">Browse rooms</Link>
        </Button>
      </PageHero>

      <Section>
        <SectionHeading title="What you get as a tenant" />
        <InfoGrid items={BENEFITS} />
      </Section>

      <RoommateSpotlight />
      <FaqSection limit={4} />
      <FinalCta />
    </>
  );
}
