"use client";

import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowUpRight,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { landingStats } from './landing.constants';

const animationDuration = 1400;

function getStatNumber(value: string) {
  return Number(value.replace(/[^\d]/g, ''));
}

function formatStatValue(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

const targetValues = landingStats.map((stat) => getStatNumber(stat.value));

export function StatsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [animatedValues, setAnimatedValues] = useState(targetValues);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const startCountingWhenVisible = () => {
      const rect = section.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.82;
      const isVisible = rect.top < triggerPoint && rect.bottom > 0;

      if (isVisible) {
        setHasEnteredView(true);
      }
    };

    setAnimatedValues(landingStats.map(() => 0));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
        }
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.1 },
    );

    observer.observe(section);
    startCountingWhenVisible();
    window.addEventListener('scroll', startCountingWhenVisible, { passive: true });
    window.addEventListener('resize', startCountingWhenVisible);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', startCountingWhenVisible);
      window.removeEventListener('resize', startCountingWhenVisible);
    };
  }, []);

  useEffect(() => {
    if (!hasEnteredView) {
      return;
    }

    let animationFrame = 0;
    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / animationDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues(
        targetValues.map((target) => Math.round(target * easedProgress)),
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateCount);
      }
    };

    animationFrame = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasEnteredView]);

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(135deg,#fff1f2_0%,#fee2e2_42%,#f8fafc_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      id="lifedrop-impact"
      ref={sectionRef}
    >
      <div className="pointer-events-none absolute -left-12 -top-20 h-44 w-44 rounded-full border border-red-900/5" />
      <div className="pointer-events-none absolute -left-8 -top-14 h-32 w-32 rounded-full border border-red-900/5" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_86%_70%,rgba(185,28,28,0.1),transparent_32%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className="mx-auto grid max-w-md gap-5 text-center lg:mx-0 lg:text-left">
          <p className="mx-auto w-fit rounded-full border border-red-200 bg-white/70 px-4 py-2 text-sm font-black uppercase tracking-wider text-red-700 shadow-sm lg:mx-0">
            LifeDrop impact
          </p>
          <div className="grid gap-4">
            <h2 className="text-3xl font-black leading-tight tracking-normal text-red-950 sm:text-4xl">
              Our Success Is Defined By The Impact We Create.
            </h2>
            <p className="text-sm font-semibold leading-6 text-red-950/70">
              Every request, donor, and city covered helps LifeDrop make blood support
              easier to find when people need it most.
            </p>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-[4.6rem] w-[4.6rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.35rem] bg-[#fee2e2] sm:grid">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ArrowDownRight,
                ArrowDownLeft,
                ArrowUpRight,
                ArrowUpLeft,
              ].map((ConnectorIcon, connectorIndex) => (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-red-100 bg-white text-red-700/30 shadow-[0_6px_14px_rgba(127,29,29,0.08)]"
                  key={connectorIndex}
                >
                  <ConnectorIcon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </div>

          {landingStats.map((stat, index) => {
            const countValue = animatedValues[index] ?? 0;

            return (
              <Card
                className="group min-h-32 overflow-hidden rounded-[1.4rem] border border-red-100 bg-white shadow-[0_22px_45px_rgba(127,29,29,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_55px_rgba(127,29,29,0.16)] sm:min-h-48"
                key={stat.label}
              >
                <CardContent className="flex h-full min-h-32 flex-col items-center justify-center gap-3 p-6 text-center sm:min-h-48 sm:p-8">
                  <p className="text-4xl font-black leading-none tracking-normal text-red-700 sm:text-5xl">
                    {formatStatValue(countValue)}
                    <span className="text-2xl align-top font-black">+</span>
                  </p>
                  <p className="text-[0.65rem] font-black uppercase tracking-normal text-red-950/70 sm:text-xs">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
