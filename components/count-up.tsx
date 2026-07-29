'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

type CountUpProps = {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * Cuenta desde 0 hasta `to` cuando el número entra en viewport (scroll).
 */
export function CountUp({ to, suffix = '', duration = 1.8, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(to);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutExpo — arranca rápido y frena al final
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduceMotion]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0.35, y: 28, scale: 0.92 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : reduceMotion
            ? undefined
            : { opacity: 0.35, y: 28, scale: 0.92 }
      }
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {value.toLocaleString('es-MX')}
      {suffix}
    </motion.span>
  );
}
