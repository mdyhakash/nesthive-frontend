"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Maximize2, Users } from "lucide-react";
import { PropertyImage } from "@/components/shared/property-image";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarStack } from "@/components/shared/user-avatar";
import { occupantsForRoom } from "@/data/rooms";
import { formatBDT } from "@/lib/format";
import { cardInteraction } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  href?: string;
  className?: string;
  /** Hide the link overlay (e.g. inside owner lists with their own actions). */
  actions?: React.ReactNode;
}

export function RoomCard({ room, href, className, actions }: RoomCardProps) {
  const occupantNames = occupantsForRoom(room.id).map((o) => o.name);
  const spots = room.capacity - room.occupantCount;

  return (
    <motion.article
      {...cardInteraction}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 sm:flex-row",
        className,
      )}
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:w-48">
        <PropertyImage
          src={room.images[0]}
          alt={`${room.name}, ${room.type.toLowerCase()} room`}
          sizes="(min-width: 640px) 192px, 90vw"
          className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-base font-bold">
              {href ? (
                <Link href={href} className="outline-none after:absolute after:inset-0 focus-visible:underline">
                  {room.name}
                </Link>
              ) : (
                room.name
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{room.type}</p>
          </div>
          <StatusBadge status={room.isAvailable ? "AVAILABLE" : "FULL"} label={room.isAvailable ? "Available" : "Full"} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 className="size-4" aria-hidden="true" />
            <span className="num">{room.sizeSqft}</span> sqft
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" aria-hidden="true" />
            {room.occupantCount}/{room.capacity} occupied
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <p>
            <span className="num text-lg font-semibold">{formatBDT(room.price)}</span>
            <span className="text-sm text-muted-foreground"> /month</span>
          </p>
          {occupantNames.length > 0 ? (
            <AvatarStack names={occupantNames} size="xs" max={3} />
          ) : (
            spots > 0 && <span className="text-xs text-muted-foreground">{spots} {spots === 1 ? "spot" : "spots"} open</span>
          )}
        </div>
        {actions && <div className="relative z-10 flex flex-wrap gap-2 border-t border-border pt-3">{actions}</div>}
      </div>
    </motion.article>
  );
}
