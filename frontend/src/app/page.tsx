import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-neutral-950">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-red-700">LifeDrop MVP</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Emergency blood help, organized faster.</h1>
        </div>
        <p className="max-w-2xl text-base leading-7 text-neutral-700">
          LifeDrop connects blood requesters, donors, nearby search, and notification-ready workflows in one focused platform.
        </p>
        <div>
          <Button asChild>
            <Link href="/auth/login">Start with auth</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

