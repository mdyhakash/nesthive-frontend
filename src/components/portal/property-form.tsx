"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ImagePlus, Lock, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newId, useData } from "@/components/data-provider";
import { PropertyImage } from "@/components/shared/property-image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AMENITIES, AREAS, PROPERTY_TYPES } from "@/data/properties";
import { useOwnerPortal } from "@/hooks/useOwnerPortal";
import { MOCK_NOW } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Property, PropertyType } from "@/types";

const schema = z.object({
  title: z.string().min(5, "Give the property a clear title (at least 5 characters)").max(80, "Keep the title under 80 characters"),
  type: z.enum(PROPERTY_TYPES, { message: "Choose a property type" }),
  description: z.string().min(30, "Describe the place in at least 30 characters").max(1000, "Keep it under 1000 characters"),
  bedrooms: z.coerce.number({ message: "Enter a number" }).int().min(1, "At least 1 bedroom").max(12, "That seems like a lot"),
  bathrooms: z.coerce.number({ message: "Enter a number" }).int().min(1, "At least 1 bathroom").max(12, "That seems like a lot"),
  sizeSqft: z.coerce.number({ message: "Enter a number" }).int().min(100, "Enter the size in sqft (at least 100)").max(10000, "That seems too large"),
  rent: z.coerce.number({ message: "Enter an amount" }).int().min(2000, "Starting rent must be at least ৳2,000").max(500000, "That seems too high"),
  area: z.enum(AREAS, { message: "Choose an area" }),
  address: z.string().min(8, "Add a street address (at least 8 characters)").max(160, "Keep the address under 160 characters"),
  amenities: z.array(z.string()).min(1, "Pick at least one amenity"),
});
type Input_ = z.input<typeof schema>;
type Values = z.output<typeof schema>;

const STEPS = [
  { title: "Basic info", fields: ["title", "type", "description", "bedrooms", "bathrooms", "sizeSqft", "rent"] },
  { title: "Location", fields: ["area", "address"] },
  { title: "Images", fields: [] },
  { title: "Amenities", fields: ["amenities"] },
] as const;

