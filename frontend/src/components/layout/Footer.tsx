'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Droplet, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { footerLinks } from './footer.constants';
import { userStorage } from '@/lib/auth/user-storage';

const footerLinkClassName =
  'w-fit text-sm font-semibold text-slate-400 transition hover:translate-x-1 hover:text-red-300';

export function Footer() {
  const router = useRouter();

  const handleJoinAsDonor = () => {
    const user = userStorage.getUser();

    if (!user) {
      window.dispatchEvent(new CustomEvent('lifedrop:open-auth-modal'));
      return;
    }

    if (user?.role === 'donor') {
      router.push('/profile');
      return;
    }

    if (!user?.phoneVerified) {
      window.dispatchEvent(
        new CustomEvent('lifedrop:open-auth-modal', {
          detail: { phone: user?.phone ?? '', redirect: '/become-donor' },
        }),
      );
      return;
    }

    router.push('/become-donor');
  };

  const handleSearchDonors = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#111827_55%,#1f1022_100%)]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-red-700/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-red-900/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_34px)] opacity-25" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.45fr_0.8fr_1fr] lg:px-8 lg:py-16">
        <div className="grid max-w-md gap-5">
          <Link
            aria-label="LifeDrop home"
            className="group inline-flex w-fit items-center gap-3 rounded-full pr-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            href="/"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-700 text-white shadow-lg shadow-red-700/20 transition group-hover:bg-red-800">
              <Droplet className="h-6 w-6 fill-white/20" strokeWidth={2.4} />
            </span>
            <span className="grid leading-none">
              <span className="text-xl font-bold tracking-normal text-white sm:text-2xl">
                LifeDrop
              </span>
              <span className="mt-1 text-xs font-semibold leading-snug tracking-normal text-red-300">
                Connecting donors with patients in need
              </span>
            </span>
          </Link>
          <p className="text-sm font-semibold leading-7 text-slate-300">
            A verified donor network built for urgent blood coordination—search by
            blood group and city, then connect when every minute matters.
          </p>
        </div>

        <div className="grid content-start gap-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">Links</h2>
          <div className="grid gap-3">
            {footerLinks.map((link) => (
              <Link className={footerLinkClassName} href="#" key={link}>
                {link}
              </Link>
            ))}
            <button
              className={footerLinkClassName}
              onClick={handleJoinAsDonor}
              type="button"
            >
              Join as a Donor
            </button>
            <button
              className={footerLinkClassName}
              onClick={handleSearchDonors}
              type="button"
            >
              Search Donors
            </button>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">Social</h2>
          <p className="max-w-xs text-sm font-semibold leading-6 text-slate-400">
            Follow LifeDrop for product updates, donor stories, and community
            initiatives across our official social channels.
          </p>
          <div className="flex items-center gap-3">
            <Link aria-label="Twitter" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-red-400/50 hover:bg-red-700 hover:text-white" href="#">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-red-400/50 hover:bg-red-700 hover:text-white" href="#">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-red-400/50 hover:bg-red-700 hover:text-white" href="#">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-red-400/50 hover:bg-red-700 hover:text-white" href="#">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-slate-950/50 px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center text-sm font-semibold text-slate-500 sm:text-left">
          <span>Copyright © All rights reserved.</span>
          <span className="text-slate-600">
            Designed and developed by{' '}
            <a
              className="text-slate-400 underline decoration-slate-600/60 underline-offset-2 transition hover:text-red-300 hover:decoration-red-300/60"
              href="https://lnpinfotech.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              LNP Infotech Pvt. Ltd.
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
