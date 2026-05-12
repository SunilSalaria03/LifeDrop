import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-50 px-4 py-10 text-neutral-950">
      <section className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-5 py-4 text-sm font-medium text-neutral-600 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-red-700" />
        Loading...
      </section>
    </main>
  );
}
