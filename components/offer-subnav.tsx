'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BadgeCheck, CalendarDays, Trophy } from 'lucide-react';

const tabs = [
  { id: 'membresias', label: 'Membresías', icon: BadgeCheck },
  { id: 'clases', label: 'Clases', icon: CalendarDays },
  { id: 'retos', label: 'Retos', icon: Trophy },
] as const;

export function OfferSubnav() {
  const [active, setActive] = useState<string>('membresias');

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0.15, 0.35, 0.55] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Secciones de planes"
      className="sticky top-20 z-40 border-b-[3px] border-brand/25 bg-black/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-5 py-3 sm:px-8">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <Link
              key={id}
              href={`#${id}`}
              onClick={() => setActive(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                isActive
                  ? 'bg-brand text-black'
                  : 'border border-white/15 text-zinc-400 hover:border-brand/50 hover:text-white'
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
