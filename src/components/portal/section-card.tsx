import { cn } from "@/lib/utils";

/** Titled card used for dashboard panels and detail sections. */
export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  padded = true,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card", className)}>
      <div className="flex items-start justify-between gap-3 p-4 pb-0 sm:p-5 sm:pb-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold sm:text-lg">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn(padded ? "p-4 sm:p-5" : "pt-4")}>{children}</div>
    </section>
  );
}

/** Label / value row for detail lists. */
export function InfoRow({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-2.5 text-sm", className)}>
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium">{children}</dd>
    </div>
  );
}
