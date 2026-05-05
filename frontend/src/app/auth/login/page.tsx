import Link from 'next/link';
import { ArrowLeft, Droplet, ShieldCheck } from 'lucide-react';
import { AuthGuestGuard } from '@/features/auth/components/AuthGuestGuard';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { PhoneOtpForm } from '@/features/auth/components/PhoneOtpForm';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <AuthGuestGuard>
      <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#fff5f5_100%)] px-4 py-10 text-neutral-950 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md overflow-hidden rounded-2xl border-white/80 bg-white/95 shadow-2xl shadow-blue-950/10">
          <CardContent className="grid gap-7 p-6 sm:p-8">
            <div className="grid gap-5 text-center">
              <Link
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20"
                href="/"
              >
                <Droplet className="h-7 w-7" />
              </Link>
              <div className="grid gap-2">
                <p className="text-sm font-semibold uppercase text-red-600">
                  LifeDrop
                </p>
                <h1 className="text-3xl font-bold tracking-normal text-neutral-950">
                  Welcome back
                </h1>
                <p className="mx-auto max-w-sm text-sm leading-6 text-neutral-600">
                  Login to request blood or become a donor
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4">
              <PhoneOtpForm mode="send" />
            </div>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs font-semibold uppercase text-neutral-400">
                or continue with
              </span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>

            <GoogleLoginButton />

            <p className="flex items-start gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-left text-xs font-medium leading-5 text-blue-800 ring-1 ring-blue-100">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Your contact details stay private and are only shared through approved request flows.
            </p>

            <Link
              className="mx-auto inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-red-700"
              href="/"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </CardContent>
        </Card>
      </main>
    </AuthGuestGuard>
  );
}
