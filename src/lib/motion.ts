import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language for NestHive.
 * Everything is subtle and quick: 0.2–0.45s, easeOut, or a soft spring for
 * sheets and dialogs. Reduced motion is handled globally by
 * <MotionConfig reducedMotion="user"> in the Providers component.
 */

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.2,
  base: 0.3,
  slow: 0.45,
} as const;

export const transition = {
  fast: { duration: duration.fast, ease: easeOut } satisfies Transition,
  base: { duration: duration.base, ease: easeOut } satisfies Transition,
  slow: { duration: duration.slow, ease: easeOut } satisfies Transition,
  spring: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } satisfies Transition,
  softSpring: { type: "spring", stiffness: 300, damping: 30, mass: 0.9 } satisfies Transition,
  layout: { type: "spring", stiffness: 500, damping: 38 } satisfies Transition,
};

/** Scroll reveal viewport config: animate once, 80px before entering. */
export const viewportOnce = { once: true, margin: "-80px" } as const;

/* ---------- Basic variants ---------- */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transition.slow },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transition.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transition.base },
};

/** Container that staggers its children (card grids, lists). */
export const stagger = (staggerChildren = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/* ---------- Page transition (app/template.tsx) ---------- */

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: transition.base,
};

/* ---------- Interaction presets ---------- */

/** Card hover lift (desktop) + tap squish (mobile). */
export const cardInteraction = {
  whileHover: { y: -4 },
  whileTap: { scale: 0.98 },
  transition: transition.fast,
};

/** Button tap squish. */
export const buttonTap = {
  whileTap: { scale: 0.97 },
  transition: transition.fast,
};

/* ---------- Hero ---------- */

export const heroContainer: Variants = stagger(0.1, 0.05);

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: transition.slow },
};

/** Gentle infinite float (6s loop). Pass a delay to desync cards. */
export const floatLoop = (delay = 0, distance = 10) => ({
  animate: { y: [0, -distance, 0] },
  transition: { duration: 6, ease: "easeInOut", repeat: Infinity, delay } satisfies Transition,
});

/* ---------- Overlays (dialogs, sheets, dropdowns) ---------- */

export const dialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transition.spring },
  exit: { opacity: 0, scale: 0.97, y: 4, transition: transition.fast },
};

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.fast },
  exit: { opacity: 0, transition: transition.fast },
};

export const sheetVariants = {
  right: {
    hidden: { x: "100%" },
    visible: { x: 0, transition: transition.softSpring },
    exit: { x: "100%", transition: transition.base },
  },
  left: {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: transition.softSpring },
    exit: { x: "-100%", transition: transition.base },
  },
  bottom: {
    hidden: { y: "100%" },
    visible: { y: 0, transition: transition.softSpring },
    exit: { y: "100%", transition: transition.base },
  },
  top: {
    hidden: { y: "-100%" },
    visible: { y: 0, transition: transition.softSpring },
    exit: { y: "-100%", transition: transition.base },
  },
} satisfies Record<string, Variants>;

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transition.spring },
  exit: { opacity: 0, scale: 0.97, transition: transition.fast },
};

/* ---------- Lists with add / remove (AnimatePresence + layout) ---------- */

export const listItem: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: transition.base },
  exit: { opacity: 0, x: -24, scale: 0.97, transition: transition.fast },
};

export const listItemProps = {
  layout: true,
  variants: listItem,
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  transition: transition.layout,
} as const;

/* ---------- Multi-step forms ---------- */

export const stepSlide = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0, transition: transition.base },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -32 : 32,
    transition: transition.fast,
  }),
};

/* ---------- Draw-on-scroll line (How it works) ---------- */

export const drawLine: Variants = {
  hidden: { pathLength: 0, scaleX: 0, scaleY: 0 },
  visible: {
    pathLength: 1,
    scaleX: 1,
    scaleY: 1,
    transition: { duration: 1.1, ease: "easeOut" },
  },
};
