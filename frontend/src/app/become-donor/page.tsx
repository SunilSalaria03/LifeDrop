'use client';

import { HeartHandshake } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BecomeDonorForm } from '@/features/donors/components/BecomeDonorForm';
import { HeroSection } from '../../components/landing/HeroSection';

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
      <Header />
      <div className="bg-slate-900 pt-16 text-neutral-950 sm:pt-18">
      <HeroSection />
      </div>
      <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_48%,#fff7f7_100%)] px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-32 lg:px-8">
        <Card className="mx-auto w-full max-w-5xl rounded-3xl border border-red-100 bg-white shadow-sm shadow-neutral-950/5">
          <CardContent className="grid gap-6 p-5 sm:gap-7 sm:p-8">
            <div className="grid gap-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm shadow-red-950/10 ring-4 ring-red-50">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-600">
                  Join as a Donor
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
