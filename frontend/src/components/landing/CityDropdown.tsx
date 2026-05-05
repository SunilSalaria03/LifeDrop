'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCities } from '@/lib/api/locations';

type CityDropdownProps = {
  state: string;
  value: string;
  onChange: (value: string) => void;
};

export function CityDropdown({ state, value, onChange }: CityDropdownProps) {
  const citiesQuery = useQuery({
    enabled: Boolean(state),
    queryKey: ['locations', 'cities', state],
    queryFn: () => getCities(state),
    staleTime: 10 * 60 * 1000,
  });
  const cities = citiesQuery.data ?? [];

  return (
    <Select
      disabled={!state || citiesQuery.isLoading || cities.length === 0}
      onValueChange={onChange}
      value={value}
    >
      <SelectTrigger
        aria-label="City or district"
        className="h-14 rounded-2xl border-neutral-200 bg-white"
      >
        <SelectValue
          placeholder={
            citiesQuery.isLoading ? 'Loading cities' : 'City / district'
          }
        />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
