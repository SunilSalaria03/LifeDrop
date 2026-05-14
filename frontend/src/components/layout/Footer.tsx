import Link from 'next/link';
import { Droplet, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { footerLinks } from './footer.constants';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#111827_55%,#1f1022_100%)]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-red-700/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-red-900/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_34px)] opacity-25" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.45fr_0.8fr_1fr] lg:px-8 lg:py-16">
        <div className="grid max-w-md gap-5">
          <Link className="inline-flex w-fit items-center gap-3 text-2xl font-black text-white" href="/">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700 text-white shadow-xl shadow-red-950/30 ring-1 ring-white/10">
              <Droplet className="h-5 w-5" />
            </span>
            <span className="grid leading-none">
              LifeDrop
              <span className="mt-1 text-xs font-black uppercase tracking-widest text-red-300">
                Blood donor network
              </span>
            </span>
          </Link>
          <p className="text-sm font-semibold leading-7 text-slate-300">
            Connecting blood donors and requesters quickly, safely, and locally when every minute matters.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase text-slate-300">
              Fast search
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase text-slate-300">
              Verified access
            </span>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">Links</h2>
          <div className="grid gap-3">
            {footerLinks.map((link) => (
              <Link className="w-fit text-sm font-semibold text-slate-400 transition hover:translate-x-1 hover:text-red-300" href="#" key={link}>
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid content-start gap-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">Social</h2>
          <p className="max-w-xs text-sm font-semibold leading-6 text-slate-400">
            Follow updates, donor stories, and community blood support activity.
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-sm font-semibold text-slate-500 sm:flex-row sm:text-left">
          <span>Copyright 2026 LifeDrop. All rights reserved.</span>
          <span className="text-slate-600">Built for faster local blood support.</span>
        </div>
      </div>
    </footer>
  );
}
