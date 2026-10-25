"use client";

import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/marketing/section";
import { HOW_IT_WORKS_STEPS } from "@/data/marketing";
import { iconFor } from "@/lib/icons";
import { stagger, fadeUp, viewportOnce } from "@/lib/motion";

/**
 * Four steps joined by a line that draws itself as the section scrolls into
 * view: vertical on mobile, horizontal from lg up.
 */
export function HowItWorks({ heading = true }: { heading?: boolean }) {
  return (
    <Section tinted id="how-it-works">
      {heading && (
        <SectionHeading
          title="From search to keys in four steps"
          description="No agents, no endless phone calls. Everything happens in one place."
          align="center"
        />
      )}

      <motion.ol
        variants={stagger(0.18)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative grid gap-10 lg:grid-cols-4 lg:gap-6"
      >
        {/* Connecting line — vertical (mobile) */}
        <div aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-0.5 bg-border lg:hidden">
          <motion.div
            className="h-full w-full origin-top bg-secondary"
            variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 1.2, ease: "easeOut" } } }}
          />
        </div>
        {/* Connecting line — horizontal (desktop) */}
        <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-border lg:block">
          <motion.div
            className="h-full w-full origin-left bg-secondary"
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.2, ease: "easeOut" } } }}
          />
        </div>

        {HOW_IT_WORKS_STEPS.map((step, i) => {
          const Icon = iconFor(step.icon);
          return (
            <motion.li
              key={step.title}
              variants={fadeUp}
              className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-4 lg:text-center"
            >
              <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-card text-secondary">
                <Icon className="size-6" aria-hidden="true" />
                <span className="num absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
              </span>
              <div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">{step.body}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </Section>
  );
}
