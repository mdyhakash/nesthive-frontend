"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BedDouble, Pencil, Plus, Users } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newId, useData } from "@/components/data-provider";
import { CardGridSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyImage } from "@/components/shared/property-image";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { occupants as allOccupants } from "@/data/rooms";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useOwner } from "@/hooks/use-owner";
import { formatBDT, formatDate } from "@/lib/format";
import { listItemProps } from "@/lib/motion";
import type { Room } from "@/types";

const TYPES = ["Single", "Shared", "Master bedroom", "Seat"] as const;
const GENDERS = [
  { value: "ANY", label: "Anyone" },
  { value: "MALE", label: "Men only" },
  { value: "FEMALE", label: "Women only" },
] as const;

const schema = z.object({
  name: z.string().min(2, "Give the room a name").max(60, "Keep it under 60 characters"),
  type: z.enum(TYPES, { message: "Choose a room type" }),
  price: z.coerce.number({ message: "Enter an amount" }).int().min(1000, "Rent must be at least ৳1,000").max(200000, "That seems too high"),
  capacity: z.coerce.number({ message: "Enter a number" }).int().min(1, "At least 1 person").max(8, "At most 8 people"),
  sizeSqft: z.coerce.number({ message: "Enter a number" }).int().min(40, "At least 40 sqft").max(2000, "That seems too large"),
  genderPreference: z.enum(["ANY", "MALE", "FEMALE"]),
  amenities: z.string().max(120, "Keep it under 120 characters").optional(),
});
type In = z.input<typeof schema>;
type Out = z.output<typeof schema>;

