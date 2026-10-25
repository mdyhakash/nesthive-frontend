import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

/** Empty list: says what is missing and what to do next. */
export function EmptyState({ title, description, icon: Icon = Inbox, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-soft text-warning-strong">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/** Failed list: explains what happened and offers a retry. */
export function ErrorState({
  title = "We couldn't load this",
  description = "Something went wrong while loading. Check your connection and try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-danger/30 bg-danger-soft px-6 py-14 text-center",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-card text-danger-strong">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}
