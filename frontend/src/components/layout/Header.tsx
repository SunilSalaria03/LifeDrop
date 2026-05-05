'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LocationSelector } from '@/components/location/LocationSelector';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AuthUser } from '@/features/auth/types/auth.types';
import { userStorage } from '@/lib/auth/user-storage';

function getInitials(name?: string, phone?: string, email?: string) {
  const displayValue = name?.trim() || email?.trim() || phone?.trim() || 'LD';

  return displayValue
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getDisplayName(name?: string, phone?: string, email?: string) {
  return name?.trim() || phone?.trim() || email?.trim() || 'LifeDrop User';
}

export function Header() {
  const { logoutMutation, meQuery } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storedUser, setStoredUser] = useState<AuthUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = meQuery.data ?? storedUser;
  const shouldShowBecomeDonor = user?.role !== 'donor';

  useEffect(() => {
    setStoredUser(userStorage.getUser());
  }, []);

  useEffect(() => {
    if (meQuery.data) {
      setStoredUser(meQuery.data);
    }
  }, [meQuery.data]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    setStoredUser(null);
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-transparent backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="text-2xl font-bold tracking-normal text-blue-600" href="/">
          LifeDrop
        </Link>

        <nav className="flex items-center gap-2">
          <LocationSelector />
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                aria-expanded={isMenuOpen}
                aria-label="Open account menu"
                className="flex h-10 items-center gap-2 rounded-full border border-white/70 bg-white/85 px-1.5 pr-3 text-sm font-semibold text-neutral-700 shadow-sm shadow-blue-950/5 transition hover:bg-white"
                onClick={() => setIsMenuOpen((current) => !current)}
                type="button"
              >
                <Avatar className="h-8 w-8 border border-blue-100 bg-blue-50">
                  {user.profileImage ? (
                    <AvatarImage
                      alt={getDisplayName(user.name, user.phone, user.email)}
                      src={user.profileImage}
                    />
                  ) : null}
                  <AvatarFallback className="bg-blue-50 text-xs text-blue-700">
                    {getInitials(user.name, user.phone, user.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-28 truncate sm:inline">
                  {getDisplayName(user.name, user.phone, user.email)}
                </span>
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 mt-3 grid w-56 gap-1 rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl shadow-blue-950/10">
                  <div className="border-b border-neutral-100 px-3 py-2">
                    <p className="truncate text-sm font-bold text-neutral-950">
                      {getDisplayName(user.name, user.phone, user.email)}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {user.email ?? user.phone ?? user.role}
                    </p>
                  </div>
                  <Link
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-blue-50 hover:text-blue-700"
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                    disabled={logoutMutation.isPending}
                    onClick={handleLogout}
                    type="button"
                  >
                    <LogOut className="h-4 w-4" />
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Button asChild className="h-10 rounded-full px-5 text-blue-700 hover:bg-blue-50" variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
            
            </>
          )}
          {shouldShowBecomeDonor ? (
            <Button asChild className="h-10 rounded-full bg-blue-600 px-5 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700">
              <Link href="/become-donor">Become a Donor</Link>
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
