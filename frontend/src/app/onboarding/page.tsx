import { AuthProtectedGuard } from '@/features/auth/components/AuthProtectedGuard';
import { Header } from '@/components/layout/Header';
import { BannerBreadcrumbStrip } from '@/components/layout/BannerBreadcrumbStrip';
import { breadcrumbOnboarding } from '@/components/layout/breadcrumb.presets';
import { PageHero } from '@/components/landing/PageHero';

export default function OnboardingPage() {
  return (
    <AuthProtectedGuard>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbOnboarding} />
        <PageHero />
      </div>
      <main className="min-h-screen bg-neutral-50 px-4 pb-12 pt-8 text-neutral-950 sm:px-6 sm:pt-10 lg:px-8">
        <section className="mx-auto grid max-w-2xl gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8">
          <p className="text-sm font-medium uppercase text-red-700">LifeDrop onboarding</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Complete your profile</h1>
          <p className="text-neutral-700">Profile onboarding fields will be added in the next MVP phase.</p>
        </section>
      </main>
    </AuthProtectedGuard>
  );
}
