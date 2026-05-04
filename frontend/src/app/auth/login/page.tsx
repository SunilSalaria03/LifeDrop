import Link from 'next/link';
import { AuthGuestGuard } from '@/features/auth/components/AuthGuestGuard';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { PhoneOtpForm } from '@/features/auth/components/PhoneOtpForm';

export default function LoginPage() {
  return (
    <AuthGuestGuard>
      <main className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-950">
        <section className="mx-auto grid max-w-md gap-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="grid gap-2">
            <p className="text-sm font-medium uppercase text-red-700">LifeDrop Auth</p>
            <h1 className="text-2xl font-semibold">Login or sign up</h1>
            <p className="text-sm leading-6 text-neutral-600">Use phone OTP or Google. No password needed.</p>
          </div>

          <PhoneOtpForm mode="send" />

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs font-medium uppercase text-neutral-500">or</span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <GoogleLoginButton />

          <Link className="text-sm font-medium text-red-700" href="/">
            Back to home
          </Link>
        </section>
      </main>
    </AuthGuestGuard>
  );
}
