import { cn } from "@/lib/utils";

/** Compact hero for inner marketing pages. */
export function PageHero({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border", className)}>
      <div aria-hidden="true" className="hive-glow pointer-events-none absolute -top-32 left-1/2 h-[380px] w-[700px] max-w-[150%] -translate-x-1/2 opacity-50 dark:opacity-30" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p>
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
