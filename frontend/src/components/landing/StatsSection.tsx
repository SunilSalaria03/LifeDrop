import { Card, CardContent } from '@/components/ui/card';
import { landingStats } from './landing.constants';

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-red-700 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Subtle texture overlays */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-red-900/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:gap-10">
        <div className="mx-auto grid max-w-2xl gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-200">
            LifeDrop impact
          </p>
          <h2 className="text-3xl font-bold tracking-normal text-white sm:text-4xl">
            Small actions, measurable help
          </h2>
          <p className="text-sm font-medium leading-6 text-red-100 sm:text-base">
            A quick view of the community activity powering faster donor discovery.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {landingStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                className="group overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg shadow-red-950/20 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl hover:shadow-red-950/30"
                key={stat.label}
              >
                <CardContent className="grid gap-5 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/25">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="h-2 w-2 rounded-full bg-white/30 transition group-hover:bg-white/70" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-4xl font-bold tracking-normal text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm font-semibold text-red-100">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