/** Four-step create / edit form for a property. */
export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const d = useData();
  const o = useOwnerPortal();
  const kycOk = o.owner.kycStatus === "APPROVED";
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [images, setImages] = React.useState<string[]>(property?.images ?? []);
  const [imageError, setImageError] = React.useState("");
  const [saving, setSaving] = React.useState<"draft" | "publish" | null>(null);

  const form = useForm<Input_, unknown, Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      title: property?.title ?? "",
      type: property?.type,
      description: property?.description ?? "",
      bedrooms: property?.bedrooms ?? 2,
      bathrooms: property?.bathrooms ?? 1,
      sizeSqft: property?.sizeSqft ?? 900,
      rent: property?.rent ?? 12000,
      area: property?.area as (typeof AREAS)[number] | undefined,
      address: property?.address ?? "",
      amenities: property?.amenities ?? [],
    },
  });
  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = form;

  const next = async () => {
    const fields = STEPS[step].fields as unknown as (keyof Input_)[];
    const ok = fields.length ? await trigger(fields) : true;
    if (step === 2 && images.length === 0) {
      setImageError("Add at least one photo so people can see the place.");
      return;
    }
    if (ok) {
      setDir(1);
      setStep((s) => s + 1);
    }
  };
  const back = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const picked = [...files].filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
    if (picked.length < files.length) setImageError("Some files were skipped. Use JPG or PNG under 5 MB.");
    else setImageError("");
    setImages((prev) => [...prev, ...picked.map((f) => URL.createObjectURL(f))].slice(0, 6));
  };

  const save = (mode: "draft" | "publish") =>
    handleSubmit(async (v) => {
      setSaving(mode);
      const status = mode === "publish" ? "PUBLISHED" : (property?.status ?? "DRAFT");
      if (property) {
        o.updatePropertyMutation.mutate({
          id: property.id,
          data: {
            title: v.title,
            description: v.description,
            address: v.address,
            city: "Dhaka",
            area: v.area,
            type: "APARTMENT",
            amenities: v.amenities,
            images,
          },
        });
        d.setProperties((prev) => prev.map((p) => (p.id === property.id ? { ...p, ...v, type: v.type as PropertyType, images, status } : p)));
        d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: mode === "publish" ? "PUBLISH" : "UPDATE", entity: "Property", entityId: property.id, summary: `${o.owner.name} ${mode === "publish" ? "published" : "updated"} ${v.title}` });
      } else {
        o.createPropertyMutation.mutate({
          title: v.title,
          description: v.description,
          address: v.address,
          city: "Dhaka",
          area: v.area,
          type: "APARTMENT",
          amenities: v.amenities,
          images,
        });
        const id = newId("p");
        const created: Property = {
          id,
          ownerId: o.id,
          title: v.title,
          description: v.description,
          type: v.type as PropertyType,
          city: "Dhaka",
          area: v.area,
          address: v.address,
          rent: v.rent,
          status,
          isAvailable: true,
          isDeleted: false,
          images,
          amenities: v.amenities,
          bedrooms: v.bedrooms,
          bathrooms: v.bathrooms,
          sizeSqft: v.sizeSqft,
          rating: 0,
          reviewCount: 0,
          verified: kycOk,
          createdAt: MOCK_NOW.toISOString(),
        };
        d.setProperties((prev) => [created, ...prev]);
        d.audit({ actorId: o.owner.userId, actorName: o.owner.name, actorRole: "OWNER", action: "CREATE", entity: "Property", entityId: id, summary: `${o.owner.name} created ${v.title}` });
      }
      toast.success(mode === "publish" ? "Property published" : property ? "Changes saved" : "Draft saved", {
        description: mode === "publish" ? "It's now visible in Browse." : "You can publish it whenever you're ready.",
      });
      router.push("/owner/properties");
    })();

  const last = step === STEPS.length - 1;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-4 sm:p-6">
      <nav aria-label="Form steps" className="mb-4">
        <ol className="grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">
          {STEPS.map((s, i) => (
            <li key={s.title} aria-current={i === step ? "step" : undefined} className={cn("truncate font-medium", i === step ? "text-secondary" : i < step ? "text-foreground" : "text-muted-foreground")}>
              <span className="num">{i + 1}.</span> {s.title}
            </li>
          ))}
        </ol>
      </nav>
      <Progress value={((step + 1) / STEPS.length) * 100} aria-label="Form progress" />

      <form noValidate onSubmit={(e) => e.preventDefault()} className="mt-6">
        <div className="min-h-80 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={{ enter: (x: number) => ({ opacity: 0, x: x * 28 }), center: { opacity: 1, x: 0 }, exit: (x: number) => ({ opacity: 0, x: x * -28 }) }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="grid gap-5"
            >
              {step === 0 && (
                <>
                  <Field label="Title" required error={errors.title?.message}>
                    {(a) => <Input placeholder="e.g. Sunny 3-bed flat near Dhanmondi Lake" {...a} {...register("title")} />}
                  </Field>
                  <Field label="Property type" required error={errors.type?.message}>
                    {(a) => (
                      <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                          <Select value={field.value ?? ""} onValueChange={field.onChange}>
                            <SelectTrigger {...a}>
                              <SelectValue placeholder="Choose a type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROPERTY_TYPES.map((t) => (
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
                  <Field label="Description" required error={errors.description?.message}>
                    {(a) => <Textarea rows={4} {...a} {...register("description")} />}
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Bedrooms" required error={errors.bedrooms?.message}>
                      {(a) => <Input type="number" inputMode="numeric" min={1} {...a} {...register("bedrooms")} />}
                    </Field>
                    <Field label="Bathrooms" required error={errors.bathrooms?.message}>
                      {(a) => <Input type="number" inputMode="numeric" min={1} {...a} {...register("bathrooms")} />}
                    </Field>
                    <Field label="Size (sqft)" required error={errors.sizeSqft?.message}>
                      {(a) => <Input type="number" inputMode="numeric" {...a} {...register("sizeSqft")} />}
                    </Field>
                    <Field label="Starting rent (৳/month)" required error={errors.rent?.message}>
                      {(a) => <Input type="number" inputMode="numeric" {...a} {...register("rent")} />}
                    </Field>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <Field label="City">{(a) => <Input value="Dhaka" readOnly {...a} aria-invalid={false} />}</Field>
                  <Field label="Area" required error={errors.area?.message}>
                    {(a) => (
                      <Controller
                        control={control}
                        name="area"
                        render={({ field }) => (
                          <Select value={field.value ?? ""} onValueChange={field.onChange}>
                            <SelectTrigger {...a}>
                              <SelectValue placeholder="Choose an area" />
                            </SelectTrigger>
                            <SelectContent>
                              {AREAS.map((x) => (
                                <SelectItem key={x} value={x}>
                                  {x}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}
                  </Field>
                  <Field label="Street address" required hint="House, road and block. Only shown after a viewing is approved." error={errors.address?.message}>
                    {(a) => <Textarea rows={3} {...a} {...register("address")} />}
                  </Field>
                </>
              )}

              {step === 2 && (
                <div className="grid gap-3">
                  <p className="text-sm text-muted-foreground">Add up to 6 photos. The first one becomes the cover.</p>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((src, i) => (
                      <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                        <PropertyImage src={src} alt={`Photo ${i + 1}`} sizes="(min-width: 640px) 200px, 45vw" />
                        {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-card/90 px-2 py-0.5 text-xs font-semibold">Cover</span>}
                        <button
                          type="button"
                          aria-label={`Remove photo ${i + 1}`}
                          onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute right-1.5 top-1.5 inline-flex size-10 items-center justify-center rounded-full bg-background/90 outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <X className="size-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                    {images.length < 6 && (
                      <li>
                        <label
                          htmlFor="property-photos"
                          className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background text-center text-sm text-muted-foreground transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                        >
                          <ImagePlus className="size-6" aria-hidden="true" />
                          Add photos
                        </label>
                        <input id="property-photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addImages(e.target.files); e.target.value = ""; }} />
                      </li>
                    )}
                  </ul>
                  {imageError && (
                    <p role="alert" className="text-xs font-medium text-danger-strong">
                      {imageError}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <Controller
                  control={control}
                  name="amenities"
                  render={({ field }) => (
                    <fieldset className="grid gap-3">
                      <legend className="text-sm text-muted-foreground">What does the property offer?</legend>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {AMENITIES.map((a) => {
                          const on = field.value?.includes(a) ?? false;
                          const id = `amen-${a}`;
                          return (
                            <label key={a} htmlFor={id} className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 text-sm transition-colors", on ? "border-secondary bg-teal-soft" : "border-border hover:bg-muted")}>
                              <Checkbox id={id} checked={on} onCheckedChange={(c) => field.onChange(c === true ? [...(field.value ?? []), a] : (field.value ?? []).filter((x: string) => x !== a))} />
                              {a}
                            </label>
                          );
                        })}
                      </div>
                      {errors.amenities && (
                        <p role="alert" className="text-xs font-medium text-danger-strong">
                          {errors.amenities.message}
                        </p>
                      )}
                      {!kycOk && (
                        <p id="publish-lock" className="flex items-start gap-2 rounded-xl bg-amber-soft px-3 py-2.5 text-sm">
                          <Lock className="mt-0.5 size-4 shrink-0 text-warning-strong" aria-hidden="true" />
                          <span>
                            Publishing is locked until your verification is approved. You can save this as a draft now.{" "}
                            <Link href="/owner/kyc" className="font-semibold underline underline-offset-2">
                              Check verification
                            </Link>
                          </span>
                        </p>
                      )}
                    </fieldset>
                  )}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={back}>
              <ArrowLeft aria-hidden="true" /> Back
            </Button>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/owner/properties">Cancel</Link>
            </Button>
          )}
          {last ? (
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="outline" disabled={saving !== null} onClick={() => save("draft")}>
                {saving === "draft" ? "Saving…" : property ? "Save changes" : "Save as draft"}
              </Button>
              <Button type="button" disabled={!kycOk || saving !== null} aria-describedby={kycOk ? undefined : "publish-lock"} onClick={() => save("publish")}>
                {saving === "publish" ? "Publishing…" : "Publish"}
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={next}>
              Next <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
