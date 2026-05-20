"use client";

import { HeartPulse } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { landingStats } from './landing.constants';

const animationDuration = 1400;

function getStatNumber(value: string) {
  return Number(value.replace(/[^\d]/g, ''));
}

function formatStatValue(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

const targetValues = landingStats.map((stat) => getStatNumber(stat.value));
const impactHighlights = [
  'Verified-first community',
  'Urgent-ready reach across cities',
  'Search by blood group and city',
  'Built for urgent coordination',
  'Coverage that grows with every signup',
];

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

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
        <div className="mx-auto grid max-w-lg gap-6 text-center lg:mx-0 lg:max-w-none lg:text-left">
          <p className="mx-auto inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-50 shadow-[0_10px_24px_rgba(69,10,10,0.18)] backdrop-blur-sm sm:px-4 sm:tracking-[0.14em] lg:mx-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
              <HeartPulse className="h-4 w-4" aria-hidden />
            </span>
            LifeDrop impact
          </p>
          <div className="grid gap-4">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Faster connections when blood is needed urgently
            </h2>
            <p className="text-sm font-normal leading-7 text-red-50/80 sm:text-[15px] sm:leading-7">
              Every verified donor and completed request expands coverage in more
              cities—so families and coordinators spend less time searching and more
              time acting.
            </p>
          </div>
          <ul
            className="mx-auto w-full max-w-md list-none divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md sm:max-w-lg lg:mx-0 lg:max-w-none"
            role="list"
          >
            {impactHighlights.map((highlight) => (
              <li className="flex gap-3.5 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5" key={highlight}>
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/15"
                  aria-hidden
                >
                  <HeartPulse className="h-3 w-3 opacity-95" strokeWidth={2.25} />
                </span>
                <span className="min-w-0 text-left text-sm font-medium leading-relaxed text-white/90 sm:text-[14px]">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          <ul
            className="list-none divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-md"
            role="list"
          >
            {landingStats.map((stat, index) => {
              const Icon = stat.icon;
              const countValue = animatedValues[index] ?? 0;

              return (
                <li
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors duration-200 hover:bg-white/[0.06] sm:gap-4 sm:px-5 sm:py-4"
                  key={stat.label}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-md shadow-red-950/35">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-[14px] font-semibold capitalize leading-snug text-red-50/95">
                    {stat.label}
                  </span>
                  <span className="flex shrink-0 justify-end">
                    <span className="inline-flex min-w-[6.25rem] items-baseline justify-end gap-0.5 rounded-lg border border-white/25 bg-gradient-to-br from-white/20 to-white/[0.07] px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_24px_rgba(0,0,0,0.12)] sm:min-w-[7rem] sm:px-3 sm:py-1.5">
                      <span className="text-2xl font-black tabular-nums tracking-tight text-white sm:text-3xl">
                        {formatStatValue(countValue)}
                      </span>
                      <span className="translate-y-px text-base font-black leading-none text-red-100/90 sm:text-lg">
                        +
                      </span>
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
