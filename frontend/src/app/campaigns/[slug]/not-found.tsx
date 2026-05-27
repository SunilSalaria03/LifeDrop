import Link from 'next/link';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbCampaigns } from '@/components/layout/breadcrumb.presets';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/landing/PageHero';

export default function CampaignNotFoundPage() {
  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbCampaigns} />
        <PageHero />
      </div>
      <main className="bg-neutral-50 px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-lg rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
            <h1 className="text-2xl font-bold text-neutral-950">Campaign not found</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              This campaign may have been removed or the link is incorrect.
            </p>
            <Button
              asChild
              className="mt-8 h-11 rounded-full bg-red-700 hover:bg-red-800"
            >
              <Link href="/campaigns">Back to campaigns</Link>
            </Button>
          </div>
      </main>
      <Footer />
    </>
  );
}
