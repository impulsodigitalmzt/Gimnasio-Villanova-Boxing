'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

/**
 * Copy del hero debajo del video (no se superpone al logo).
 * Brand primero; el pitch del método va en una sola línea de apoyo.
 */
export function HeroIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.65 }}
      className="mx-auto w-full max-w-2xl px-5 py-6 text-center sm:py-8"
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-brand-light">
        Villanova Boxing
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        El entrenamiento que revoluciona{' '}
        <span className="text-gradient-brand">cuerpo y mente</span>
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-300 sm:text-base">
        60 minutos. Máximo impacto. Boxeo y funcional para quemar grasa, ganar músculo y subir de nivel.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link
          href="/planes"
          className="inline-flex rounded-full bg-brand px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-brand-light"
        >
          Ver membresías
        </Link>
        <Link
          href="/#metodo"
          className="inline-flex rounded-full border border-white/35 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:border-brand hover:bg-brand/10"
        >
          Conocer el método
        </Link>
      </div>
    </motion.div>
  );
}
