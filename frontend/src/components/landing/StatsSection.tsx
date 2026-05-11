import { Card, CardContent } from '@/components/ui/card';
import { landingStats } from './landing.constants';

export function StatsSection() {
  return (
    <section className="bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_48%,#fff4f4_100%)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:gap-10">
        <div className="mx-auto grid max-w-2xl gap-3 text-center">
          <p className="text-sm font-semibold uppercase text-red-700">
            LifeDrop impact
          </p>
          <h2 className="text-3xl font-bold tracking-normal text-neutral-950 sm:text-4xl">
            Small actions, measurable help
          </h2>
          <p className="text-sm font-medium leading-6 text-neutral-600 sm:text-base">
            A quick view of the community activity powering faster donor discovery.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {landingStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                className="group overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-lg shadow-red-950/5 transition duration-200 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl hover:shadow-red-950/10"
                key={stat.label}
              >
                <CardContent className="grid gap-5 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${stat.iconClassName}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="h-2 w-2 rounded-full bg-neutral-200 transition group-hover:bg-red-300" />
                  </div>
                  <div className="grid gap-1">
                    <p className={`text-4xl font-bold tracking-normal ${stat.valueClassName}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm font-semibold text-neutral-600">
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
