import { AuthProtectedGuard } from '@/features/auth/components/AuthProtectedGuard';

export default function OnboardingPage() {
  return (
    <AuthProtectedGuard>
      <main className="min-h-screen bg-white px-4 py-8 text-neutral-950 sm:px-6 sm:py-10 lg:px-8">
        <section className="mx-auto grid max-w-2xl gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm shadow-neutral-950/5 sm:p-8">
          <p className="text-sm font-medium uppercase text-red-700">LifeDrop onboarding</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Complete your profile</h1>
          <p className="text-neutral-700">Profile onboarding fields will be added in the next MVP phase.</p>
        </section>
      </main>
    </AuthProtectedGuard>
  );
}
