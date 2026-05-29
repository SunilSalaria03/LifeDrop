'use client';

import { Droplet } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbProfileSetup } from '@/components/layout/breadcrumb.presets';
import { PageHero } from '@/components/landing/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PhoneVerificationForm } from '@/features/profile/components/PhoneVerificationForm';
import { ProfileSetupForm } from '@/features/profile/components/ProfileSetupForm';

export default function ProfileSetupPage() {
  const { meQuery } = useAuth();
  const user = meQuery.data;

  return (
    <ProtectedRoute>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbProfileSetup} />
        <PageHero />
      </div>
      <main className="min-h-screen bg-neutral-50 px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <Card className="mx-auto w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white">
          <CardContent className="grid gap-6 p-5 sm:gap-7 sm:p-8">
            <div className="grid gap-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
                <Droplet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-red-600">
                  Profile setup
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-normal text-neutral-950 sm:text-3xl">
                  Complete your LifeDrop profile
                </h1>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Add your verified phone and location so requests can be handled safely.
                </p>
              </div>
            </div>

            {user && !user.phoneVerified ? (
              <PhoneVerificationForm user={user} />
            ) : null}

            {user?.phoneVerified ? <ProfileSetupForm user={user} /> : null}
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
  );
}
