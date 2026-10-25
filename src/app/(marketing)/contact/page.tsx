import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about renting or listing? Send us a message and we'll reply within one working day.",
};

const INFO = [
  { icon: Mail, label: "Email", value: "hello@nesthive.com.bd" },
  { icon: Phone, label: "Phone", value: "01700-000001" },
  { icon: MapPin, label: "Office", value: "Road 11, Banani, Dhaka 1213" },
  { icon: Clock, label: "Hours", value: "Sat–Thu, 9:00 AM – 6:00 PM" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero title="Talk to a person" description="Questions about renting or listing? Send a message and we'll reply within one working day." />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          <ContactForm />
          <ul className="grid content-start gap-3">
            {INFO.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-secondary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
