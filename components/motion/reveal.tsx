"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/** Extra pass-through props kept narrow to avoid clashing with framer-motion's own handlers. */
type PassThroughProps = {
  role?: string;
  "aria-label"?: string;
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  /** Render once when scrolled into view (default) or immediately on mount. */
  mode?: "in-view" | "mount";
  className?: string;
} & PassThroughProps;

/** Fade-up reveal for a single block. Respects prefers-reduced-motion. */
export function Reveal({ children, delay = 0, mode = "in-view", className, ...rest }: RevealProps) {
  const reduceMotion = useReducedMotion();

  const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 };
  const visible = { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] as const } };

  if (mode === "mount") {
    return (
      <motion.div initial={initial} animate={visible} className={className} {...rest}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, margin: "-64px" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } }
};

type StaggerProps = {
  children: ReactNode;
  mode?: "in-view" | "mount";
  className?: string;
} & PassThroughProps;

/** Container that staggers its <StaggerItem> children. */
export function Stagger({ children, mode = "in-view", className, ...rest }: StaggerProps) {
  const viewProps =
    mode === "mount"
      ? { animate: "visible" as const }
      : { whileInView: "visible" as const, viewport: { once: true, margin: "-64px" } };

  return (
    <motion.div initial="hidden" variants={staggerContainer} className={className} {...viewProps} {...rest}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & PassThroughProps) {
  const reduceMotion = useReducedMotion();

  const item: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.6, 0.35, 1] as const } }
  };

  return (
    <motion.div variants={item} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
