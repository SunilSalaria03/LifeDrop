import { AuthGuestGuard } from '@/features/auth/components/AuthGuestGuard';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';

export default function GoogleAuthPage() {
  return (
    <AuthGuestGuard>
      <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#fff5f5_100%)] px-4 py-8 text-neutral-950 sm:px-6 sm:py-10 lg:px-8">
        <section className="mx-auto grid w-full max-w-md gap-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8">
          <div className="grid gap-2">
            <p className="text-sm font-medium uppercase text-red-700">Google auth</p>
            <h1 className="text-2xl font-bold sm:text-3xl">Continue with Google</h1>
          </div>
          <GoogleLoginButton />
        </section>
      </main>
    </AuthGuestGuard>
  );
}
