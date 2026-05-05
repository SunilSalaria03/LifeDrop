import { BadgeCheck, HeartPulse, Search, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Register",
    description:
      "Create your LifeDrop account and add your basic donor or requester details.",
    icon: UserPlus,
  },
  {
    title: "Verify",
    description:
      "Confirm your profile so nearby blood requests stay trusted and reliable.",
    icon: BadgeCheck,
  },
  {
    title: "Connect",
    description:
      "Search by blood group and location to find eligible donors around you.",
    icon: Search,
  },
  {
    title: "Save Lives",
    description:
      "Coordinate quickly and help someone get blood when every minute matters.",
    icon: HeartPulse,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase text-red-600">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-neutral-950 sm:text-4xl">
            A faster path from need to help
          </h2>
          <p className="mt-4 text-base leading-7 text-neutral-600">
            Designed for urgent moments, with each step kept simple and action-ready.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                className="rounded-2xl border-red-100/70 bg-white shadow-lg shadow-red-950/5 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/10"
                key={step.title}
              >
                <CardContent className="grid gap-5 p-6 text-center lg:p-7">
                  <div className="relative mx-auto">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/20">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-neutral-950 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <h3 className="text-xl font-bold tracking-normal text-neutral-950">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-6 text-neutral-600">
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
