import { HeartPulse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { landingSteps } from "./landing.constants";

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.18),transparent_32%),linear-gradient(135deg,#111827_0%,#0f172a_58%,#1f1022_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0_1px,transparent_1px_34px)] opacity-30" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-red-700/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-red-900/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:gap-10">
        <div className="mx-auto grid max-w-2xl gap-3 text-center">
          <p className="mx-auto inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-300 sm:px-4 sm:tracking-[0.14em]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
              <HeartPulse className="h-4 w-4" aria-hidden />
            </span>
            How it works
          </p>
          <h2 className="text-3xl font-black tracking-normal text-white sm:text-4xl">
            A faster path from need to help
          </h2>
          <p className="text-sm font-medium leading-6 text-slate-400 sm:text-base sm:leading-7">
            Designed for urgent moments, with each step kept simple and action-ready.
          </p>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div className="pointer-events-none absolute left-8 right-8 top-16 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(248,113,113,0.45),rgba(255,255,255,0.18),rgba(248,113,113,0.45),transparent)] lg:block" />
          {landingSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/20 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-red-400/40 hover:bg-white/[0.1] hover:shadow-red-950/25"
                key={step.title}
              >
                <CardContent className="relative grid min-h-56 gap-6 p-5 sm:p-6">
                  <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#dc2626,#fb7185,#f97316)] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-500/10 blur-2xl transition duration-300 group-hover:bg-red-400/20" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-300 ring-1 ring-red-400/25 transition duration-300 group-hover:scale-105 group-hover:bg-red-500 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-red-600 text-xs font-black text-white shadow-lg shadow-red-950/30">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mt-auto grid gap-3 text-left">
                    <h3 className="text-xl font-bold tracking-normal text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold leading-6 text-slate-300/85">
                      {step.description}
                    </p>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-500 group-hover:bg-red-400"
                      style={{ width: `${(index + 1) * 25}%` }}
                    />
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
