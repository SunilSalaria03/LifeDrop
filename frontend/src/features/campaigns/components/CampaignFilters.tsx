'use client';

import { useMemo } from 'react';
import { City, State } from 'country-state-city';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CAMPAIGN_STATUS_OPTIONS, CampaignFilterValues } from '../types/campaign.types';

const selectTriggerClassName =
  'h-14 rounded-2xl border border-neutral-300 bg-white shadow-sm shadow-neutral-950/[0.06] ring-1 ring-neutral-950/[0.04] hover:border-neutral-400 hover:shadow-[0_1px_4px_-1px_rgba(0,0,0,0.08)] transition-[border-color,box-shadow]';

type CampaignFiltersProps = {
  filters: CampaignFilterValues;
  stateOptions: { value: string; label: string }[];
  onChange: (filters: CampaignFilterValues) => void;
  onSearch: () => void;
};

export function CampaignFilters({
  filters,
  stateOptions,
  onChange,
  onSearch,
}: CampaignFiltersProps) {
  const indianStates = useMemo(() => State.getStatesOfCountry('IN'), []);

  const selectedState = useMemo(
    () => indianStates.find((state) => state.name === filters.state),
    [filters.state, indianStates],
  );

  const cities = useMemo(() => {
    if (!selectedState) {
      return [];
    }

    return City.getCitiesOfState('IN', selectedState.isoCode);
  }, [selectedState]);

  const updateState = (state: string) => {
    onChange({ ...filters, state, city: '' });
  };

  const updateCity = (city: string) => {
    onChange({ ...filters, city });
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-white/80 bg-white/90 p-3 text-left shadow-2xl shadow-red-950/10 backdrop-blur sm:p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center">
      <Select onValueChange={updateState} value={filters.state}>
        <SelectTrigger aria-label="State" className={selectTriggerClassName}>
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          {stateOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={filters.state === 'all' || cities.length === 0}
        onValueChange={updateCity}
        value={filters.city}
      >
        <SelectTrigger aria-label="City" className={selectTriggerClassName}>
          <SelectValue placeholder="City / district" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={`${city.name}-${city.latitude}`} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => onChange({ ...filters, status: value })}
        value={filters.status}
      >
        <SelectTrigger aria-label="Status" className={selectTriggerClassName}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {CAMPAIGN_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>


      <Button
        className="h-14 w-full px-6 text-base shadow-lg shadow-red-500/20 hover:bg-red-800 md:w-auto"
        onClick={onSearch}
        type="button"
      >
        <Search className="h-5 w-5 shrink-0" aria-hidden />
        Search Campaigns
      </Button>
    </div>
  );
}
