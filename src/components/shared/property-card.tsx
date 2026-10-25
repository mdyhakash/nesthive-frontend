"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, BedDouble, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PropertyImage } from "@/components/shared/property-image";
import { formatBDT } from "@/lib/format";
import { cardInteraction } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  href?: string;
  className?: string;
  priority?: boolean;
  /** Image sizes hint; defaults suit a 1/2/3-column grid. */
  sizes?: string;
}

export function PropertyCard({
  property,
  href = `/browse/${property.id}`,
  className,
  priority,
  sizes = "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 85vw",
}: PropertyCardProps) {
  return (
    <motion.article
      {...cardInteraction}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <PropertyImage
          src={property.images[0]}
          alt={`${property.title} in ${property.area}`}
          sizes={sizes}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {property.verified && (
            <Badge tone="outline" className="bg-card/90 backdrop-blur">
              <BadgeCheck className="text-secondary" aria-hidden="true" />
              Verified
            </Badge>
          )}
          {!property.isAvailable && <Badge tone="neutral" className="bg-card/90 backdrop-blur">Fully occupied</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold">
            <Link href={href} className="outline-none after:absolute after:inset-0 focus-visible:underline">
              {property.title}
            </Link>
          </h3>
          {property.rating > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
              <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
              <span className="num">{property.rating.toFixed(1)}</span>
              <span className="sr-only">rating</span>
            </span>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {property.area}, {property.city}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <p>
            <span className="num text-lg font-semibold">{formatBDT(property.rent)}</span>
            <span className="text-sm text-muted-foreground"> /month</span>
            <span className="block text-caption text-muted-foreground">starting price per room</span>
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <BedDouble className="size-4" aria-hidden="true" />
            {property.bedrooms} bed
          </p>
        </div>
      </div>
    </motion.article>
  );
}
