import { HeartPulse, PhoneCall, Search } from 'lucide-react';

const steps = [
  {
    title: 'Search donors',
    description: 'Find donors by city, pincode, or blood group.',
    icon: Search
  },
  {
    title: 'Contact / request',
    description: 'Send a request and connect with nearby eligible donors.',
    icon: PhoneCall
  },
  {
    title: 'Save lives',
    description: 'Coordinate faster and get help when every minute matters.',
    icon: HeartPulse
  }
];

export function HowItWorks() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase text-blue-600">How it works</p>
          <h2 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950">Simple steps for urgent help</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article className="grid gap-4 rounded-2xl border border-neutral-200/80 bg-white p-7 text-center shadow-sm shadow-neutral-950/5" key={step.title}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-neutral-400">Step {index + 1}</p>
                <h3 className="text-xl font-bold text-neutral-950">{step.title}</h3>
                <p className="text-base leading-7 text-neutral-600">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
