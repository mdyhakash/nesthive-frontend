"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/shared/property-card";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { extractData } from "@/lib/api-helper";
import type { PropertyItem } from "@/api/property.api";
import type { Property } from "@/types";
import { CardGridSkeleton } from "@/components/shared/data-table";

export function FeaturedProperties() {
  const { data: apiData, isLoading } = useProperties();
  const rawItems = extractData<PropertyItem[]>(apiData);
  const backendItems = Array.isArray(rawItems) ? rawItems : [];

  const featured: Property[] = React.useMemo(() => {
    return backendItems
      .filter((b) => !b.isDeleted && (b.isPublished || (b as any).status === "PUBLISHED"))
      .slice(0, 6)
      .map((b) => {
        const firstRoomRent = b.rooms?.[0]?.rentAmount ? Number(b.rooms[0].rentAmount) : 0;
        return {
          id: b.id,
          title: b.title,
          description: b.description || "",
          address: b.address,
          area: b.area,
          city: b.city,
          type: (b.type === "FAMILY_HOUSE" ? "Family flat" : b.type === "SUBLET" ? "Sublet" : "Apartment") as any,
          rent: firstRoomRent,
          bedrooms: b.rooms?.length || 1,
          bathrooms: 1,
          sizeSqft: 600,
          rating: 4.8,
          reviewCount: 0,
          verified: true,
          isAvailable: !b.isDeleted,
          amenities: (b.amenities as any) || [],
          images:
            b.images && b.images.length > 0
              ? b.images
              : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80"],
          ownerId: b.ownerId,
          createdAt: b.createdAt,
          status: "PUBLISHED" as const,
          isDeleted: b.isDeleted || false,
        };
      });
  }, [backendItems]);

  if (!isLoading && featured.length === 0) {
    return null;
  }

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

      {isLoading ? (
        <CardGridSkeleton count={3} className="lg:grid-cols-3" />
      ) : (
        /* Mobile: horizontal snap carousel. Desktop: 3-column grid. */
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
      )}
    </Section>
  );
}
