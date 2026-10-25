import { Reveal } from "@/components/marketing/reveal";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/data/marketing";

export function FaqSection({ limit, heading = true }: { limit?: number; heading?: boolean }) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  return (
    <Section id="faq">
      {heading && <SectionHeading title="Questions people ask before they rent" align="center" />}
      <Reveal className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="grid gap-3">
          {items.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}
