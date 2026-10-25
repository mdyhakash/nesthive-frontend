"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/** Scroll-reveal wrapper: fade-up once, 80px before entering the viewport. */
export function Reveal({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} {...props}>
      {children}
    </motion.div>
  );
}

/** Staggers its <RevealItem> children on scroll (card grids and lists). */
export function RevealGroup({
  children,
  gap = 0.08,
  ...props
}: HTMLMotionProps<"div"> & { gap?: number }) {
  return (
    <motion.div variants={stagger(gap)} initial="hidden" whileInView="visible" viewport={viewportOnce} {...props}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={fadeUp} {...props}>
      {children}
    </motion.div>
  );
}
