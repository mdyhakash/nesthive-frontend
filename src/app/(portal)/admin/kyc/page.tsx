"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Eye, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { RejectDialog } from "@/components/portal/reject-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllOwners, useUpdateKycStatusMutation } from "@/hooks/useAdmin";
import { extractData } from "@/lib/api-helper";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { KycDocument, KycStatus, Owner } from "@/types";
import type { OwnerItem } from "@/api/admin.api";

const LABEL: Record<string, string> = {
  NID_FRONT: "Primary Document",
  NID_BACK: "NID back",
  OWNERSHIP_PROOF: "Ownership proof",
};

export default function AdminKyc() {
  const { data: ownersRes, isLoading, isError, refetch } = useAllOwners();
  const updateKycMutation = useUpdateKycStatusMutation();

  const [tab, setTab] = React.useState<"PENDING" | "ALL">("PENDING");
  const [viewing, setViewing] = React.useState<Owner | null>(null);
  const [docIndex, setDocIndex] = React.useState(0);
  const [rejecting, setRejecting] = React.useState<Owner | null>(null);

  const rawOwners = extractData<OwnerItem[]>(ownersRes) || [];

  const mappedOwners: Owner[] = React.useMemo(() => {
    if (!Array.isArray(rawOwners)) return [];
    return rawOwners.map((o) => {
      const docs: KycDocument[] = [];
      if (o.kycDocumentUrl) {
        docs.push({
          id: `${o.id}-doc-primary`,
          type: "NID_FRONT",
          fileName: "KYC Document",
          url: o.kycDocumentUrl,
          uploadedAt: o.createdAt,
        });
      }
      if (Array.isArray(o.additionalFiles)) {
        o.additionalFiles.forEach((f, idx) => {
          docs.push({
            id: `${o.id}-doc-${idx}`,
            type: idx === 0 ? "NID_BACK" : "OWNERSHIP_PROOF",
            fileName: `Attachment ${idx + 1}`,
            url: f.url,
            uploadedAt: o.createdAt,
          });
        });
      }

      return {
        id: o.id,
        userId: o.userId,
        name: o.name || "Owner",
        email: o.email,
        phone: o.contactNumber || "N/A",
        businessName: undefined,
        kycStatus: o.verificationStatus as KycStatus,
        kycSubmittedAt: o.createdAt,
        kycReviewedAt: o.reviewedAt || undefined,
        kycRejectReason: o.rejectionReason || undefined,
        documents: docs,
        propertyCount: 0,
      };
    });
  }, [rawOwners]);

  const rows = mappedOwners
    .filter((o) => tab === "ALL" || o.kycStatus === "PENDING")
    .sort((a, b) => (b.kycSubmittedAt ?? "").localeCompare(a.kycSubmittedAt ?? ""));

  const pendingCount = mappedOwners.filter((o) => o.kycStatus === "PENDING").length;

  const decide = (o: Owner, next: Exclude<KycStatus, "PENDING">, reason?: string) => {
    updateKycMutation.mutate(
      { ownerId: o.id, status: next, rejectReason: reason },
      {
        onSuccess: () => {
          refetch();
          setViewing(null);
        },
      },
    );
  };

  const columns: Column<Owner>[] = [
    {
      key: "name",
      header: "Owner",
      primary: true,
      cell: (o) => (
        <div>
          <p className="font-semibold">{o.name}</p>
          <p className="text-xs font-normal text-muted-foreground">{o.email}</p>
        </div>
      ),
    },
    { key: "phone", header: "Phone", cell: (o) => <span className="num">{o.phone}</span> },
    { key: "docs", header: "Documents", cell: (o) => <span className="num">{o.documents.length} files</span> },
    { key: "submitted", header: "Submitted", cell: (o) => (o.kycSubmittedAt ? formatDate(o.kycSubmittedAt) : "—") },
    { key: "status", header: "Status", cell: (o) => <StatusBadge status={o.kycStatus} /> },
  ];

  const doc = viewing?.documents[docIndex];

  return (
    <>
      <PageHeader
        title="KYC queue"
        description="Live owner verification from backend API."
      />
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList aria-label="Filter owners">
          <TabsTrigger value="PENDING">
            Pending<span className="num text-xs text-muted-foreground">{pendingCount}</span>
          </TabsTrigger>
          <TabsTrigger value="ALL">
            All owners<span className="num text-xs text-muted-foreground">{mappedOwners.length}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4">
        <DataTable
          caption="Owner verification"
          columns={columns}
          rows={rows}
          rowKey={(o) => o.id}
          status={isLoading ? "loading" : isError ? "error" : "success"}
          onRetry={() => refetch()}
          emptyIcon={ShieldCheck}
          emptyTitle="Queue is clear"
          emptyDescription={tab === "PENDING" ? "No owners are waiting for review right now." : "No owners found in database."}
          rowActions={(o) => (
            <Button
              size="sm"
              variant={o.kycStatus === "PENDING" ? "default" : "outline"}
              onClick={() => {
                setViewing(o);
                setDocIndex(0);
              }}
            >
              <Eye aria-hidden="true" />
              {o.kycStatus === "PENDING" ? "Review" : "View"}
            </Button>
          )}
        />
      </div>

      <Dialog open={viewing !== null} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
            <DialogDescription>
              {viewing?.email} · submitted {viewing?.kycSubmittedAt ? formatDate(viewing.kycSubmittedAt) : "—"}
            </DialogDescription>
          </DialogHeader>
          {viewing && doc && (
            <div className="grid gap-4">
              <div role="tablist" aria-label="Documents" className="flex gap-2 overflow-x-auto scrollbar-hide">
                {viewing.documents.map((x, i) => (
                  <button
                    key={x.id}
                    role="tab"
                    aria-selected={i === docIndex}
                    type="button"
                    onClick={() => setDocIndex(i)}
                    className={cn(
                      "min-h-11 shrink-0 rounded-xl border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      i === docIndex ? "border-secondary bg-teal-soft text-secondary" : "border-border hover:bg-muted",
                    )}
                  >
                    {LABEL[x.type] || `File ${i + 1}`}
                  </button>
                ))}
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
                {doc.url.toLowerCase().endsWith(".pdf") ? (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <p className="text-sm font-medium">PDF Document: {doc.fileName}</p>
                    <Button asChild size="sm" variant="outline">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        Open PDF in new tab
                      </a>
                    </Button>
                  </div>
                ) : (
                  <Image
                    src={doc.url}
                    alt={`${LABEL[doc.type] || "Document"} of ${viewing.name}`}
                    fill
                    sizes="(min-width: 672px) 640px, 90vw"
                    className="object-contain"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {doc.fileName} · uploaded {formatDate(doc.uploadedAt)}
              </p>
              {viewing.kycStatus === "PENDING" ? (
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const o = viewing;
                      setViewing(null);
                      setRejecting(o);
                    }}
                  >
                    <X aria-hidden="true" />
                    Reject
                  </Button>
                  <Button
                    disabled={updateKycMutation.isPending}
                    onClick={() => decide(viewing, "APPROVED")}
                  >
                    <Check aria-hidden="true" />
                    {updateKycMutation.isPending ? "Approving…" : "Approve owner"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <StatusBadge status={viewing.kycStatus} />{" "}
                  {viewing.kycRejectReason && (
                    <span className="text-muted-foreground">Reason: {viewing.kycRejectReason}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RejectDialog
        open={rejecting !== null}
        onOpenChange={(v) => !v && setRejecting(null)}
        title="Reject verification"
        description={`Tell ${rejecting?.name ?? "the owner"} what to fix. They can resubmit afterwards.`}
        onSubmit={(reason) => rejecting && decide(rejecting, "REJECTED", reason)}
      />
    </>
  );
}
