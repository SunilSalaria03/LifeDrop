import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-transparent backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="text-2xl font-bold tracking-normal text-blue-600" href="/">
          LifeDrop
        </Link>

        <nav className="flex items-center gap-2">
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
