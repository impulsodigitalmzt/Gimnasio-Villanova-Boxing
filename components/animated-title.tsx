'use client';

import { Fragment, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type TitleToken =
  | { type: 'word'; text: string; highlight: boolean }
  | { type: 'space'; text: string }
  | { type: 'br' };

function tokenizeTitle(title: string): TitleToken[] {
  const tokens: TitleToken[] = [];
  const lines = title.split('\n');

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) tokens.push({ type: 'br' });

    const segments = line.split(/(\*[^*]+\*)/g);
    segments.forEach((segment) => {
      if (!segment) return;
      if (segment.startsWith('*') && segment.endsWith('*') && segment.length > 2) {
        tokens.push({ type: 'word', text: segment.slice(1, -1), highlight: true });
        return;
      }

      segment.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) tokens.push({ type: 'space', text: chunk });
        else tokens.push({ type: 'word', text: chunk, highlight: false });
      });
    });
  });

  return tokens;
}

type AnimatedTitleProps = {
  title: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'blockquote';
  className?: string;
  /** Retraso base al entrar en vista */
  delay?: number;
};

/**
 * Título con palabras que entran al hacer scroll (stagger + slide).
 * Soporta *texto* para gradiente de marca y saltos de línea.
 */
export function AnimatedTitle({
  title,
  as: Tag = 'h2',
  className,
  delay = 0,
}: AnimatedTitleProps) {
  const reduceMotion = useReducedMotion();
  const tokens = tokenizeTitle(title);
  let wordIndex = 0;

  if (reduceMotion) {
    return (
      <Tag className={className}>
        {tokens.map((token, i) => {
          if (token.type === 'br') return <br key={`br-${i}`} />;
          if (token.type === 'space') return <Fragment key={`s-${i}`}>{token.text}</Fragment>;
          return token.highlight ? (
            <span key={`w-${i}`} className="text-gradient-brand">
              {token.text}
            </span>
          ) : (
            <Fragment key={`w-${i}`}>{token.text}</Fragment>
          );
        })}
      </Tag>
    );
  }

  // Mapa explícito: evita `motion[Tag]` dinámico (puede quedar undefined en HMR/SW).
  const MotionTag =
    Tag === 'h1'
      ? motion.h1
      : Tag === 'h3'
        ? motion.h3
        : Tag === 'p'
          ? motion.p
          : Tag === 'blockquote'
            ? motion.blockquote
            : motion.h2;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {tokens.map((token, i) => {
        if (token.type === 'br') return <br key={`br-${i}`} />;
        if (token.type === 'space') {
          return (
            <span key={`s-${i}`} className="inline-block whitespace-pre">
              {token.text}
            </span>
          );
        }

        const index = wordIndex++;
        return (
          <motion.span
            key={`w-${i}`}
            className={`inline-block ${token.highlight ? 'text-gradient-brand' : ''}`}
            variants={{
              hidden: { opacity: 0, y: 36, rotateX: 40, filter: 'blur(6px)' },
              show: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                transition: {
                  duration: 0.55,
                  delay: delay + index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
            style={{ transformOrigin: '50% 100%', perspective: 600 }}
          >
            {token.text}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}

export function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
