"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/shared/property-card";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { publicProperties } from "@/data/properties";

const featured = publicProperties.filter((p) => p.isAvailable && p.rating >= 4.6).slice(0, 6);

export function FeaturedProperties() {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Rooms people are moving into this month"
          description="Every listing below belongs to a verified owner."
          className="mb-0 sm:mb-12"
        />
        <Button asChild variant="outline" className="mb-8 self-start sm:mb-12">
          <Link href="/browse">
            View all rooms
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {/* Mobile: horizontal snap carousel. Desktop: 3-column grid. */}
      <RevealGroup
        gap={0.08}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {featured.map((p, i) => (
          <RevealItem key={p.id} className="w-[82%] max-w-sm shrink-0 snap-start sm:w-[46%] lg:w-auto lg:max-w-none">
            <PropertyCard property={p} priority={i < 2} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
