import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LocationSelector } from '@/components/landing/LocationSelector';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-transparent backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="text-2xl font-bold tracking-normal text-blue-600" href="/">
          LifeDrop
        </Link>

        <nav className="flex items-center gap-2">
          <LocationSelector />
          <Button asChild className="h-10 rounded-full px-5 text-blue-700 hover:bg-blue-50" variant="ghost">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild className="h-10 rounded-full bg-blue-600 px-5 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700">
            <Link href="/auth/login">Join</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
