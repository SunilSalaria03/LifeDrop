import { AuthProtectedGuard } from '@/features/auth/components/AuthProtectedGuard';

export default function OnboardingPage() {
  return (
    <AuthProtectedGuard>
      <main className="min-h-screen bg-white px-6 py-10 text-neutral-950">
        <section className="mx-auto grid max-w-2xl gap-4">
          <p className="text-sm font-medium uppercase text-red-700">LifeDrop onboarding</p>
          <h1 className="text-3xl font-semibold">Complete your profile</h1>
          <p className="text-neutral-700">Profile onboarding fields will be added in the next MVP phase.</p>
        </section>
      </main>
    </AuthProtectedGuard>
  );
}
