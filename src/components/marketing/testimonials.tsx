import { Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { UserAvatar } from "@/components/shared/user-avatar";
import { TESTIMONIALS } from "@/data/marketing";

function Card({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:w-[360px]">
      <div className="flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={i < t.rating ? "size-4 fill-primary text-primary" : "size-4 text-border"}
          />
        ))}
      </div>
      <blockquote className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <UserAvatar name={t.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{t.name}</p>
          <p className="truncate text-xs text-muted-foreground">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Marquee in CSS: pauses on hover/focus, and with reduced motion becomes a
 * normal horizontally scrollable row. The duplicate set is hidden from AT.
 */
export function Testimonials() {
  return (
    <Section tinted containerClassName="max-w-none px-0 sm:px-0 lg:px-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Renters and owners, in their words" align="center" />
      </div>
      <div className="group overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:[mask-image:none]">
        <ul className="flex w-max animate-marquee gap-4 px-2 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
          {TESTIMONIALS.map((t) => (
            <li key={t.name} className="flex">
              <Card t={t} />
            </li>
          ))}
          {TESTIMONIALS.map((t) => (
            <li key={`${t.name}-dup`} aria-hidden="true" className="flex motion-reduce:hidden">
              <Card t={t} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
