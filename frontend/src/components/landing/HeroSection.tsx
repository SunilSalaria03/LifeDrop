'use client';

import { useRouter } from 'next/navigation';
import { Droplet, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#eef6ff_0%,#ffffff_45%,#fff2f0_100%)]">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.20),transparent_62%)]" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(231,76,60,0.12),transparent_60%)]" />
      <div className="relative mx-auto grid min-h-[700px] max-w-7xl place-items-center px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-28">
        <div className="grid w-full gap-10">
          <div className="mx-auto grid max-w-5xl gap-6">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-950/5">
              <HeartPulse className="h-4 w-4" />
              Emergency blood help, closer to home
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-normal text-neutral-950 sm:text-6xl lg:text-7xl">
              Find Blood Donors Near You. Save Lives Faster.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">
              Connect with nearby donors or request blood instantly in emergency situations.
            </p>
          </div>

          <SearchBar />

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              className="h-13 rounded-full bg-[#E74C3C] px-8 text-base text-white shadow-lg shadow-red-500/20 hover:bg-red-600"
              onClick={() => router.push('/request-blood')}
              type="button"
            >
              <Droplet className="h-5 w-5" />
              Request Blood
            </Button>
            <Button
              className="h-13 rounded-full border-green-200 bg-[#27AE60] px-8 text-base text-white shadow-lg shadow-green-600/20 hover:bg-green-700"
              onClick={() => router.push('/become-donor')}
              type="button"
              variant="outline"
            >
              <HeartPulse className="h-5 w-5" />
              Become a Donor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
