'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStates } from '@/lib/api/locations';

type StateDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

export function StateDropdown({ value, onChange }: StateDropdownProps) {
  const statesQuery = useQuery({
    queryKey: ['locations', 'states'],
    queryFn: getStates,
    staleTime: 10 * 60 * 1000,
  });
  const states = statesQuery.data ?? [];

  return (
    <Select
      disabled={statesQuery.isLoading || states.length === 0}
      onValueChange={onChange}
      value={value}
    >
      <SelectTrigger
        aria-label="State"
        className="h-14 rounded-2xl border-neutral-200 bg-white"
      >
        <SelectValue
          placeholder={statesQuery.isLoading ? 'Loading states' : 'State'}
        />
      </SelectTrigger>
      <SelectContent>
        {states.map((state) => (
          <SelectItem key={state} value={state}>
            {state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
