"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animated compatibility ring: kente-gradient arc sweeps in while the
 * percentage counts up. `onDark` lightens the track for dark panels.
 */
export function MatchRing({
  target,
  size = 208,
  label = "match",
  onDark = false
}: {
  target: number;
  size?: number;
  label?: string;
  onDark?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(target);
      return;
    }
    let frame: number;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduceMotion]);

  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const gradientId = `ring-gradient-${onDark ? "dark" : "light"}`;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${target}% specialty compatibility`}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={onDark ? "rgba(255,255,255,0.14)" : "hsl(var(--foreground) / 0.1)"}
          strokeWidth="12"
        />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduceMotion ? circumference * (1 - target / 100) : circumference }}
          animate={{ strokeDashoffset: circumference * (1 - target / 100) }}
          transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={onDark ? "#34d399" : "hsl(var(--forest))"} />
            <stop offset="55%" stopColor={onDark ? "#fbbf24" : "hsl(var(--gold))"} />
            <stop offset="100%" stopColor={onDark ? "#f97316" : "hsl(var(--clay))"} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-5xl font-semibold" aria-hidden="true">
          {display}%
        </p>
        <p className={`mt-1 text-[11px] uppercase tracking-[0.2em] ${onDark ? "text-white/70" : "text-foreground/55"}`} aria-hidden="true">
          {label}
        </p>
      </div>
    </div>
  );
}