function RoomDialog({ open, onOpenChange, room, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; room: Room | null; onSave: (v: Out) => void }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<In, unknown, Out>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    if (open)
      reset(
        room
          ? { name: room.name, type: room.type, price: room.price, capacity: room.capacity, sizeSqft: room.sizeSqft, genderPreference: room.genderPreference, amenities: room.amenities.join(", ") }
          : { name: "", type: undefined, price: 10000, capacity: 1, sizeSqft: 150, genderPreference: "ANY", amenities: "" },
      );
  }, [open, room, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{room ? "Edit room" : "Add a room"}</DialogTitle>
          <DialogDescription>Rooms start unpublished until you publish them.</DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="grid gap-4"
          onSubmit={handleSubmit(async (v) => {
            await new Promise((r) => setTimeout(r, 300));
            onSave(v);
            onOpenChange(false);
          })}
        >
          <Field label="Room name" required error={errors.name?.message}>
            {(a) => <Input placeholder="e.g. Room 4 · Balcony" {...a} {...register("name")} />}
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type" required error={errors.type?.message}>
              {(a) => (
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger {...a}>
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </Field>
            <Field label="Rent (৳/month)" required error={errors.price?.message}>
              {(a) => <Input type="number" inputMode="numeric" {...a} {...register("price")} />}
            </Field>
            <Field label="Capacity" required error={errors.capacity?.message}>
              {(a) => <Input type="number" inputMode="numeric" {...a} {...register("capacity")} />}
            </Field>
            <Field label="Size (sqft)" required error={errors.sizeSqft?.message}>
              {(a) => <Input type="number" inputMode="numeric" {...a} {...register("sizeSqft")} />}
            </Field>
          </div>
          <Field label="Who can rent it?" error={errors.genderPreference?.message}>
            {(a) => (
              <Controller
                control={control}
                name="genderPreference"
                render={({ field }) => (
                  <Select value={field.value ?? "ANY"} onValueChange={field.onChange}>
                    <SelectTrigger {...a}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </Field>
          <Field label="Room amenities" hint="Comma separated, e.g. Attached bath, Balcony, AC" error={errors.amenities?.message}>
            {(a) => <Input {...a} {...register("amenities")} />}
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : room ? "Save changes" : "Add room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PropertyRooms() {
  const { id } = useParams<{ id: string }>();
  const d = useData();
  const o = useOwner();
  const { status, retry } = useMockQuery(null);
  const [editing, setEditing] = React.useState<Room | null>(null);
  const [open, setOpen] = React.useState(false);
  const [viewOcc, setViewOcc] = React.useState<Room | null>(null);

  const property = o.properties.find((p) => p.id === id);
  const rooms = o.rooms.filter((r) => r.propertyId === id);

  if (!property)
    return (
      <EmptyState icon={BedDouble} title="Property not found" description="It may have been deleted, or it belongs to another owner." action={<Button asChild><Link href="/owner/properties">Back to properties</Link></Button>} />
    );

  const save = (v: Out) => {
    const amenities = (v.amenities ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    if (editing) {
      d.setRooms((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...v, amenities, type: v.type } : r)));
      d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "UPDATE", entity: "Room", entityId: editing.id, summary: `${o.owner.name} updated ${v.name}` });
      toast.success("Room updated");
    } else {
      const room: Room = { id: newId("r"), propertyId: property.id, name: v.name, type: v.type, price: v.price, isAvailable: true, isPublished: false, capacity: v.capacity, occupantCount: 0, amenities, images: property.images.slice(0, 1), sizeSqft: v.sizeSqft, genderPreference: v.genderPreference };
      d.setRooms((prev) => [...prev, room]);
      d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "CREATE", entity: "Room", entityId: room.id, summary: `${o.owner.name} added ${room.name} to ${property.title}` });
      toast.success("Room added", { description: "Publish it when it's ready." });
    }
  };

  const togglePublish = (r: Room) => {
    d.setRooms((prev) => prev.map((x) => (x.id === r.id ? { ...x, isPublished: !x.isPublished } : x)));
    d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "PUBLISH", entity: "Room", entityId: r.id, summary: `${o.owner.name} ${r.isPublished ? "unpublished" : "published"} ${r.name}` });
    toast.success(r.isPublished ? "Room unpublished" : "Room published");
  };

  const occ = viewOcc ? allOccupants.filter((x) => x.roomId === viewOcc.id) : [];

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-3">
        <Link href="/owner/properties">
          <ArrowLeft aria-hidden="true" />
          Properties
        </Link>
      </Button>
      <PageHeader
        title={`Rooms · ${property.title}`}
        description={`${property.area}, Dhaka`}
        action={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus aria-hidden="true" />
            Add room
          </Button>
        }
      />

      {status === "loading" && <CardGridSkeleton count={3} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (rooms.length === 0 ? (
          <EmptyState icon={BedDouble} title="No rooms yet" description="Add the rooms tenants can apply for." action={<Button onClick={() => { setEditing(null); setOpen(true); }}>Add room</Button>} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {rooms.map((r) => (
                <motion.li key={r.id} {...listItemProps} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative aspect-[16/10] bg-muted">
                    <PropertyImage src={r.images[0]} alt={r.name} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="truncate font-bold">{r.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {r.type} · <span className="num">{r.sizeSqft}</span> sqft
                        </p>
                      </div>
                      <StatusBadge status={r.isPublished ? "PUBLISHED" : "DRAFT"} />
                    </div>
                    <p className="mt-3">
                      <span className="num text-lg font-semibold">{formatBDT(r.price)}</span>
                      <span className="text-sm text-muted-foreground"> /month</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="num">{r.occupantCount}</span> of <span className="num">{r.capacity}</span> occupied ·{" "}
                      {r.isAvailable ? "Available" : "Full"}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => togglePublish(r)}>
                        {r.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}>
                        <Pencil aria-hidden="true" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setViewOcc(r)}>
                        <Users aria-hidden="true" />
                        Occupants
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ))}

      <RoomDialog open={open} onOpenChange={setOpen} room={editing} onSave={save} />

      <Dialog open={viewOcc !== null} onOpenChange={(v) => !v && setViewOcc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Occupants</DialogTitle>
            <DialogDescription>{viewOcc?.name}</DialogDescription>
          </DialogHeader>
          {occ.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nobody lives here right now.</p>
          ) : (
            <ul className="divide-y divide-border">
              {occ.map((x) => (
                <li key={x.id} className="flex items-center gap-3 py-3">
                  <UserAvatar name={x.name} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{x.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {x.occupation} · since {formatDate(x.since)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
