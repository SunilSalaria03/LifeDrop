import { BadgeCheck, HeartPulse, Search, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Register",
    description:
      "Create your LifeDrop account and add your basic donor or requester details.",
    icon: UserPlus,
    iconClassName: "bg-red-50 text-red-700 ring-red-100",
  },
  {
    title: "Verify",
    description:
      "Confirm your profile so nearby blood requests stay trusted and reliable.",
    icon: BadgeCheck,
    iconClassName: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    title: "Connect",
    description:
      "Search by blood group and location to find eligible donors around you.",
    icon: Search,
    iconClassName: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    title: "Save Lives",
    description:
      "Coordinate quickly and help someone get blood when every minute matters.",
    icon: HeartPulse,
    iconClassName: "bg-rose-50 text-rose-700 ring-rose-100",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_52%,#fff4f4_100%)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:gap-10">
        <div className="mx-auto grid max-w-2xl gap-3 text-center">
          <p className="text-sm font-semibold uppercase text-red-700">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-normal text-neutral-950 sm:text-4xl">
            A faster path from need to help
          </h2>
          <p className="text-sm font-medium leading-6 text-neutral-600 sm:text-base sm:leading-7">
            Designed for urgent moments, with each step kept simple and action-ready.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                className="group rounded-2xl border border-white/80 bg-white/95 shadow-lg shadow-red-950/5 transition duration-200 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl hover:shadow-red-950/10"
                key={step.title}
              >
                <CardContent className="grid gap-5 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${step.iconClassName}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-xs font-bold text-white shadow-sm shadow-neutral-950/10">
                      {index + 1}
                    </span>
                  </div>
                  <div className="grid gap-2 text-left">
                    <h3 className="text-xl font-bold tracking-normal text-neutral-950">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium leading-6 text-neutral-600">
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
