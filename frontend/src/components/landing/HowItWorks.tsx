import { Card, CardContent } from "@/components/ui/card";
import { landingSteps } from "./landing.constants";

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-slate-900 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-red-700/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-red-900/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:gap-10">
        <div className="mx-auto grid max-w-2xl gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-400">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-normal text-white sm:text-4xl">
            A faster path from need to help
          </h2>
          <p className="text-sm font-medium leading-6 text-slate-400 sm:text-base sm:leading-7">
            Designed for urgent moments, with each step kept simple and action-ready.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {landingSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                className="group rounded-2xl border border-white/10 bg-slate-800/80 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-red-700/40 hover:shadow-xl hover:shadow-red-900/20"
                key={step.title}
              >
                <CardContent className="grid gap-5 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700/20 text-red-400 ring-1 ring-red-700/30">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white shadow-sm shadow-red-700/40">
                      {index + 1}
                    </span>
                  </div>
                  <div className="grid gap-2 text-left">
                    <h3 className="text-xl font-bold tracking-normal text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium leading-6 text-slate-400">
                      {step.description}
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
