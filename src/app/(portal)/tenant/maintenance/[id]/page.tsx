"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Wrench } from "lucide-react";
import { toast } from "sonner";
import { newId, useData } from "@/components/data-provider";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { InfoRow, SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMockQuery } from "@/hooks/use-mock-query";
import { useLookup } from "@/hooks/use-lookup";
import { useTenant } from "@/hooks/use-tenant";
import { formatDateTime, MOCK_NOW } from "@/lib/format";

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const d = useData();
  const t = useTenant();
  const look = useLookup();
  const { status, retry } = useMockQuery(null);
  const [text, setText] = React.useState("");

  const ticket = t.tickets.find((x) => x.id === id);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !ticket) return;
    d.setTickets((prev) =>
      prev.map((x) =>
        x.id === ticket.id
          ? {
              ...x,
              updatedAt: MOCK_NOW.toISOString(),
              comments: [...x.comments, { id: newId("c"), authorName: ticket.tenantName, authorRole: "TENANT", body, createdAt: MOCK_NOW.toISOString() }],
            }
          : x,
      ),
    );
    setText("");
    toast.success("Comment added");
  };

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-3">
        <Link href="/tenant/maintenance">
          <ArrowLeft aria-hidden="true" />
          All tickets
        </Link>
      </Button>

      {status === "loading" && (
        <div role="status" aria-label="Loading" className="grid gap-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-56" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" &&
        (!ticket ? (
          <EmptyState icon={Wrench} title="Ticket not found" description="It may have been removed, or the link is wrong." action={<Button asChild><Link href="/tenant/maintenance">Back to tickets</Link></Button>} />
        ) : (
          <>
            <PageHeader title={ticket.title} description={`${ticket.category} · ${look.propertyTitle(ticket.propertyId)}`} action={<StatusBadge status={ticket.status} />} />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="grid min-w-0 content-start gap-4 lg:col-span-2">
                <SectionCard title="Description">
                  <p className="text-sm leading-relaxed">{ticket.description}</p>
                  {ticket.imageUrl && (
                    <div className="relative mt-4 aspect-video w-full max-w-md overflow-hidden rounded-xl bg-muted">
                      {ticket.imageUrl.startsWith("blob:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ticket.imageUrl} alt="Photo attached to the ticket" className="size-full object-cover" />
                      ) : (
                        <Image src={ticket.imageUrl} alt="Photo attached to the ticket" fill sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" />
                      )}
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Conversation">
                  {ticket.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No messages yet. Add a note below if you have more to share.</p>
                  ) : (
                    <ul className="grid gap-4">
                      {ticket.comments.map((c) => (
                        <li key={c.id} className="flex gap-3">
                          <UserAvatar name={c.authorName} size="sm" />
                          <div className="min-w-0 flex-1 rounded-xl bg-muted px-3.5 py-2.5">
                            <p className="text-sm font-semibold">
                              {c.authorName} <span className="text-xs font-normal text-muted-foreground">· {c.authorRole.toLowerCase()} · {formatDateTime(c.createdAt)}</span>
                            </p>
                            <p className="mt-1 text-sm">{c.body}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <form onSubmit={send} className="mt-5 grid gap-2">
                    <label htmlFor="ticket-comment" className="text-sm font-medium">Add a comment</label>
                    <Textarea id="ticket-comment" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                    <Button type="submit" disabled={!text.trim()} className="justify-self-end">
                      <Send aria-hidden="true" />
                      Send
                    </Button>
                  </form>
                </SectionCard>
              </div>

              <SectionCard title="Details" className="self-start">
                <dl className="divide-y divide-border">
                  <InfoRow label="Status"><StatusBadge status={ticket.status} /></InfoRow>
                  <InfoRow label="Priority"><StatusBadge status={ticket.priority} dot={false} /></InfoRow>
                  <InfoRow label="Category">{ticket.category}</InfoRow>
                  <InfoRow label="Room">{look.roomName(ticket.roomId)}</InfoRow>
                  <InfoRow label="Opened">{formatDateTime(ticket.createdAt)}</InfoRow>
                  <InfoRow label="Updated">{formatDateTime(ticket.updatedAt)}</InfoRow>
                </dl>
              </SectionCard>
            </div>
          </>
        ))}
    </>
  );
}
