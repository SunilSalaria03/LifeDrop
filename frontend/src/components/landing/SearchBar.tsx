'use client';

import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickSearches = ['Delhi', 'Mumbai', 'Bangalore', 'O+', 'A+', 'Emergency'];

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-5">
      <form
        className="flex min-h-16 items-center gap-2 rounded-full border border-white/80 bg-white/95 p-2.5 shadow-2xl shadow-blue-950/12 ring-1 ring-neutral-950/5"
        onSubmit={handleSubmit}
      >
        <Search className="ml-4 h-5 w-5 shrink-0 text-neutral-400" />
        <input
          aria-label="Search by city or pincode"
          className="min-w-0 flex-1 bg-transparent px-2 text-base font-medium text-neutral-950 outline-none placeholder:font-normal placeholder:text-neutral-400"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by city or pincode"
          value={searchTerm}
        />
        <Button className="h-11 rounded-full bg-blue-600 px-6 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700" type="submit">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap justify-center gap-2.5">
        {quickSearches.map((item) => (
          <button
            className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-neutral-650 shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700"
            key={item}
            onClick={() => setSearchTerm(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
