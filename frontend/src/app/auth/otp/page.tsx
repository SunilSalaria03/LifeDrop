import Link from 'next/link';
import { AuthGuestGuard } from '@/features/auth/components/AuthGuestGuard';
import { PhoneOtpForm } from '@/features/auth/components/PhoneOtpForm';

export default function OtpPage() {
  return (
    <AuthGuestGuard>
      <main className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-950">
        <section className="mx-auto grid max-w-md gap-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="grid gap-2">
            <p className="text-sm font-medium uppercase text-red-700">Phone verification</p>
            <h1 className="text-2xl font-semibold">Enter OTP</h1>
            <p className="text-sm leading-6 text-neutral-600">Use the code sent to your phone to continue.</p>
          </div>

          <PhoneOtpForm mode="verify" />
          <Link className="text-sm font-medium text-red-700" href="/auth/login">
            Back to Login
          </Link>
        </section>
      </main>
    </AuthGuestGuard>
  );
}
