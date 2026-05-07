'use client';

import { useRouter } from 'next/navigation';
import { Droplet, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tokenStorage } from '@/lib/auth/token-storage';
import { userStorage } from '@/lib/auth/user-storage';

export function CTASection() {
  const router = useRouter();

  const handleBecomeDonor = () => {
    const user = userStorage.getUser();

    if (!tokenStorage.getAccessToken()) {
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
    <section className="bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_48%,#fff4f4_100%)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-red-100/70 bg-[linear-gradient(135deg,#9f1239_0%,#dc2626_48%,#7f1d1d_100%)] p-2 shadow-2xl shadow-red-950/20">
        <div className="grid place-items-center rounded-[1.6rem] border border-white/15 bg-white/5 px-5 py-12 text-center text-white sm:px-10 sm:py-14 lg:py-20">
          <div className="grid max-w-3xl gap-5">
            <p className="mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase text-red-50 shadow-sm shadow-red-950/10">
              Join the network
            </p>
            <h2 className="text-3xl font-bold tracking-normal sm:text-4xl lg:text-5xl">
            Ready to Save Lives?
            </h2>
            <p className="mx-auto max-w-2xl text-base font-medium leading-7 text-red-50 sm:text-lg">
              Join LifeDrop today as a donor or request blood when you need help.
            </p>
            <div className="flex flex-col justify-center gap-3 pt-1 sm:flex-row">
              <Button
                className="h-12 w-full rounded-full bg-white px-6 font-semibold text-red-700 shadow-lg shadow-red-950/15 hover:bg-red-50 sm:w-auto"
                onClick={handleBecomeDonor}
                type="button"
              >
                <HeartHandshake className="h-5 w-5" />
                Become a Donor
              </Button>
              <Button
                className="h-12 w-full rounded-full border border-white/35 bg-white/10 px-6 font-semibold text-white shadow-lg shadow-red-950/10 hover:bg-white/20 sm:w-auto"
                onClick={() => router.push('/request-blood')}
                type="button"
              >
                <Droplet className="h-5 w-5" />
                Request Blood
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
