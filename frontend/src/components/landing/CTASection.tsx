'use client';

import { useRouter } from 'next/navigation';
import { Clock3, Droplet, HeartHandshake, ShieldCheck, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userStorage } from '@/lib/auth/user-storage';

const ctaHighlights = [
  {
    label: 'Verified community',
    icon: ShieldCheck,
  },
  {
    label: 'Fast local search',
    icon: Clock3,
  },
  {
    label: 'Donors near you',
    icon: UsersRound,
  },
];

export function CTASection() {
  const router = useRouter();

  const handleBecomeDonor = () => {
    const user = userStorage.getUser();

    if (!user) {
      window.dispatchEvent(new CustomEvent('lifedrop:open-auth-modal'));
      return;
    }

    if (user?.role === 'donor') {
      router.push('/profile');
      return;
    }

    if (!user?.phoneVerified) {
      window.dispatchEvent(
        new CustomEvent('lifedrop:open-auth-modal', {
          detail: { phone: user?.phone ?? '', redirect: '/become-donor' },
        }),
      );
      return;
    }

    router.push('/become-donor');
  };

  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#7f1d1d_0%,#dc2626_48%,#881337_100%)] p-2 shadow-[0_34px_90px_rgba(127,29,29,0.24)]">
        <div className="relative overflow-hidden rounded-[1.55rem] border border-white/15 bg-white/[0.06] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-red-950/35 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.12)_0_1px,transparent_1px_32px)] opacity-20" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:items-center">
            <div className="mx-auto grid max-w-2xl gap-6 text-center lg:mx-0 lg:text-left">
              <p className="mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-wider text-red-50 shadow-sm backdrop-blur-sm lg:mx-0">
                Join the network
              </p>
              <div className="grid gap-4">
                <h2 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
                  Ready to Save Lives?
                </h2>
                <p className="max-w-xl text-base font-semibold leading-7 text-red-50/90 sm:text-lg">
                  Join LifeDrop as a donor or start an urgent request when someone
                  needs blood nearby.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row lg:justify-start">
                <Button
                  className="h-[3.25rem] w-full rounded-full bg-white px-8 font-black text-red-700 shadow-xl shadow-red-950/20 hover:bg-red-50 sm:w-auto"
                  onClick={handleBecomeDonor}
                  type="button"
                >
                  <HeartHandshake className="h-5 w-5" />
                  Join as a Donor
                </Button>
                <Button
                  className="h-[3.25rem] w-full rounded-full border border-white/30 bg-white/10 px-8 font-black text-white shadow-xl shadow-red-950/10 hover:bg-white/20 sm:w-auto"
                  // onClick={() => router.push('/request-blood')}
                  type="button"
                >
                  <Droplet className="h-5 w-5" />
                  Request Blood
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {ctaHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg shadow-red-950/10 backdrop-blur-sm"
                    key={item.label}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-red-700 shadow-lg shadow-red-950/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-black uppercase tracking-normal text-red-50">
                      {item.label}
                    </span>
                  </div>
                );
              })}

              <div className="mt-1 rounded-2xl border border-white/15 bg-red-950/25 p-4 text-sm font-semibold leading-6 text-red-50/85">
                Built for moments where a clear next step matters more than a long
                search.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
