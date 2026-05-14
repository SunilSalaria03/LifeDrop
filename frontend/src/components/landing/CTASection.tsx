'use client';

import { useRouter } from 'next/navigation';
import { Droplet, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userStorage } from '@/lib/auth/user-storage';

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
      <div className="mx-auto max-w-7xl overflow-hidden rounded-4xl bg-[linear-gradient(135deg,#7f1d1d_0%,#b91c1c_45%,#991b1b_100%)] shadow-2xl shadow-red-950/30">
        {/* Decorative glows inside the card */}
        <div className="relative p-2">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-red-950/40 blur-2xl" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <div className="grid place-items-center rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-14 text-center text-white sm:px-10 sm:py-16 lg:py-20">
            <div className="relative grid max-w-3xl gap-6">
              <p className="mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-red-100">
                Join the network
              </p>
              <h2 className="text-3xl font-bold tracking-normal sm:text-4xl lg:text-5xl">
                Ready to Save Lives?
              </h2>
              <p className="mx-auto max-w-2xl text-base font-medium leading-7 text-red-100 sm:text-lg">
                Join LifeDrop today as a donor or request blood when you need help.
              </p>
              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <Button
                  className="h-12 w-full rounded-full bg-white px-8 font-semibold text-red-700 shadow-lg shadow-red-950/20 hover:bg-red-50 sm:w-auto"
                  onClick={handleBecomeDonor}
                  type="button"
                >
                  <HeartHandshake className="h-5 w-5" />
                  Become a Donor
                </Button>
                <Button
                  className="h-12 w-full rounded-full border border-white/30 bg-white/10 px-8 font-semibold text-white shadow-lg shadow-red-950/10 hover:bg-white/20 sm:w-auto"
                  // onClick={() => router.push('/request-blood')}
                  type="button"
                >
                  <Droplet className="h-5 w-5" />
                  Request Blood
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
