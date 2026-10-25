"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/lib/motion";

/** Fade + 8px slide-up on every route change. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  );
}
