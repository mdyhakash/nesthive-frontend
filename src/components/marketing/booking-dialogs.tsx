"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Property, Room } from "@/types";

/** Tomorrow (Dhaka) as yyyy-mm-dd, derived from the mock "now" so SSR and client agree. */
const MIN_DATE = "2026-10-23";

export const TIME_SLOTS = [
  "9:00 AM – 10:00 AM",
  "11:00 AM – 12:00 PM",
  "2:00 PM – 3:00 PM",
  "4:00 PM – 5:00 PM",
  "6:00 PM – 7:00 PM",
] as const;

interface BaseProps {
  property: Property;
  /** Rooms the visitor can pick from when none is fixed. */
  rooms: Room[];
  room?: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone?: () => void;
}

/* ------------------------------------------------------------------ */
/* Viewing request                                                     */
/* ------------------------------------------------------------------ */
const viewingSchema = z.object({
  roomId: z.string().min(1, "Choose a room to visit"),
  date: z
    .string()
    .min(1, "Pick a date")
    .refine((d) => d >= MIN_DATE, "Pick a date from tomorrow onwards"),
  slot: z.string().min(1, "Choose a time slot"),
  note: z.string().max(200, "Keep the note under 200 characters").optional(),
});
type ViewingValues = z.infer<typeof viewingSchema>;

