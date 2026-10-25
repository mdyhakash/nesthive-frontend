import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about verification, bKash payments, roommate matching, viewings, utilities and leases.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero title="Frequently asked questions" description="Quick answers about renting and listing on NestHive.">
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Still stuck? Contact us</Link>
        </Button>
      </PageHero>
      <FaqSection heading={false} />
      <FinalCta />
    </>
  );
}
