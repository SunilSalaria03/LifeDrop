import Link from 'next/link';
import { Droplet, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const footerLinks = ['About', 'Contact', 'Privacy Policy'];

export function Footer() {
  return (
    <footer className="border-t border-red-100/70 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_52%,#fff4f4_100%)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8 lg:py-14">
        <div className="grid gap-4">
          <Link className="inline-flex w-fit items-center gap-3 text-2xl font-bold text-neutral-950" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-700 text-white shadow-lg shadow-red-700/20">
              <Droplet className="h-5 w-5" />
            </span>
            <span>LifeDrop</span>
          </Link>
          <p className="max-w-sm text-sm font-medium leading-6 text-neutral-600">
            Connecting blood donors and requesters quickly, safely, and locally when every minute matters.
          </p>
        </div>

        <div className="grid gap-4">
          <h2 className="text-sm font-bold uppercase text-neutral-950">Links</h2>
          <div className="grid gap-2">
            {footerLinks.map((link) => (
              <Link className="w-fit text-sm font-medium text-neutral-600 transition hover:text-red-700" href="#" key={link}>
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-sm font-bold uppercase text-neutral-950">Social</h2>
          <div className="flex items-center gap-3 text-neutral-500">
            <Link aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-neutral-500 shadow-sm shadow-red-950/5 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700" href="#">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-neutral-500 shadow-sm shadow-red-950/5 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700" href="#">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-neutral-500 shadow-sm shadow-red-950/5 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700" href="#">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-neutral-500 shadow-sm shadow-red-950/5 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700" href="#">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-red-100/70 bg-white/60 px-4 py-4 text-center text-sm font-medium text-neutral-500">
        Copyright 2026 LifeDrop. All rights reserved.
      </div>
    </footer>
  );
}
