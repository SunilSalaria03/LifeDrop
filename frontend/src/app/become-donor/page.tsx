'use client';

import { HeartHandshake } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BecomeDonorForm } from '@/features/donors/components/BecomeDonorForm';

export default function BecomeDonorPage() {
  const { meQuery } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const user = meQuery.data;

  useEffect(() => {
    if (user && !user.phoneVerified) {
      setIsAuthModalOpen(true);
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#fff5f5_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Card className="mx-auto w-full max-w-5xl rounded-2xl border-white/80 bg-white/95 shadow-2xl shadow-red-950/10">
          <CardContent className="grid gap-6 p-5 sm:gap-7 sm:p-8">
            <div className="grid gap-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-red-600">
                  Become a donor
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-normal text-neutral-950 sm:text-3xl">
                  Share your donor availability
                </h1>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Your donor profile is saved in LifeDrop and shown only through privacy-safe donor search.
                </p>
              </div>
            </div>

            {user?.phoneVerified ? <BecomeDonorForm user={user} /> : null}
          </CardContent>
        </Card>
      </main>
      <AuthModal
        initialPhone={user?.phone}
        isOpen={isAuthModalOpen}
        onAuthenticated={() => setIsAuthModalOpen(false)}
        onClose={() => setIsAuthModalOpen(false)}
        profileRedirect="/become-donor"
        profileUser={user && !user.phoneVerified ? user : undefined}
      />
    </ProtectedRoute>
  );
}
