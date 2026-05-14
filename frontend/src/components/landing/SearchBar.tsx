'use client';

import { useMemo } from 'react';
import { City, State } from 'country-state-city';
import { Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { bloodGroups } from '@/lib/constants/locations';
import { SearchBarProps } from './landing.types';

const selectTriggerClassName =
  'h-14 rounded-2xl border border-neutral-300 bg-white shadow-sm shadow-neutral-950/[0.06] ring-1 ring-neutral-950/[0.04] hover:border-neutral-400 hover:shadow-[0_1px_4px_-1px_rgba(0,0,0,0.08)] transition-[border-color,box-shadow]';

export function SearchBar({
  values,
  isSearching,
  onChange,
  onSearch,
}: SearchBarProps) {
  const states = useMemo(() => State.getStatesOfCountry('IN'), []);
  const cities = useMemo(() => {
    if (!values.stateCode) {
      return [];
    }

    return City.getCitiesOfState('IN', values.stateCode);
  }, [values.stateCode]);

  const updateBloodGroup = (bloodGroup: string) => {
    onChange({ ...values, bloodGroup });
  };

  const updateState = (stateCode: string) => {
    const selectedState = states.find((state) => state.isoCode === stateCode);

    onChange({
      ...values,
      state: selectedState?.name ?? '',
      stateCode,
      city: '',
      lat: undefined,
      lng: undefined,
    });
  };

  const updateCity = (city: string) => {
    const selectedCity = cities.find((cityOption) => cityOption.name === city);
    const lat = selectedCity?.latitude
      ? Number(selectedCity.latitude)
      : undefined;
    const lng = selectedCity?.longitude
      ? Number(selectedCity.longitude)
      : undefined;

    onChange({
      ...values,
      city,
      lat: Number.isFinite(lat) ? lat : undefined,
      lng: Number.isFinite(lng) ? lng : undefined,
    });
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-white/80 bg-white/90 p-3 text-left shadow-2xl shadow-red-950/10 backdrop-blur sm:p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center">
      <Select onValueChange={updateBloodGroup} value={values.bloodGroup}>
        <SelectTrigger
          aria-label="Blood group"
          className={selectTriggerClassName}
        >
          <SelectValue placeholder="Blood group" />
        </SelectTrigger>
        <SelectContent>
          {bloodGroups.map((bloodGroup) => (
            <SelectItem key={bloodGroup} value={bloodGroup}>
              {bloodGroup}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={updateState} value={values.stateCode}>
        <SelectTrigger
          aria-label="State"
          className={selectTriggerClassName}
        >
          <SelectValue placeholder="State" />
        </SelectTrigger>
        <SelectContent>
          {states.map((state) => (
            <SelectItem key={state.isoCode} value={state.isoCode}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={!values.stateCode || cities.length === 0}
        onValueChange={updateCity}
        value={values.city}
      >
        <SelectTrigger
          aria-label="City"
          className={selectTriggerClassName}
        >
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

      <Button
        className="h-14 w-full rounded-2xl bg-red-600 px-6 text-base text-white shadow-lg shadow-red-500/20 hover:bg-red-700 md:w-auto"
        disabled={isSearching}
        onClick={onSearch}
        type="button"
      >
        <Droplet className="h-5 w-5" />
        {isSearching ? 'Searching' : 'Find Blood'}
      </Button>
    </div>
  );
}
