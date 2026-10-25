import { cn } from "@/lib/utils";
import { Reveal } from "@/components/marketing/reveal";

export function Section({
  className,
  containerClassName,
  children,
  id,
  tinted,
}: {
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  id?: string;
  tinted?: boolean;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-14 sm:py-20 lg:py-24", tinted && "bg-muted/50", className)}>
      <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", containerClassName)}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-8 max-w-2xl sm:mb-12", align === "center" && "mx-auto text-center", className)}>
      <h2 className="text-section">{title}</h2>
      {description && <p className="mt-3 text-base text-muted-foreground sm:text-lg">{description}</p>}
    </Reveal>
  );
}