export function ViewingDialog({ property, rooms, room, open, onOpenChange, onDone }: BaseProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ViewingValues>({
    resolver: zodResolver(viewingSchema),
    defaultValues: { roomId: room?.id ?? "", date: "", slot: "", note: "" },
  });

  React.useEffect(() => {
    if (open) reset({ roomId: room?.id ?? "", date: "", slot: "", note: "" });
  }, [open, room?.id, reset]);

  const onSubmit = async (v: ViewingValues) => {
    await new Promise((r) => setTimeout(r, 400)); // pretend to send
    toast.success("Viewing requested", {
      description: `${v.date} · ${v.slot}. The owner will confirm shortly.`,
    });
    onDone?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a viewing</DialogTitle>
          <DialogDescription>
            {property.title}, {property.area}. The owner will approve or suggest another time.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          {!room && (
            <Field label="Room" required error={errors.roomId?.message}>
              {(a) => (
                <Controller
                  control={control}
                  name="roomId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger {...a}>
                        <SelectValue placeholder="Choose a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} · {formatBDT(r.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </Field>
          )}
          <Field label="Date" required error={errors.date?.message}>
            {(a) => <Input type="date" min={MIN_DATE} {...a} {...register("date")} />}
          </Field>

          <Controller
            control={control}
            name="slot"
            render={({ field }) => (
              <fieldset className="grid min-w-0 gap-2">
                <legend className="mb-1 text-sm font-medium">
                  Time slot<span aria-hidden="true" className="ml-0.5 text-danger-strong">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((s) => {
                    const active = field.value === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={active}
                        onClick={() => field.onChange(s)}
                        className={cn(
                          "num min-h-11 rounded-xl border px-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring sm:text-sm",
                          active ? "border-secondary bg-teal-soft text-secondary" : "border-border bg-card hover:bg-muted",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {errors.slot && (
                  <p role="alert" className="text-xs font-medium text-danger-strong">
                    {errors.slot.message}
                  </p>
                )}
              </fieldset>
            )}
          />

          <Field label="Note for the owner" hint="Optional. Say who is visiting or what you'd like to see." error={errors.note?.message}>
            {(a) => <Textarea rows={3} {...a} {...register("note")} />}
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Apply                                                               */
/* ------------------------------------------------------------------ */
const applySchema = z.object({
  roomId: z.string().min(1, "Choose the room you're applying for"),
  moveInDate: z
    .string()
    .min(1, "Pick a move-in date")
    .refine((d) => d >= MIN_DATE, "Pick a date from tomorrow onwards"),
  message: z.string().min(10, "Tell the owner a little about yourself (at least 10 characters)").max(500, "Keep it under 500 characters"),
  agree: z.boolean().refine((v) => v, "Please confirm to continue"),
});
type ApplyValues = z.infer<typeof applySchema>;

export function ApplyDialog({ property, rooms, room, open, onOpenChange, onDone }: BaseProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    defaultValues: { roomId: room?.id ?? "", moveInDate: "", message: "", agree: false },
  });

  React.useEffect(() => {
    if (open) reset({ roomId: room?.id ?? "", moveInDate: "", message: "", agree: false });
  }, [open, room?.id, reset]);

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Application sent", { description: "You can track it from your dashboard once you're signed in." });
    onDone?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for a room</DialogTitle>
          <DialogDescription>
            {property.title}, {property.area}. One application per room.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          {!room && (
            <Field label="Room" required error={errors.roomId?.message}>
              {(a) => (
                <Controller
                  control={control}
                  name="roomId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger {...a}>
                        <SelectValue placeholder="Choose a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} · {formatBDT(r.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </Field>
          )}
          {room && (
            <p className="rounded-xl bg-muted px-4 py-3 text-sm">
              <span className="font-semibold">{room.name}</span> · <span className="num">{formatBDT(room.price)}</span>/month
            </p>
          )}
          <Field label="Move-in date" required error={errors.moveInDate?.message}>
            {(a) => <Input type="date" min={MIN_DATE} {...a} {...register("moveInDate")} />}
          </Field>
          <Field label="About you" required hint="Your work or study, routine and anything the owner should know." error={errors.message?.message}>
            {(a) => <Textarea rows={4} {...a} {...register("message")} />}
          </Field>
          <Controller
            control={control}
            name="agree"
            render={({ field }) => (
              <div className="grid gap-1.5">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="apply-agree"
                    checked={field.value}
                    onCheckedChange={(c) => field.onChange(c === true)}
                    aria-invalid={!!errors.agree}
                    className="mt-0.5"
                  />
                  <label htmlFor="apply-agree" className="text-sm leading-snug">
                    My details are accurate and I can pay the first month&apos;s rent and deposit.
                  </label>
                </div>
                {errors.agree && (
                  <p role="alert" className="text-xs font-medium text-danger-strong">
                    {errors.agree.message}
                  </p>
                )}
              </div>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Shared action area: desktop buttons + sticky mobile bar             */
/* ------------------------------------------------------------------ */
export function BookingActions({
  property,
  rooms,
  room,
  priceLabel,
  priceNote,
}: {
  property: Property;
  rooms: Room[];
  room?: Room;
  priceLabel: string;
  priceNote: string;
}) {
  const [viewing, setViewing] = React.useState(false);
  const [apply, setApply] = React.useState(false);
  const [requested, setRequested] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const available = room ? room.isAvailable : rooms.some((r) => r.isAvailable);
  const open = rooms.filter((r) => r.isAvailable);

  const renderButtons = (compact: boolean) => (
    <>
      <Button
        variant="outline"
        size={compact ? "default" : "lg"}
        className={compact ? "min-w-0 flex-1 px-3" : "flex-1"}
        disabled={!available || requested}
        onClick={() => setViewing(true)}
      >
        {requested ? (compact ? "Requested" : "Viewing requested") : "Request viewing"}
      </Button>
      <Button
        size={compact ? "default" : "lg"}
        className={compact ? "min-w-0 flex-1 px-3" : "flex-1"}
        disabled={!available || applied}
        onClick={() => setApply(true)}
      >
        {applied ? (compact ? "Applied" : "Application sent") : "Apply"}
      </Button>
    </>
  );

  return (
    <>
      {/* Desktop card */}
      <div className="hidden rounded-2xl border border-border bg-card p-5 lg:block">
        <p>
          <span className="num text-2xl font-semibold">{priceLabel}</span>
          <span className="text-sm text-muted-foreground"> /month</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{priceNote}</p>
        <div className="mt-5 flex flex-col gap-2">{renderButtons(false)}</div>
        {!available && <p className="mt-3 text-sm text-muted-foreground">This one is full right now. Browse similar rooms below.</p>}
      </div>

      {/* Mobile sticky bar */}
      <div className="glass fixed inset-x-0 bottom-0 z-30 border-t border-border px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="shrink-0 leading-tight">
            <p className="num text-base font-semibold">{priceLabel}</p>
            <p className="text-caption text-muted-foreground">per month</p>
          </div>
          <div className="flex min-w-0 flex-1 gap-2">{renderButtons(true)}</div>
        </div>
      </div>

      <ViewingDialog property={property} rooms={open} room={room} open={viewing} onOpenChange={setViewing} onDone={() => setRequested(true)} />
      <ApplyDialog property={property} rooms={open} room={room} open={apply} onOpenChange={setApply} onDone={() => setApplied(true)} />
    </>
  );
}
