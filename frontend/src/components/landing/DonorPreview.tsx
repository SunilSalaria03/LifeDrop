import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const donors = [
  {
    name: 'Aarav Sharma',
    bloodGroup: 'O+',
    distance: '2.4 km',
    available: true
  },
  {
    name: 'Priya Nair',
    bloodGroup: 'A+',
    distance: '4.1 km',
    available: true
  },
  {
    name: 'Rahul Mehta',
    bloodGroup: 'B-',
    distance: '6.8 km',
    available: false
  }
];

export function DonorPreview() {
  return (
    <section className="bg-neutral-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-600">Nearby help</p>
            <h2 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950">Available Donors Near You</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-neutral-600">
            Preview data for MVP. Live donor matching will use location, availability, and eligibility.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {donors.map((donor) => (
            <article className="grid gap-5 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm shadow-neutral-950/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-950/10" key={donor.name}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-950">{donor.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
                    <MapPin className="h-4 w-4" />
                    {donor.distance}
                  </p>
                </div>
                <span className="rounded-full bg-red-50 px-3.5 py-1.5 text-sm font-bold text-[#E74C3C]">
                  {donor.bloodGroup}
                </span>
              </div>

              <span
                className={
                  donor.available
                    ? 'w-fit rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-[#27AE60]'
                    : 'w-fit rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-500'
                }
              >
                {donor.available ? 'Available' : 'Not Available'}
              </span>

              <Button className="h-11 rounded-full border-blue-200 text-blue-700 hover:bg-blue-50" type="button" variant="outline">
                View Profile
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
