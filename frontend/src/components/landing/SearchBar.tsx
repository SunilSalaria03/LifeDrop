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

export type DonorSearchFormValues = {
  bloodGroup: string;
  state: string;
  stateCode: string;
  city: string;
  lat?: number;
  lng?: number;
};

type SearchBarProps = {
  values: DonorSearchFormValues;
  isSearching: boolean;
  onChange: (values: DonorSearchFormValues) => void;
  onSearch: () => void;
};

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
    <div className="grid gap-3 rounded-[2rem] border border-white/80 bg-white/85 p-3 text-left shadow-2xl shadow-blue-950/10 backdrop-blur md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
      <Select onValueChange={updateBloodGroup} value={values.bloodGroup}>
        <SelectTrigger
          aria-label="Blood group"
          className="h-14 rounded-2xl border-neutral-200 bg-white"
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
          className="h-14 rounded-2xl border-neutral-200 bg-white"
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
          className="h-14 rounded-2xl border-neutral-200 bg-white"
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
        className="h-14 rounded-2xl bg-[#E74C3C] px-6 text-base text-white shadow-lg shadow-red-500/20 hover:bg-red-600"
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
