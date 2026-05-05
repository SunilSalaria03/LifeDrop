'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    title: 'Request Blood',
    description: 'Create an urgent request and reach nearby donors who match your blood need.',
    buttonLabel: 'Request Now',
    href: '/request-blood',
    icon: AlertTriangle,
    accent: 'text-[#E74C3C]',
    button: 'bg-[#E74C3C] hover:bg-red-600'
  },
  {
    title: 'Donate Blood',
    description: 'Register as a donor and make yourself available for people in your city.',
    buttonLabel: 'Become a Donor',
    href: '/become-donor',
    icon: HeartHandshake,
    accent: 'text-[#27AE60]',
    button: 'bg-[#27AE60] hover:bg-green-700'
  }
];

export function ActionCards() {
  const router = useRouter();

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <article
              className="grid gap-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-lg shadow-neutral-950/5 transition hover:-translate-y-1 hover:border-red-100 hover:shadow-xl hover:shadow-neutral-950/10 lg:p-8"
              key={action.title}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50 ring-1 ring-neutral-100 ${action.accent}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="grid gap-3">
                <h2 className="text-2xl font-bold tracking-normal text-neutral-950">{action.title}</h2>
                <p className="max-w-xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">{action.description}</p>
              </div>
              <div>
                <Button className={`${action.button} h-11 rounded-full px-6 text-white`} onClick={() => router.push(action.href)} type="button">
                  {action.buttonLabel}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
