"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Droplet,
  HeartHandshake,
  Loader2,
  LogIn,
  LogOut,
  Megaphone,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/components/location/LocationSelector";
import { AuthModal } from "@/features/auth/components/AuthModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthUser } from "@/features/auth/types/auth.types";
import { userStorage } from "@/lib/auth/user-storage";
import { stripNextInternalSearchParams } from "@/lib/navigation/safe-url";
import manImage from "@/assets/images/man.png";
import { getDisplayName, getInitials } from "./header.helpers";

export function Header() {
  const router = useRouter();
  const { logoutMutation, meQuery } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPhone, setAuthModalPhone] = useState("");
  const [authModalRedirect, setAuthModalRedirect] = useState<
    string | undefined
  >();
  const [storedUser, setStoredUser] = useState<AuthUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = meQuery.data ?? storedUser;
  const shouldShowBecomeDonor = !user || user.role !== "donor";

  useEffect(() => {
    setStoredUser(userStorage.getUser());
  }, []);

  useEffect(() => {
    const params = stripNextInternalSearchParams(
      new URLSearchParams(window.location.search),
    );

    if (params.get("auth") === "login") {
      setAuthModalPhone(params.get("phone") ?? "");
      setIsAuthModalOpen(true);
    }
  }, []);

  useEffect(() => {
    function handleOpenAuthModal(event: Event) {
      const customEvent = event as CustomEvent<{
        phone?: string;
        redirect?: string;
      }>;
      setAuthModalPhone(customEvent.detail?.phone ?? "");
      setAuthModalRedirect(customEvent.detail?.redirect);
      setIsAuthModalOpen(true);
    }

    window.addEventListener("lifedrop:open-auth-modal", handleOpenAuthModal);
    return () =>
      window.removeEventListener(
        "lifedrop:open-auth-modal",
        handleOpenAuthModal,
      );
  }, []);

  useEffect(() => {
    if (meQuery.data) {
      setStoredUser(meQuery.data);
    }
  }, [meQuery.data]);

  useEffect(() => {
    if (logoutMutation.isSuccess || logoutMutation.isError) {
      setStoredUser(null);
    }
  }, [logoutMutation.isError, logoutMutation.isSuccess]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (logoutMutation.isPending) {
      return;
    }

    setIsMenuOpen(false);
    logoutMutation.mutate();
  };

  const handleBecomeDonor = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (!user.phoneVerified) {
      setAuthModalPhone(user.phone ?? "");
      setAuthModalRedirect("/become-donor");
      setIsAuthModalOpen(true);
      return;
    }

    router.push("/become-donor");
  };

  const openAuthModal = useCallback(() => {
    setAuthModalPhone("");
    setAuthModalRedirect(undefined);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalRedirect(undefined);

    const cleanParams = stripNextInternalSearchParams(
      new URLSearchParams(window.location.search),
    );
    const hadModalParams = cleanParams.has("auth") || cleanParams.has("phone");

    if (!hadModalParams) {
      return;
    }

    cleanParams.delete("auth");
    cleanParams.delete("phone");

    const nextSearch = cleanParams.toString();
    router.replace(
      `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`,
      { scroll: false },
    );
  }, [router]);

  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b border-red-100/80 bg-white/90 shadow-sm shadow-red-950/5 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:min-h-18 sm:flex-nowrap sm:px-6 lg:px-8">
          <Link
            aria-label="LifeDrop home"
            className="group inline-flex min-w-0 items-center gap-3 rounded-full pr-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            href="/"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-700 text-white shadow-lg shadow-red-700/20 transition group-hover:bg-red-800">
              <Droplet className="h-6 w-6 fill-white/20" strokeWidth={2.4} />
            </span>
            <span className="grid leading-none">
              <span className="text-xl font-bold tracking-normal text-neutral-950 sm:text-2xl">
                LifeDrop
              </span>
              <span className="hidden text-xs font-semibold leading-snug tracking-normal text-red-700 sm:block">
                Connecting donors with patients in need
              </span>
            </span>
          </Link>

          <nav className="flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:flex-1 sm:flex-nowrap sm:justify-end sm:gap-3">
            {/* <LocationSelector /> */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  aria-expanded={isMenuOpen}
                  aria-label="Open account menu"
                  className="flex h-11 max-w-[14rem] items-center gap-2 rounded-full border border-neutral-200 bg-white px-1.5 pr-3 text-sm font-semibold text-neutral-700 shadow-sm shadow-red-950/5 transition hover:border-red-200 hover:bg-red-50/50"
                  onClick={() => setIsMenuOpen((current) => !current)}
                  type="button"
                >
                  <Avatar className="h-8 w-8 border border-red-100 bg-red-50">
                    <AvatarImage
                      alt={getDisplayName(user.name, user.phone, user.email)}
                      src={user.profileImage || manImage.src}
                    />
                    <AvatarFallback className="bg-red-50 text-xs text-red-700">
                      {getInitials(user.name, user.phone, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate sm:inline">
                    {getDisplayName(user.name, user.phone, user.email)}
                  </span>
                </button>

                {isMenuOpen ? (
                  <div className="absolute right-0 mt-3 grid w-[calc(100vw-2rem)] max-w-56 gap-1 rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl shadow-red-950/10 sm:w-56">
                    <div className="border-b border-neutral-100 px-3 py-2">
                      <p className="truncate text-sm font-bold text-neutral-950">
                        {getDisplayName(user.name, user.phone, user.email)}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {user.email ?? user.phone ?? user.role}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Settings className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    <button
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                      disabled={logoutMutation.isPending}
                      onClick={handleLogout}
                      type="button"
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Button
                  className="h-11 flex-1 rounded-full border border-solid border-slate-300 bg-transparent px-5 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 sm:flex-none"
                  onClick={openAuthModal}
                  type="button"
                  variant="outline"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </>
            )}
            <Button
              asChild
              className="h-11 flex-1 rounded-full bg-red-700 px-5 text-white shadow-sm shadow-red-700/20 hover:bg-red-800 sm:flex-none"
            >
              <Link href="/campaigns">
                <Megaphone className="h-4 w-4" />
                Campaigns
              </Link>
            </Button>
            {shouldShowBecomeDonor ? (
              user?.phoneVerified ? (
                <Button
                  asChild
                  className="h-11 flex-1 rounded-full bg-red-700 px-5 text-white shadow-sm shadow-red-700/20 hover:bg-red-800 sm:flex-none"
                >
                  <Link href="/become-donor">
                    <HeartHandshake className="h-4 w-4" />
                    Join as a Donor
                  </Link>
                </Button>
              ) : (
                <Button
                  className="h-11 flex-1 rounded-full bg-red-700 px-5 text-white shadow-sm shadow-red-700/20 hover:bg-red-800 sm:flex-none"
                  onClick={handleBecomeDonor}
                  type="button"
                >
                  <HeartHandshake className="h-4 w-4" />
                  Join as a Donor
                </Button>
              )
            ) : null}
          </nav>
        </div>
      </header>
      <AuthModal
        initialPhone={authModalPhone}
        isOpen={isAuthModalOpen}
        onAuthenticated={setStoredUser}
        onClose={closeAuthModal}
        profileRedirect={authModalRedirect}
        profileUser={user && !user.phoneVerified ? user : undefined}
      />
    </>
  );
}
