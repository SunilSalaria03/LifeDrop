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
const impactHighlights = ['Live community growth', 'Urgent-ready network'];

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
      className="relative overflow-hidden bg-[linear-gradient(135deg,#7f1d1d_0%,#dc2626_48%,#881337_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      id="lifedrop-impact"
      ref={sectionRef}
    >
      <div className="pointer-events-none absolute -left-12 -top-20 h-44 w-44 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -left-8 -top-14 h-32 w-32 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_86%_70%,rgba(69,10,10,0.38),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_36px)] opacity-25" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className="mx-auto grid max-w-md gap-6 text-center lg:mx-0 lg:text-left">
          <p className="mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-wider text-red-50 shadow-[0_10px_24px_rgba(69,10,10,0.18)] backdrop-blur-sm lg:mx-0">
            LifeDrop impact
          </p>
          <div className="grid gap-4">
            <h2 className="text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl">
              Our Success Is Defined By The Impact We Create.
            </h2>
            <p className="text-sm font-semibold leading-6 text-red-50/85">
              Every request, donor, and city covered helps LifeDrop make blood support
              easier to find when people need it most.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {impactHighlights.map((highlight) => (
              <span
                className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-normal text-red-50 shadow-sm backdrop-blur-sm"
                key={highlight}
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-24 -translate-x-1/2 bg-white/20 sm:block" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-24 w-px -translate-y-1/2 bg-white/20 sm:block" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-[4.6rem] w-[4.6rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.35rem] border border-white/20 bg-red-950/30 shadow-[0_18px_34px_rgba(69,10,10,0.28)] backdrop-blur-sm sm:grid">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ArrowDownRight,
                ArrowDownLeft,
                ArrowUpRight,
                ArrowUpLeft,
              ].map((ConnectorIcon, connectorIndex) => (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white text-red-700/45 shadow-[0_6px_14px_rgba(69,10,10,0.16)]"
                  key={connectorIndex}
                >
                  <ConnectorIcon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </div>

          {landingStats.map((stat, index) => {
            const Icon = stat.icon;
            const countValue = animatedValues[index] ?? 0;

            return (
              <Card
                className="group min-h-32 overflow-hidden rounded-[1.4rem] border border-red-100/80 bg-white/95 shadow-[0_22px_45px_rgba(127,29,29,0.1)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_26px_55px_rgba(127,29,29,0.16)] sm:min-h-48"
                key={stat.label}
              >
                <CardContent className="relative flex h-full min-h-32 flex-col items-center justify-center gap-3 p-6 text-center sm:min-h-48 sm:p-8">
                  <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 opacity-80 ring-1 ring-red-100 transition duration-300 group-hover:bg-red-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-50 opacity-70 transition duration-300 group-hover:scale-110 group-hover:bg-red-100" />
                  <div className="relative grid gap-3">
                    <p className="text-4xl font-black leading-none tracking-normal text-red-700 sm:text-5xl">
                      {formatStatValue(countValue)}
                      <span className="text-2xl align-top font-black">+</span>
                    </p>
                    <p className="text-[0.65rem] font-black uppercase tracking-normal text-red-950/70 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
