'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ChevronDown, CircleHelp, ListOrdered, MessageCircleQuestion, X } from 'lucide-react';
import type { HelpContent } from '@/lib/help/types';

type HelpContextValue = {
  open: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
};

const HelpContext = createContext<HelpContextValue | null>(null);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openHelp = useCallback(() => setOpen(true), []);
  const closeHelp = useCallback(() => setOpen(false), []);
  const toggleHelp = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo(
    () => ({ open, openHelp, closeHelp, toggleHelp }),
    [open, openHelp, closeHelp, toggleHelp],
  );

  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
}

export function useHelp() {
  const ctx = useContext(HelpContext);
  if (!ctx) {
    throw new Error('useHelp must be used within HelpProvider');
  }
  return ctx;
}

type Theme = 'admin' | 'portal';

const themeStyles: Record<
  Theme,
  {
    panel: string;
    border: string;
    muted: string;
    accent: string;
    accentSoft: string;
    chip: string;
    faqBtn: string;
    faqOpen: string;
  }
> = {
  admin: {
    panel: 'bg-[var(--admin-panel)] text-white',
    border: 'border-zinc-500',
    muted: 'text-zinc-400',
    accent: 'text-[var(--admin-brand-light)]',
    accentSoft: 'bg-[var(--admin-brand)]/15 text-[var(--admin-brand-light)]',
    chip: 'bg-[var(--admin-brand)] text-white',
    faqBtn: 'hover:bg-white/5',
    faqOpen: 'bg-white/[0.04]',
  },
  portal: {
    panel: 'bg-[var(--portal-card)] text-[var(--portal-text)]',
    border: 'border-zinc-500',
    muted: 'text-[var(--portal-muted)]',
    accent: 'text-[var(--portal-brand-light)]',
    accentSoft: 'bg-[var(--portal-brand)]/15 text-[var(--portal-brand-light)]',
    chip: 'bg-[var(--portal-brand)] text-white',
    faqBtn: 'hover:bg-white/5',
    faqOpen: 'bg-black/40',
  },
};

export function HelpDrawer({
  content,
  theme = 'admin',
}: {
  content: HelpContent;
  theme?: Theme;
}) {
  const { open, closeHelp } = useHelp();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const styles = themeStyles[theme];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeHelp();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeHelp]);

  useEffect(() => {
    if (!open) setOpenFaq(null);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Cerrar ayuda"
        onClick={closeHelp}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-drawer-title"
        className={`relative z-10 flex h-full w-full max-w-md flex-col border-l shadow-2xl ${styles.panel} ${styles.border}`}
      >
        <header className={`flex items-start justify-between gap-3 border-b px-5 py-5 ${styles.border}`}>
          <div className="min-w-0">
            <p className={`mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${styles.accent}`}>
              <CircleHelp className="size-3.5" />
              Centro de ayuda
            </p>
            <h2 id="help-drawer-title" className="font-display text-2xl font-black uppercase leading-tight text-white">
              {content.title}
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${styles.muted}`}>{content.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={closeHelp}
            className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="admin-scrollbar flex-1 space-y-8 overflow-y-auto px-5 py-6">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className={`flex size-8 items-center justify-center rounded-lg ${styles.accentSoft}`}>
                <ListOrdered className="size-4" />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {content.stepsHeading}
              </h3>
            </div>
            <ol className="space-y-3">
              {content.steps.map((step, index) => (
                <li
                  key={step.id}
                  className={`rounded-2xl border-[3px] px-4 py-4 ${styles.border} bg-black/25`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${styles.chip}`}
                    >
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-white">{step.title.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                  <p className={`text-sm leading-relaxed ${styles.muted}`}>{step.description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className={`flex size-8 items-center justify-center rounded-lg ${styles.accentSoft}`}>
                <MessageCircleQuestion className="size-4" />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {content.faqHeading}
              </h3>
            </div>
            <div className={`overflow-hidden rounded-2xl border-[3px] ${styles.border}`}>
              {content.faqs.map((faq, i) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={i > 0 ? `border-t ${styles.border}` : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className={`flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition ${styles.faqBtn} ${
                        isOpen ? styles.faqOpen : ''
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold leading-snug text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`mt-0.5 size-4 shrink-0 text-zinc-500 transition ${
                          isOpen ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    </button>
                    {isOpen ? (
                      <div className={`border-t px-4 pb-4 pt-3 ${styles.border}`}>
                        <p className={`text-sm leading-relaxed ${styles.muted}`}>{faq.answer}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          {content.footerNote ? (
            <p className={`pb-4 text-center text-xs leading-relaxed ${styles.muted}`}>
              {content.footerNote}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
