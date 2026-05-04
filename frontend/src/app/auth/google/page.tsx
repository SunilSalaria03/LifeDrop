import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';

export default function GoogleAuthPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-950">
      <section className="mx-auto grid max-w-md gap-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="grid gap-2">
          <p className="text-sm font-medium uppercase text-red-700">Google auth</p>
          <h1 className="text-2xl font-semibold">Continue with Google</h1>
        </div>
        <GoogleLoginButton />
      </section>
    </main>
  );
}

