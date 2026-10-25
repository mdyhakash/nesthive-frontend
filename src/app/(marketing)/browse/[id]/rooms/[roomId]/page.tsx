import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Lock, Maximize2, Users } from "lucide-react";
import { BookingActions } from "@/components/marketing/booking-dialogs";
import { ImageGallery } from "@/components/shared/image-gallery";
import { ScoreRing } from "@/components/shared/score-ring";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProperty } from "@/data/properties";
import { getRoom, occupantsForRoom, roomsForProperty } from "@/data/rooms";
import { formatBDT, formatDate } from "@/lib/format";
import type { Property, Room } from "@/types";

export const dynamic = "force-dynamic";

async function fetchLiveRoomDetails(propertyId: string, roomId: string) {
  try {
    const res = await fetch(`https://nesthive-backend.vercel.app/api/v1/property/${propertyId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const b = json?.data;
      if (b && b.id) {
        const mappedProperty: Property = {
          id: b.id,
          title: b.title,
          description: b.description || "",
          address: b.address,
          area: b.area,
          city: b.city,
          type: (b.type === "FAMILY_HOUSE" ? "Family flat" : b.type === "SUBLET" ? "Sublet" : "Apartment") as any,
          rent: b.rooms?.[0]?.rentAmount ? Number(b.rooms[0].rentAmount) : 10000,
          bedrooms: b.rooms?.length || 1,
          bathrooms: 1,
          sizeSqft: 600,
          rating: 4.8,
          reviewCount: 5,
          verified: true,
          isAvailable: !b.isDeleted,
          amenities: b.amenities || ["WIFI", "GENERATOR"],
          images:
            b.images && b.images.length > 0
              ? b.images
              : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80"],
          ownerId: b.ownerId,
          createdAt: b.createdAt,
          status: (b.isPublished || b.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as any,
          isDeleted: b.isDeleted || false,
        };

        const allMappedRooms: Room[] = (b.rooms || []).map((r: any) => ({
          id: r.id,
          propertyId: b.id,
          name: `Room ${r.roomNumber || "1"}`,
          type: (r.roomType === "SINGLE" ? "Single" : r.roomType === "SHARED" ? "Shared" : "Master bedroom") as any,
          price: Number(r.rentAmount || 10000),
          isAvailable: (r.occupantCount || 0) < (r.capacity || 1),
          isPublished: r.status === "PUBLISHED" || !r.isDeleted,
          capacity: r.capacity || 1,
          occupantCount: r.occupantCount || 0,
          amenities: b.amenities || ["WIFI"],
          images:
            b.images && b.images.length > 0
              ? b.images
              : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80"],
          sizeSqft: 200,
          genderPreference: "ANY",
        }));

        const currentRoom = allMappedRooms.find((r) => r.id === roomId);
        if (currentRoom) {
          return {
            property: mappedProperty,
            room: currentRoom,
            siblings: allMappedRooms.filter((r) => r.isPublished),
          };
        }
      }
    }
  } catch {
    // fallback
  }

  const prop = getProperty(propertyId);
  const rm = getRoom(roomId);
  if (!prop || !rm) return null;
  return {
    property: prop,
    room: rm,
    siblings: roomsForProperty(prop.id).filter((r) => r.isPublished),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>;
}): Promise<Metadata> {
  const { id, roomId } = await params;
  const data = await fetchLiveRoomDetails(id, roomId);
  return data ? { title: `${data.room.name} at ${data.property.title}` } : {};
}

export default async function RoomPage({ params }: { params: Promise<{ id: string; roomId: string }> }) {
  const { id, roomId } = await params;
  const data = await fetchLiveRoomDetails(id, roomId);
  if (!data || data.property.isDeleted || !data.room.isPublished) notFound();

  const { property, room, siblings } = data;
  const occupants = occupantsForRoom(room.id);
  const spots = room.capacity - room.occupantCount;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-16">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/browse" className="hover:text-foreground hover:underline">
          Browse
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <Link href={`/browse/${property.id}`} className="hover:text-foreground hover:underline">
          {property.title}
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="text-foreground" aria-current="page">
          {room.name}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div className="min-w-0">
          <ImageGallery images={room.images} title={room.name} />

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="outline">{room.type}</Badge>
              <StatusBadge status={room.isAvailable ? "AVAILABLE" : "FULL"} label={room.isAvailable ? "Available" : "Full"} />
              {room.genderPreference !== "ANY" && (
                <Badge tone="info">{room.genderPreference === "FEMALE" ? "Women only" : "Men only"}</Badge>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-bold sm:text-4xl">{room.name}</h1>
            <p className="mt-2 text-muted-foreground">
              in{" "}
              <Link href={`/browse/${property.id}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                {property.title}
              </Link>
              , {property.area}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="inline-flex items-center gap-1.5">
                <Maximize2 className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="num">{room.sizeSqft}</span> sqft
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Users className="size-4 text-muted-foreground" aria-hidden="true" />
                {room.occupantCount} of {room.capacity} beds taken
              </li>
            </ul>
          </header>

          <section className="mt-10" aria-labelledby="in-room">
            <h2 id="in-room" className="text-xl font-bold">
              What&apos;s in the room
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {room.amenities.map((a) => (
                <li key={a} className="rounded-full border border-border bg-card px-4 py-2 text-sm">
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="occupants">
            <h2 id="occupants" className="text-xl font-bold">
              Who lives here
            </h2>
            {occupants.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {occupants.map((o) => (
                  <li key={o.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                    <UserAvatar name={o.name} size="md" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{o.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {o.occupation} · since {formatDate(o.since)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-muted-foreground">Nobody lives here yet. You could be the first.</p>
            )}
            {spots > 0 && occupants.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                {spots} {spots === 1 ? "bed is" : "beds are"} still open.
              </p>
            )}
          </section>

          {/* Compatibility teaser */}
          <section
            aria-labelledby="match"
            className="mt-10 flex flex-col items-start gap-5 rounded-2xl border border-border bg-teal-soft p-5 sm:flex-row sm:items-center"
          >
            <div className="relative shrink-0">
              <div aria-hidden="true" className="blur-[3px]">
                <ScoreRing score={88} size={84} strokeWidth={8} />
              </div>
              <span className="absolute inset-0 flex items-center justify-center">
                <Lock className="size-6 text-secondary" aria-hidden="true" />
                <span className="sr-only">Locked until you sign in</span>
              </span>
            </div>
            <div>
              <h2 id="match" className="text-lg font-bold">
                How well would you fit in?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Answer eight short questions and see your compatibility score for this room and the people in it.
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-3">
                <Link href="/register">Create an account to see your score</Link>
              </Button>
            </div>
          </section>
        </div>

        <aside aria-label="Book this room" className="lg:sticky lg:top-24 lg:self-start">
          <BookingActions
            property={property}
            rooms={siblings}
            room={room}
            priceLabel={formatBDT(room.price)}
            priceNote="Rent per month. Deposit is two months' rent."
          />
        </aside>
      </div>
    </div>
  );
}
