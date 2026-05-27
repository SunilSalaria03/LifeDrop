import {
  BadgeCheck,
  HeartPulse,
  MapPin,
  Route,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { LIFEDROP_ABOUT_SECTION_ID } from './landing.constants';

const aboutPillars = [
  {
    title: 'Built for urgency',
    description:
      'LifeDrop is designed for moments when coordinators and families need a clear path from need to contact—not another endless search.',
    icon: HeartPulse,
  },
  {
    title: 'Verified participation',
    description:
      'Donor profiles and platform access emphasise verification so requests and responses stay credible under pressure.',
    icon: BadgeCheck,
  },
  {
    title: 'Precise discovery',
    description:
      'Search by blood group, state, and city to surface donors aligned with the situation before outreach begins.',
    icon: Search,
  },
  {
    title: 'Respectful coordination',
    description:
      'Privacy expectations are stated upfront, with profiles structured so decisions can be made quickly and respectfully.',
    icon: ShieldCheck,
  },
];

const aboutFacts: {
  label: string;
  value: string;
  icon: LucideIcon;
}[] = [
  { label: 'Focus', value: 'Urgent blood coordination', icon: HeartPulse },
  { label: 'Reach', value: 'Growing city coverage', icon: MapPin },
  { label: 'Approach', value: 'Verify · Search · Connect', icon: Route },
];

export function AboutSection() {
  return (
    <section
      className="scroll-mt-20 relative overflow-hidden border-b border-red-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#fff5f5_48%,#ffffff_100%)] px-4 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      id={LIFEDROP_ABOUT_SECTION_ID}
    >
      <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-red-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-red-50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(220,38,38,0.04)_0_1px,transparent_1px_40px)] opacity-60" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:gap-14">
        <div className="mx-auto grid max-w-3xl gap-5 text-center">
          <p className="mx-auto inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-700 shadow-sm sm:px-4 sm:tracking-[0.14em]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
              <HeartPulse className="h-4 w-4" aria-hidden />
            </span>
            About LifeDrop
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            A focused network for urgent blood support
          </h2>
          <p className="text-sm font-medium leading-7 text-neutral-600 sm:text-base sm:leading-8">
            LifeDrop brings donors and coordinators onto one platform—so blood group
            and geography drive the search, verification builds trust, and families
            spend less time navigating and more time acting.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-8">
          <div className="overflow-hidden rounded-[1.75rem] border border-red-100 bg-white ring-1 ring-red-50/80">
            <div className="flex items-start gap-4 border-b border-red-100/90 bg-gradient-to-br from-red-50/50 via-white to-white px-6 py-6 sm:gap-5 sm:px-8 sm:py-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-700 text-white shadow-lg shadow-red-700/25 ring-4 ring-red-50">
                <MapPin className="h-6 w-6" aria-hidden />
              </span>
              <div className="grid min-w-0 flex-1 gap-2.5">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Our mission
                </h3>
                <p className="text-sm font-medium leading-7 text-neutral-600 sm:text-[15px] sm:leading-7">
                  We exist to shorten the distance between an urgent blood need and a
                  credible donor response—through structured profiles, clear search,
                  and coordination tools that work when stress is high and time is
                  limited.
                </p>
                <p className="text-sm font-medium leading-7 text-neutral-500 sm:text-[15px] sm:leading-7">
                  LifeDrop supports donors who want to help responsibly, and families
                  who need answers quickly—without replacing hospital or blood bank
                  workflows, but by making the outreach path clearer from the first
                  search to the first conversation.
                </p>
              </div>
            </div>
            <div className="grid divide-y divide-red-100/90 bg-slate-50/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {aboutFacts.map((fact) => {
                const FactIcon = fact.icon;

                return (
                  <div
                    className="flex min-h-[7.5rem] flex-col items-center justify-center gap-2.5 px-5 py-5 text-center sm:min-h-[8rem] sm:px-6 sm:py-6"
                    key={fact.label}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red-700">
                      {fact.label}
                    </p>
                    <p className="text-sm font-semibold leading-snug text-slate-900 sm:text-[15px]">
                      {fact.value}
                    </p>
                    <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700 ring-1 ring-red-200/80">
                      <FactIcon className="h-5 w-5" aria-hidden strokeWidth={2.25} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {aboutPillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div
                  className="group flex gap-4 rounded-2xl border border-red-100/80 bg-white/90 p-4 transition duration-300 hover:border-red-200 sm:p-5"
                  key={pillar.title}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700 ring-1 ring-red-100 transition duration-300 group-hover:bg-red-700 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="grid gap-1.5">
                    <h3 className="text-base font-bold text-slate-900">{pillar.title}</h3>
                    <p className="text-sm font-medium leading-6 text-neutral-600">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mx-auto max-w-3xl rounded-2xl border border-red-100/90 bg-white/80 px-5 py-4 text-center text-sm font-semibold leading-7 text-red-900/85 sm:px-6">
          LifeDrop is not a replacement for hospital or blood bank protocols—it is a
          coordination layer that helps people find and reach verified donors faster
          when minutes matter.
        </p>
      </div>
    </section>
  );
}
