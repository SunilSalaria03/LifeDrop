'use client';

import { HeartHandshake } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbBecomeDonor } from '@/components/layout/breadcrumb.presets';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BecomeDonorForm } from '@/features/donors/components/BecomeDonorForm';
import {
  profileCard,
  profileCardBody,
  profileCardHeader,
} from '@/app/profile/profile-card.styles';
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
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbBecomeDonor} />
        <HeroSection />
      </div>
      <main className="min-h-screen bg-neutral-50 px-4 pb-12 pt-10 text-neutral-950 sm:px-6 sm:pt-12 lg:px-8">
        <div className="relative mx-auto grid w-full max-w-7xl gap-6">
          <Card className={profileCard}>
            <CardContent className={profileCardBody}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-red-50 sm:h-24 sm:w-24">
                  <HeartHandshake className="h-9 w-9 text-red-700 sm:h-10 sm:w-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-red-700">
                    Become a LifeDrop donor
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                    Offer blood support in your area
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Add your blood group and availability so people nearby can
                    find you through LifeDrop&apos;s privacy-safe donor search.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      className="rounded-md border border-neutral-200 bg-neutral-50 font-medium text-neutral-700"
                      
                    >
                      Privacy-safe listing
                    </Badge>
                    {user?.phoneVerified ? (
                      <Badge
                        className="rounded-md border border-green-200 bg-green-50 font-medium text-green-800"
                        
                      >
                        Phone verified
                      </Badge>
                    ) : (
                      <Badge
                        className="rounded-md border border-amber-200 bg-amber-50 font-medium text-amber-800"
                        
                      >
                        Phone verification required
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.phoneVerified ? (
            <Card className={profileCard}>
              <CardHeader className={profileCardHeader}>
                <h2 className="text-lg font-bold text-neutral-950">
                  Complete your donor profile
                </h2>
                <p className="text-sm text-neutral-600">
                  Enter your donor and contact details below. Accurate
                  information helps patients reach you and keeps your listing
                  visible in search.
                </p>
              </CardHeader>
              <CardContent className={profileCardBody}>
                <BecomeDonorForm user={user} />
              </CardContent>
            </Card>
          ) : null}
        </div>
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
