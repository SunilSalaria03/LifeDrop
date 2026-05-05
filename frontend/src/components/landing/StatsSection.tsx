import { ClipboardPlus, HeartPulse, MapPin, UsersRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    label: 'Registered Donors',
    value: '1,250',
    icon: UsersRound,
    iconClassName: 'bg-red-50 text-red-600 ring-red-100',
  },
  {
    label: 'Lives Saved',
    value: '380',
    icon: HeartPulse,
    iconClassName: 'bg-red-50 text-red-600 ring-red-100',
  },
  {
    label: 'Blood Requests',
    value: '450',
    icon: ClipboardPlus,
    iconClassName: 'bg-blue-50 text-blue-700 ring-blue-100',
  },
  {
    label: 'Cities Covered',
    value: '40',
    icon: MapPin,
    iconClassName: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  },
];

export function StatsSection() {
  return (
    <section className="bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#fff7f7_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase text-red-600">LifeDrop impact</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-neutral-950 sm:text-4xl">
            Small actions, measurable help
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                className="group overflow-hidden rounded-2xl border-white/80 bg-white/95 shadow-xl shadow-blue-950/10 transition duration-200 hover:-translate-y-1 hover:border-red-100 hover:shadow-2xl hover:shadow-blue-950/15"
                key={stat.label}
              >
                <CardContent className="grid gap-5 p-6 text-center lg:p-7">
                  <div className="mx-auto rounded-2xl bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_48%,#fff1f2_100%)] p-3 shadow-sm shadow-blue-950/5">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${stat.iconClassName}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>
                  <div>
                    <p className="text-4xl font-bold tracking-normal text-red-600">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-neutral-500">
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
