'use client';

import { useRouter } from 'next/navigation';
import { Droplet, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const router = useRouter();

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl place-items-center rounded-2xl bg-[linear-gradient(135deg,#b91c1c_0%,#ef4444_60%,#991b1b_100%)] px-5 py-12 text-center text-white shadow-2xl shadow-red-950/20 sm:px-10 sm:py-14 lg:py-20">
        <div className="grid max-w-3xl gap-5">
          <h2 className="text-3xl font-bold tracking-normal sm:text-4xl lg:text-5xl">
            Ready to Save Lives?
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-red-50 sm:text-lg">
            Join LifeDrop today as a donor or request blood when you need help.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              className="h-12 w-full rounded-full bg-white px-6 text-red-700 hover:bg-red-50 sm:w-auto"
              onClick={() => router.push('/become-donor')}
              type="button"
            >
              <HeartHandshake className="h-5 w-5" />
              Become a Donor
            </Button>
            <Button
              className="h-12 w-full rounded-full border border-white/50 bg-white/10 px-6 text-white hover:bg-white/20 sm:w-auto"
              onClick={() => router.push('/request-blood')}
              type="button"
            >
              <Droplet className="h-5 w-5" />
              Request Blood
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
