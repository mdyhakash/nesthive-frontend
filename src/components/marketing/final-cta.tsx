import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { Section } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

export function FinalCta({
  title = "Your next room is already listed",
  description = "Browse verified rooms in Dhaka, or create a free account and answer the roommate questions in two minutes.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Section className="pt-0 sm:pt-0 lg:pt-0">
      <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-amber-soft px-6 py-12 text-center sm:px-10 sm:py-16">
        <div aria-hidden="true" className="hive-glow pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-section">{title}</h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/browse">
                Browse rooms
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Create a free account</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
