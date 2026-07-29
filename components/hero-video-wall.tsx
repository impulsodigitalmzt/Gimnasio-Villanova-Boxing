'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { brandAssets } from '@/lib/media';

const CROSSFADE_MS = 1100;
const INTRO_HOLD_MS = 10_000;

type Step = 'open' | 'hero' | 'intro';

const STEPS: Step[] = ['open', 'hero', 'intro'];

/**
 * Ciclo del hero:
 * 1) b-roll a pantalla completa + logo dorado centrado encima
 * 2) hero.mp4
 * 3) villanova_boxing_intro.mp4
 * → se repite
 */
export function HeroVideoWall() {
  const [step, setStep] = useState<Step>('open');
  const openRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLVideoElement | null>(null);
  const introRef = useRef<HTMLVideoElement | null>(null);
  const advancing = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const playSafe = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.muted = true;
    const attempt = el.play();
    if (attempt) attempt.catch(() => {});
  }, []);

  const goNext = useCallback(() => {
    if (advancing.current) return;
    advancing.current = true;
    setStep((current) => {
      const index = STEPS.indexOf(current);
      return STEPS[(index + 1) % STEPS.length];
    });
    schedule(() => {
      advancing.current = false;
    }, CROSSFADE_MS);
  }, [schedule]);

  useEffect(() => {
    clearTimers();
    advancing.current = false;

    if (step === 'open') {
      const el = openRef.current;
      if (el) {
        el.currentTime = 0;
        playSafe(el);
      }
      heroRef.current?.pause();
      introRef.current?.pause();
      return;
    }

    if (step === 'hero') {
      const el = heroRef.current;
      if (el) {
        el.currentTime = 0;
        playSafe(el);
      }
      openRef.current?.pause();
      introRef.current?.pause();
      return;
    }

    const el = introRef.current;
    if (el) {
      el.currentTime = 0;
      playSafe(el);
    }
    openRef.current?.pause();
    heroRef.current?.pause();
    schedule(goNext, INTRO_HOLD_MS);
  }, [step, playSafe, schedule, goNext, clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    const open = openRef.current;
    const hero = heroRef.current;
    if (!open || !hero) return;

    const nearEnd = (video: HTMLVideoElement) => {
      if (!video.duration || Number.isNaN(video.duration)) return false;
      return video.duration - video.currentTime <= 1.05;
    };

    const onOpenTime = () => {
      if (step === 'open' && nearEnd(open)) goNext();
    };
    const onOpenEnded = () => {
      if (step === 'open') goNext();
    };
    const onHeroTime = () => {
      if (step === 'hero' && nearEnd(hero)) goNext();
    };
    const onHeroEnded = () => {
      if (step === 'hero') goNext();
    };

    open.addEventListener('timeupdate', onOpenTime);
    open.addEventListener('ended', onOpenEnded);
    hero.addEventListener('timeupdate', onHeroTime);
    hero.addEventListener('ended', onHeroEnded);

    return () => {
      open.removeEventListener('timeupdate', onOpenTime);
      open.removeEventListener('ended', onOpenEnded);
      hero.removeEventListener('timeupdate', onHeroTime);
      hero.removeEventListener('ended', onHeroEnded);
    };
  }, [step, goNext]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      {/* 1) B-roll a todo el ancho + logo encima al centro */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1100ms] ease-in-out ${
          step === 'open' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <video
          ref={openRef}
          src={brandAssets.heroOpenVideo}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brandAssets.heroLogoMark}
          alt=""
          className="absolute left-1/2 top-1/2 z-10 w-[min(72vw,420px)] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)] sm:w-[min(48vw,460px)]"
        />
      </div>

      {/* 2) hero.mp4 */}
      <video
        ref={heroRef}
        src={brandAssets.heroVideo}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 size-full object-contain transition-opacity duration-[1100ms] ease-in-out ${
          step === 'hero' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* 3) intro logo video */}
      <video
        ref={introRef}
        src={brandAssets.introLogoVideo}
        muted
        playsInline
        loop
        preload="auto"
        className={`absolute inset-0 size-full object-contain p-4 transition-opacity duration-[1100ms] ease-in-out sm:p-8 ${
          step === 'intro' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
    </div>
  );
}
