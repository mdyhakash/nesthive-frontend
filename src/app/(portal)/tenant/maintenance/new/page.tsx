"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newId, useData } from "@/components/data-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTenant } from "@/hooks/use-tenant";
import { MOCK_NOW } from "@/lib/format";
import type { MaintenanceTicket } from "@/types";

const CATEGORIES = ["Plumbing", "Electrical", "Appliance", "Furniture", "Cleaning", "Other"] as const;
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

const schema = z.object({
  title: z.string().min(5, "Give the issue a short title (at least 5 characters)").max(80, "Keep the title under 80 characters"),
  category: z.enum(CATEGORIES, { message: "Choose a category" }),
  priority: z.enum(PRIORITIES, { message: "Choose how urgent it is" }),
  description: z.string().min(15, "Describe what's wrong (at least 15 characters)").max(600, "Keep it under 600 characters"),
});
type Values = z.infer<typeof schema>;

export default function NewTicket() {
  const router = useRouter();
  const d = useData();
  const t = useTenant();
  const [photo, setPhoto] = React.useState<{ url: string; name: string } | null>(null);
  const [photoError, setPhotoError] = React.useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", priority: "MEDIUM" },
  });

  React.useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo.url);
  }, [photo]);

  const pick = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setPhotoError("Please choose an image file (JPG or PNG).");
    if (file.size > 5 * 1024 * 1024) return setPhotoError("That photo is over 5 MB. Choose a smaller one.");
    setPhotoError("");
    setPhoto({ url: URL.createObjectURL(file), name: file.name });
  };

  const onSubmit = async (v: Values) => {
    await new Promise((r) => setTimeout(r, 500));
    const now = MOCK_NOW.toISOString();
    const ticket: MaintenanceTicket = {
      id: newId("t"),
      propertyId: t.lease?.propertyId ?? "",
      roomId: t.lease?.roomId,
      tenantId: t.id,
      tenantName: "Rafiq Ahmed",
      title: v.title,
      description: v.description,
      category: v.category,
      priority: v.priority,
      status: "OPEN",
      imageUrl: photo?.url,
      comments: [],
      createdAt: now,
      updatedAt: now,
    };
    d.setTickets((prev) => [ticket, ...prev]);
    d.audit({ actorId: t.id, actorName: ticket.tenantName, actorRole: "TENANT", action: "CREATE", entity: "MaintenanceTicket", entityId: ticket.id, summary: `${ticket.tenantName} reported: ${ticket.title}` });
    toast.success("Ticket created", { description: "Your manager has been notified." });
    router.push(`/tenant/maintenance/${ticket.id}`);
  };

  return (
    <>
      <PageHeader title="New maintenance ticket" description="Tell us what's wrong. A photo helps the technician arrive prepared." />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid max-w-2xl gap-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <Field label="Title" required error={errors.title?.message}>
          {(a) => <Input placeholder="e.g. Bathroom tap is leaking" {...a} {...register("title")} />}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" required error={errors.category?.message}>
            {(a) => (
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger {...a}>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </Field>
          <Field label="Priority" required error={errors.priority?.message}>
            {(a) => (
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger {...a}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0) + p.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </Field>
        </div>

        <Field label="What's happening?" required error={errors.description?.message}>
          {(a) => <Textarea rows={5} {...a} {...register("description")} />}
        </Field>

        <Field label="Photo" hint="Optional. JPG or PNG up to 5 MB." error={photoError}>
          {(a) => (
            <div className="grid gap-3">
              {photo ? (
                <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={`Preview of ${photo.name}`} className="aspect-video w-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => setPhoto(null)}
                    className="absolute right-2 top-2 inline-flex size-10 items-center justify-center rounded-full bg-background/90 outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor={a.id}
                  className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 text-center text-sm text-muted-foreground transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                >
                  <ImagePlus className="size-6" aria-hidden="true" />
                  Tap to add a photo
                </label>
              )}
              <input id={a.id} type="file" accept="image/*" className="sr-only" aria-describedby={a["aria-describedby"]} onChange={(e) => pick(e.target.files?.[0])} />
            </div>
          )}
        </Field>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild variant="outline">
            <Link href="/tenant/maintenance">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit ticket"}
          </Button>
        </div>
      </form>
    </>
  );
}
