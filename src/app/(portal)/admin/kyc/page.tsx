"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Eye, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { RejectDialog } from "@/components/portal/reject-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockQuery } from "@/hooks/use-mock-query";
import { formatDate, MOCK_NOW } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { KycStatus, Owner } from "@/types";

const LABEL: Record<string, string> = { NID_FRONT: "NID front", NID_BACK: "NID back", OWNERSHIP_PROOF: "Ownership proof" };
const ADMIN = { id: "u-a1", name: "Tahmina Akter" };

export default function AdminKyc() {
  const d = useData();
  const { status, retry } = useMockQuery(null);
  const [tab, setTab] = React.useState<"PENDING" | "ALL">("PENDING");
  const [viewing, setViewing] = React.useState<Owner | null>(null);
  const [docIndex, setDocIndex] = React.useState(0);
  const [rejecting, setRejecting] = React.useState<Owner | null>(null);

  const rows = d.owners.filter((o) => tab === "ALL" || o.kycStatus === "PENDING").sort((a, b) => (b.kycSubmittedAt ?? "").localeCompare(a.kycSubmittedAt ?? ""));
  const pending = d.owners.filter((o) => o.kycStatus === "PENDING").length;

  const decide = (o: Owner, next: Exclude<KycStatus, "PENDING">, reason?: string) => {
    const now = MOCK_NOW.toISOString();
    d.setOwners((prev) => prev.map((x) => (x.id === o.id ? { ...x, kycStatus: next, kycReviewedAt: now, kycRejectReason: reason } : x)));
    if (next === "APPROVED") d.setProperties((prev) => prev.map((p) => (p.ownerId === o.id ? { ...p, verified: true } : p)));
    d.audit({ actorId: ADMIN.id, actorName: ADMIN.name, actorRole: "ADMIN", action: next === "APPROVED" ? "APPROVE" : "REJECT", entity: "Owner", entityId: o.id, summary: `${next === "APPROVED" ? "Approved" : "Rejected"} KYC for ${o.name}` });
    d.notify({ userId: o.userId, kind: "KYC", title: next === "APPROVED" ? "Verification approved" : "Verification rejected", body: next === "APPROVED" ? "Your KYC is approved. You can publish properties." : `Your documents were rejected: ${reason}`, href: "/owner/kyc" });
    toast.success(next === "APPROVED" ? `${o.name} approved` : `${o.name} rejected`);
    setViewing(null);
  };

  const columns: Column<Owner>[] = [
    { key: "name", header: "Owner", primary: true, cell: (o) => <div><p className="font-semibold">{o.name}</p><p className="text-xs font-normal text-muted-foreground">{o.businessName ?? o.email}</p></div> },
    { key: "phone", header: "Phone", cell: (o) => <span className="num">{o.phone}</span> },
    { key: "docs", header: "Documents", cell: (o) => <span className="num">{o.documents.length} files</span> },
    { key: "submitted", header: "Submitted", cell: (o) => (o.kycSubmittedAt ? formatDate(o.kycSubmittedAt) : "—") },
    { key: "status", header: "Status", cell: (o) => <StatusBadge status={o.kycStatus} /> },
  ];

  const doc = viewing?.documents[docIndex];

  return (
    <>
      <PageHeader title="KYC queue" description="Check each owner's documents before they can publish listings." />
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList aria-label="Filter owners">
          <TabsTrigger value="PENDING">Pending<span className="num text-xs text-muted-foreground">{pending}</span></TabsTrigger>
          <TabsTrigger value="ALL">All owners<span className="num text-xs text-muted-foreground">{d.owners.length}</span></TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4">
        <DataTable
          caption="Owner verification"
          columns={columns}
          rows={rows}
          rowKey={(o) => o.id}
          status={status}
          onRetry={retry}
          emptyIcon={ShieldCheck}
          emptyTitle="Queue is clear"
          emptyDescription="No owners are waiting for review right now."
          rowActions={(o) => (
            <Button size="sm" variant={o.kycStatus === "PENDING" ? "default" : "outline"} onClick={() => { setViewing(o); setDocIndex(0); }}>
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
            <DialogDescription>{viewing?.businessName} · {viewing?.email} · submitted {viewing?.kycSubmittedAt ? formatDate(viewing.kycSubmittedAt) : "—"}</DialogDescription>
          </DialogHeader>
          {viewing && doc && (
            <div className="grid gap-4">
              <div role="tablist" aria-label="Documents" className="flex gap-2 overflow-x-auto scrollbar-hide">
                {viewing.documents.map((x, i) => (
                  <button key={x.id} role="tab" aria-selected={i === docIndex} type="button" onClick={() => setDocIndex(i)} className={cn("min-h-11 shrink-0 rounded-xl border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", i === docIndex ? "border-secondary bg-teal-soft text-secondary" : "border-border hover:bg-muted")}>
                    {LABEL[x.type]}
                  </button>
                ))}
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                {doc.url.startsWith("blob:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doc.url} alt={`${LABEL[doc.type]} of ${viewing.name}`} className="size-full object-contain" />
                ) : (
                  <Image src={doc.url} alt={`${LABEL[doc.type]} of ${viewing.name}`} fill sizes="(min-width: 672px) 640px, 90vw" className="object-contain" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{doc.fileName} · uploaded {formatDate(doc.uploadedAt)}</p>
              {viewing.kycStatus === "PENDING" ? (
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={() => { const o = viewing; setViewing(null); setRejecting(o); }}>
                    <X aria-hidden="true" />
                    Reject
                  </Button>
                  <Button onClick={() => decide(viewing, "APPROVED")}>
                    <Check aria-hidden="true" />
                    Approve owner
                  </Button>
                </div>
              ) : (
                <p className="flex items-center gap-2 text-sm">
                  <StatusBadge status={viewing.kycStatus} /> {viewing.kycRejectReason && <span className="text-muted-foreground">Reason: {viewing.kycRejectReason}</span>}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RejectDialog open={rejecting !== null} onOpenChange={(v) => !v && setRejecting(null)} title="Reject verification" description={`Tell ${rejecting?.name ?? "the owner"} what to fix. They can resubmit afterwards.`} onSubmit={(reason) => rejecting && decide(rejecting, "REJECTED", reason)} />
    </>
  );
}
