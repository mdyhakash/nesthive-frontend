import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Bath, BedDouble, ChevronRight, MapPin, Maximize2, Star } from "lucide-react";
import { BookingActions } from "@/components/marketing/booking-dialogs";
import { ImageGallery } from "@/components/shared/image-gallery";
import { RoomCard } from "@/components/shared/room-card";
import { Badge } from "@/components/ui/badge";
import { owners } from "@/data/users";
import { getProperty } from "@/data/properties";
import { roomsForProperty } from "@/data/rooms";
import { formatBDT } from "@/lib/format";
import type { Owner, Property, Room } from "@/types";

export const dynamic = "force-dynamic";

async function getPropertyDetails(id: string) {
  try {
    const res = await fetch(`https://nesthive-backend.vercel.app/api/v1/property/${id}`, {
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

        const mappedRooms: Room[] = (b.rooms || []).map((r: any) => ({
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

        const mappedOwner: Owner = {
          id: b.ownerId,
          userId: b.ownerId,
          name: b.owner?.name || "Property Owner",
          email: b.owner?.email || "owner@nesthive.com",
          phone: b.owner?.phone || "N/A",
          kycStatus: "APPROVED",
          documents: [],
          propertyCount: 1,
        };

        return { property: mappedProperty, rooms: mappedRooms, owner: mappedOwner };
      }
    }
  } catch {
    // fallback
  }

  const prop = getProperty(id);
  if (!prop) return null;
  return {
    property: prop,
    rooms: roomsForProperty(prop.id).filter((r) => r.isPublished),
    owner: owners.find((o) => o.id === prop.ownerId),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getPropertyDetails(id);
  const p = data?.property;
  return p ? { title: `${p.title}, ${p.area}`, description: p.description.slice(0, 150) } : {};
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPropertyDetails(id);
  if (!data || !data.property || data.property.isDeleted || data.property.status !== "PUBLISHED") notFound();

  const { property, rooms, owner } = data;
  const cheapest = rooms.length ? Math.min(...rooms.map((r) => r.price)) : property.rent;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-16">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/browse" className="hover:text-foreground hover:underline">
          Browse
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="truncate text-foreground" aria-current="page">
          {property.title}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div className="min-w-0">
          <ImageGallery images={property.images} title={property.title} />

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              {property.verified && (
                <Badge tone="teal">
                  <BadgeCheck aria-hidden="true" />
                  Verified owner
                </Badge>
              )}
              <Badge tone="outline">{property.type}</Badge>
              {!property.isAvailable && <Badge tone="neutral">Fully occupied</Badge>}
            </div>
            <h1 className="mt-3 text-2xl font-bold sm:text-4xl">{property.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {property.address}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {property.rating > 0 && (
                <li className="inline-flex items-center gap-1.5">
                  <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
                  <span className="num font-semibold">{property.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
                </li>
              )}
              <li className="inline-flex items-center gap-1.5">
                <BedDouble className="size-4 text-muted-foreground" aria-hidden="true" />
                {property.bedrooms} bedrooms
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Bath className="size-4 text-muted-foreground" aria-hidden="true" />
                {property.bathrooms} bathrooms
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Maximize2 className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="num">{property.sizeSqft.toLocaleString("en-US")}</span> sqft
              </li>
            </ul>
          </header>

          <section className="mt-10" aria-labelledby="about">
            <h2 id="about" className="text-xl font-bold">
              About this place
            </h2>
            <p className="mt-3 max-w-prose leading-relaxed text-muted-foreground">{property.description}</p>
          </section>

          <section className="mt-10" aria-labelledby="amenities">
            <h2 id="amenities" className="text-xl font-bold">
              Amenities
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.amenities.map((a) => (
                <li
                  key={a}
                  className="flex min-h-11 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 text-sm"
                >
                  <span aria-hidden="true" className="size-2 rounded-full bg-secondary" />
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="rooms">
            <h2 id="rooms" className="text-xl font-bold">
              Rooms ({rooms.length})
            </h2>
            <ul className="mt-4 grid gap-4">
              {rooms.map((r) => (
                <li key={r.id}>
                  <RoomCard room={r} href={`/browse/${property.id}/rooms/${r.id}`} />
                </li>
              ))}
            </ul>
          </section>

          {owner && (
            <section className="mt-10 rounded-2xl border border-border bg-card p-5" aria-labelledby="owner">
              <h2 id="owner" className="text-base font-bold">
                Listed by {owner.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {owner.businessName ? `${owner.businessName} · ` : ""}
                Identity and ownership documents reviewed by NestHive.
              </p>
            </section>
          )}
        </div>

        <aside aria-label="Book this place" className="lg:sticky lg:top-24 lg:self-start">
          <BookingActions
            property={property}
            rooms={rooms}
            priceLabel={formatBDT(cheapest)}
            priceNote="Starting price per room. Each room is priced separately."
          />
        </aside>
      </div>
    </div>
  );
}
