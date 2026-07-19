"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const DISTANCE = 28;

function getVariants(direction: Direction): Variants {
  const offset: Record<Direction, { x?: number; y?: number }> = {
    up: { y: DISTANCE },
    down: { y: -DISTANCE },
    left: { x: DISTANCE },
    right: { x: -DISTANCE },
    none: {},
  };
  return {
    hidden: { opacity: 0, ...offset[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };
}

/**
 * Enveloppe un bloc pour le faire apparaître (fondu + léger déplacement) lorsqu'il
 * entre dans le viewport au scroll. Respecte "prefers-reduced-motion" (pas de
 * déplacement, juste un fondu instantané, pour l'accessibilité).
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduceMotion = useReducedMotion();
  const MotionComponent = motion[Component as "div"];

  if (reduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: "-40px" }}
      variants={getVariants(direction)}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Variante "stagger" : anime les enfants directs les uns après les autres.
 * Utiliser avec <RevealGroup> comme parent et <RevealItem> pour chaque enfant.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
  duration = 0.55,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={getVariants(direction)}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
