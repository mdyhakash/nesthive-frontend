"use client";

import * as React from "react";
import Image from "next/image";
import { Check, FileUp, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useOwner } from "@/hooks/use-owner";
import { formatDateTime, MOCK_NOW } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { KycDocument, KycDocumentType } from "@/types";

const SLOTS: { type: KycDocumentType; label: string; hint: string }[] = [
  { type: "NID_FRONT", label: "NID card, front", hint: "Clear photo, all four corners visible" },
  { type: "NID_BACK", label: "NID card, back", hint: "Address side, not blurred" },
  { type: "OWNERSHIP_PROOF", label: "Ownership proof", hint: "Dolil, khatian or recent utility bill in your name" },
];

type Picked = Partial<Record<KycDocumentType, { url: string; name: string }>>;

function Stepper({ status }: { status: "PENDING" | "APPROVED" | "REJECTED" }) {
  const steps = [
    { label: "Submitted", state: "done" },
    { label: "Under review", state: status === "PENDING" ? "current" : "done" },
    { label: status === "REJECTED" ? "Rejected" : "Approved", state: status === "PENDING" ? "todo" : status === "REJECTED" ? "bad" : "good" },
  ] as const;
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Verification progress">
      {steps.map((s, i) => (
        <li key={s.label} className="relative flex flex-col items-center text-center">
          {i > 0 && <span aria-hidden="true" className={cn("absolute right-1/2 top-3 h-0.5 w-full", steps[i - 1].state === "todo" || s.state === "todo" ? "bg-border" : "bg-secondary")} />}
          <span
            className={cn(
              "relative z-10 flex size-6 items-center justify-center rounded-full border-2 bg-card",
              s.state === "done" && "border-secondary bg-secondary text-white",
              s.state === "good" && "border-success bg-success text-white",
              s.state === "bad" && "border-danger bg-danger text-white",
              s.state === "current" && "border-amber",
              s.state === "todo" && "border-border",
            )}
          >
            {(s.state === "done" || s.state === "good") && <Check className="size-3.5" aria-hidden="true" />}
            {s.state === "bad" && <X className="size-3.5" aria-hidden="true" />}
            {s.state === "current" && <span className="size-2 animate-pulse rounded-full bg-amber" />}
          </span>
          <span className="mt-2 text-xs font-medium sm:text-sm">{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

export default function OwnerKyc() {
  const d = useData();
  const { owner } = useOwner();
  const { status, retry } = useMockQuery(null);
  const [picked, setPicked] = React.useState<Picked>({});
  const [errors, setErrors] = React.useState<Partial<Record<KycDocumentType, string>>>({});
  const [editing, setEditing] = React.useState(false);

  React.useEffect(
    () => () => {
      Object.values(picked).forEach((p) => p && URL.revokeObjectURL(p.url));
    },
    [picked],
  );

  const pick = (type: KycDocumentType, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") return setErrors((e) => ({ ...e, [type]: "Upload a JPG, PNG or PDF." }));
    if (file.size > 5 * 1024 * 1024) return setErrors((e) => ({ ...e, [type]: "Keep each file under 5 MB." }));
    setErrors((e) => ({ ...e, [type]: undefined }));
    setPicked((p) => ({ ...p, [type]: { url: URL.createObjectURL(file), name: file.name } }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: typeof errors = {};
    SLOTS.forEach((s) => {
      if (!picked[s.type]) missing[s.type] = "This document is required.";
    });
    setErrors(missing);
    if (Object.keys(missing).length) return;
    const now = MOCK_NOW.toISOString();
    const docs: KycDocument[] = SLOTS.map((s, i) => ({ id: `d-new-${i}`, type: s.type, fileName: picked[s.type]!.name, url: picked[s.type]!.url, uploadedAt: now }));
    d.setOwners((prev) => prev.map((x) => (x.id === owner.id ? { ...x, kycStatus: "PENDING", kycSubmittedAt: now, kycReviewedAt: undefined, kycRejectReason: undefined, documents: docs } : x)));
    d.audit({ actorId: owner.userId, actorName: owner.name, actorRole: "OWNER", action: "UPDATE", entity: "Owner", entityId: owner.id, summary: `${owner.name} submitted KYC documents` });
    toast.success("Documents submitted", { description: "We usually review within 2 working days." });
    setPicked({});
    setEditing(false);
  };

  const showForm = owner.kycStatus === "REJECTED" || editing;

  return (
    <>
      <PageHeader title="Verification (KYC)" description="Verified owners can publish listings and receive applications." />

      {status === "loading" && (
        <div role="status" aria-label="Loading" className="grid gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" && (
        <div className="grid gap-4">
          <SectionCard title="Status" action={<StatusBadge status={owner.kycStatus} />}>
            <Stepper status={owner.kycStatus} />
            {owner.kycSubmittedAt && <p className="mt-5 text-sm text-muted-foreground">Submitted {formatDateTime(owner.kycSubmittedAt)}</p>}
            {owner.kycStatus === "APPROVED" && owner.kycReviewedAt && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-success-strong">
                <ShieldCheck className="size-4" aria-hidden="true" /> Approved {formatDateTime(owner.kycReviewedAt)}. You can publish properties.
              </p>
            )}
            {owner.kycStatus === "PENDING" && <p className="mt-1 text-sm text-muted-foreground">We are checking your documents. You can still prepare listings as drafts.</p>}
            {owner.kycStatus === "REJECTED" && (
              <p className="mt-3 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger-strong">
                <span className="font-semibold">Reason: </span>
                {owner.kycRejectReason ?? "Documents could not be verified."}
              </p>
            )}
          </SectionCard>

          {!showForm ? (
            <SectionCard title="Submitted documents" action={owner.kycStatus === "APPROVED" ? <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Update documents</Button> : undefined}>
              <ul className="grid gap-3 sm:grid-cols-3">
                {owner.documents.map((doc) => (
                  <li key={doc.id} className="min-w-0">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                      {doc.url.startsWith("blob:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc.url} alt={doc.fileName} className="size-full object-cover" />
                      ) : (
                        <Image src={doc.url} alt={doc.fileName} fill sizes="(min-width: 640px) 30vw, 90vw" className="object-cover" />
                      )}
                    </div>
                    <p className="mt-2 truncate text-sm font-medium">{SLOTS.find((s) => s.type === doc.type)?.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{doc.fileName}</p>
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : (
            <SectionCard title={editing ? "Update your documents" : "Resubmit your documents"} description="Upload clear photos or scans. Files stay on this device in the demo.">
              <form onSubmit={submit} noValidate className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  {SLOTS.map((s) => {
                    const p = picked[s.type];
                    const id = `kyc-${s.type}`;
                    return (
                      <div key={s.type} className="min-w-0">
                        <label htmlFor={id} className="mb-2 block text-sm font-medium">
                          {s.label}
                          <span aria-hidden="true" className="ml-0.5 text-danger-strong">*</span>
                        </label>
                        <label
                          htmlFor={id}
                          className={cn(
                            "relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed bg-background px-3 text-center text-sm text-muted-foreground transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring",
                            errors[s.type] ? "border-danger" : "border-border",
                          )}
                        >
                          {p ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.url} alt={`Preview of ${p.name}`} className="absolute inset-0 size-full object-cover" />
                          ) : (
                            <>
                              <FileUp className="size-6" aria-hidden="true" />
                              <span>Tap to upload</span>
                            </>
                          )}
                        </label>
                        <input id={id} type="file" accept="image/*,application/pdf" className="sr-only" aria-describedby={`${id}-hint`} onChange={(e) => pick(s.type, e.target.files?.[0])} />
                        <p id={`${id}-hint`} className={cn("mt-1.5 text-xs", errors[s.type] ? "font-medium text-danger-strong" : "text-muted-foreground")} role={errors[s.type] ? "alert" : undefined}>
                          {errors[s.type] ?? (p ? p.name : s.hint)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  {editing && (
                    <Button type="button" variant="outline" onClick={() => { setEditing(false); setPicked({}); setErrors({}); }}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit">Submit for review</Button>
                </div>
              </form>
            </SectionCard>
          )}
        </div>
      )}
    </>
  );
}
