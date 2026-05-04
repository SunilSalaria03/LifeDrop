const stats = [
  {
    label: 'Donors registered',
    value: '12k+'
  },
  {
    label: 'Requests fulfilled',
    value: '4.8k+'
  },
  {
    label: 'Cities covered',
    value: '80+'
  }
];

export function StatsSection() {
  return (
    <section className="bg-blue-600 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1.4fr] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-100">Impact</p>
          <h2 className="mt-3 text-4xl font-bold tracking-normal">Helping thousands of lives</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-blue-50">
            LifeDrop is built to make donor discovery and urgent blood requests faster, clearer, and easier to act on.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div className="rounded-2xl bg-white/10 p-6 text-center shadow-lg shadow-blue-950/10 ring-1 ring-white/20" key={stat.label}>
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="mt-3 text-sm font-medium text-blue-50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
