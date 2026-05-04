import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const footerLinks = ['About', 'Contact', 'Privacy Policy'];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="grid gap-3">
          <Link className="text-2xl font-bold text-blue-600" href="/">
            LifeDrop
          </Link>
          <p className="max-w-sm text-sm leading-6 text-neutral-600">
            Connecting blood donors and requesters quickly, safely, and locally when every minute matters.
          </p>
        </div>

        <div className="grid gap-3">
          <h2 className="text-sm font-semibold text-neutral-950">Links</h2>
          <div className="grid gap-2">
            {footerLinks.map((link) => (
              <Link className="text-sm text-neutral-600 hover:text-blue-600" href="#" key={link}>
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <h2 className="text-sm font-semibold text-neutral-950">Social</h2>
          <div className="flex items-center gap-3 text-neutral-500">
            <Link aria-label="Twitter" className="hover:text-blue-600" href="#">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link aria-label="Instagram" className="hover:text-blue-600" href="#">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link aria-label="Facebook" className="hover:text-blue-600" href="#">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link aria-label="LinkedIn" className="hover:text-blue-600" href="#">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-100 px-4 py-4 text-center text-sm text-neutral-500">
        Copyright 2026 LifeDrop. All rights reserved.
      </div>
    </footer>
  );
}
