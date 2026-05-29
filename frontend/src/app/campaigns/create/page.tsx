import type { Metadata } from 'next';
import { Megaphone } from 'lucide-react';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbCreateCampaign } from '@/components/layout/breadcrumb.presets';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { profileCard, profileCardBody } from '@/app/profile/profile-card.styles';
import { CreateCampaignForm } from '@/features/campaigns/components/CreateCampaignForm';

export const metadata: Metadata = {
  title: 'Create a Campaign | LifeDrop',
  description:
    'List a blood donation drive or camp on LifeDrop so donors can find and join your campaign.',
};

export default function CreateCampaignPage() {
  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbCreateCampaign} />
        <HeroSection />
      </div>
      <main className="min-h-screen bg-neutral-50 px-4 pb-12 pt-10 text-neutral-950 sm:px-6 sm:pt-12 lg:px-8">
        <div className="relative mx-auto grid w-full max-w-7xl gap-6">
          <Card className={profileCard}>
            <CardContent className={profileCardBody}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-red-50 sm:h-24 sm:w-24">
                  <Megaphone className="h-9 w-9 text-red-700 sm:h-10 sm:w-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-red-700">
                    Create a LifeDrop campaign
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                    Organize a blood drive in your area
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Share campaign details clearly so donors can discover, register, and
                    participate in your drive.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="rounded-md border border-neutral-200 bg-neutral-50 font-medium text-neutral-700">
                      Public campaign listing
                    </Badge>
                    <Badge className="rounded-md border border-green-200 bg-green-50 font-medium text-green-800">
                      Owner-managed updates
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <CreateCampaignForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
