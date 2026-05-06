'use client';

import { Droplet } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PhoneVerificationForm } from '@/features/profile/components/PhoneVerificationForm';
import { ProfileSetupForm } from '@/features/profile/components/ProfileSetupForm';

export default function ProfileSetupPage() {
  const { meQuery } = useAuth();
  const user = meQuery.data;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#fff5f5_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Card className="mx-auto w-full max-w-2xl rounded-2xl border-white/80 bg-white/95 shadow-2xl shadow-red-950/10">
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
