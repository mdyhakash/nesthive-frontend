import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/types";

/**
 * Status colour language (matches the design spec):
 *  green  = approved / paid / active / published / resolved
 *  amber  = pending / in progress
 *  red    = rejected / blocked / failed / urgent
 *  gray   = draft / cancelled / withdrawn / terminated
 */
const TONES: Record<string, BadgeTone> = {
  // success
  APPROVED: "success",
  PAID: "success",
  ACTIVE: "success",
  PUBLISHED: "success",
  RESOLVED: "success",
  AVAILABLE: "success",
  VERIFIED: "success",
  // warning
  PENDING: "warning",
  IN_PROGRESS: "warning",
  UNPAID: "warning",
  INACTIVE: "neutral",
  // danger
  REJECTED: "danger",
  BLOCKED: "danger",
  FAILED: "danger",
  URGENT: "danger",
  OVERDUE: "danger",
  // neutral
  DRAFT: "neutral",
  CANCELLED: "neutral",
  WITHDRAWN: "neutral",
  TERMINATED: "neutral",
  DELETED: "neutral",
  UNAVAILABLE: "neutral",
  FULL: "neutral",
  // info
  OPEN: "info",
  MEDIUM: "info",
  LOW: "neutral",
  HIGH: "warning",
  READ: "neutral",
  UNREAD: "info",
  DEPOSIT: "info",
  RENT: "neutral",
  UTILITY: "neutral",
};

const LABELS: Record<string, string> = {
  IN_PROGRESS: "In progress",
  UNREAD: "New",
};

export function statusLabel(status: string): string {
  if (LABELS[status]) return LABELS[status];
  const s = status.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function statusTone(status: string): BadgeTone {
  return TONES[status.toUpperCase()] ?? "neutral";
}

interface StatusBadgeProps {
  status: string;
  /** Override the displayed text. */
  label?: string;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, label, tone, className, dot = true }: StatusBadgeProps) {
  const key = status.toUpperCase();
  return (
    <Badge tone={tone ?? statusTone(key)} className={className}>
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {label ?? statusLabel(key)}
    </Badge>
  );
}
