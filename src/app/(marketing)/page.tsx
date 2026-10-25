import { FaqSection } from "@/components/marketing/faq-section";
import { FeaturedProperties } from "@/components/marketing/featured-properties";
import { FeaturesBento } from "@/components/marketing/features-bento";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { OwnersCta } from "@/components/marketing/owners-cta";
import { RoommateSpotlight } from "@/components/marketing/roommate-spotlight";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { Testimonials } from "@/components/marketing/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <FeaturedProperties />
      <HowItWorks />
      <RoommateSpotlight />
      <FeaturesBento />
      <OwnersCta />
      <Testimonials />
      <FaqSection limit={6} />
      <FinalCta />
    </>
  );
}
