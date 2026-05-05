"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Droplet, HeartPulse, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { searchDonors } from "@/lib/api/donor-search";
import { DonorSearchFilters } from "@/types/donor";
import { BloodGroupDropdown } from "./BloodGroupDropdown";
import { CityDropdown } from "./CityDropdown";
import { DonorList } from "./DonorList";
import { StateDropdown } from "./StateDropdown";

type HeroFilters = {
  bloodGroup: string;
  state: string;
  city: string;
  location: {
    lat: number | null;
    lng: number | null;
  };
};

const initialFilters: HeroFilters = {
  bloodGroup: "",
  state: "",
  city: "",
  location: {
    lat: null,
    lng: null,
  },
};

export function HeroSection() {
  const router = useRouter();
  const [filters, setFilters] = useState<HeroFilters>(initialFilters);
  const [searchFilters, setSearchFilters] = useState<DonorSearchFilters | null>(
    null,
  );
  const [validationError, setValidationError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedSearchFilters = useDebouncedValue(searchFilters, 450);

  const queryKey = useMemo(
    () => [
      "landing-donor-search",
      debouncedSearchFilters?.bloodGroup ?? "",
      debouncedSearchFilters?.state ?? "",
      debouncedSearchFilters?.city ?? "",
    ],
    [debouncedSearchFilters],
  );

  const donorQuery = useQuery({
    enabled: Boolean(debouncedSearchFilters),
    queryKey,
    queryFn: () => searchDonors(debouncedSearchFilters as DonorSearchFilters),
    retry: 1,
  });

  const isSearchDebouncing = Boolean(
    searchFilters && searchFilters !== debouncedSearchFilters,
  );

  const updateFilter = (
    key: keyof Pick<HeroFilters, "bloodGroup" | "state" | "city">,
    value: string,
  ) => {
    setValidationError("");
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
      city: key === "state" ? "" : key === "city" ? value : currentFilters.city,
    }));
  };

  const validateFilters = () => {
    if (!filters.bloodGroup || !filters.state || !filters.city) {
      setValidationError(
        "Please select blood group, state, and city before searching.",
      );
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleFindDonors = () => {
    if (!validateFilters()) {
      return;
    }

    setHasSearched(true);
    setSearchFilters({
      bloodGroup: filters.bloodGroup,
      state: filters.state,
      city: filters.city,
    });
  };


  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#eef6ff_0%,#ffffff_45%,#fff2f0_100%)]">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.20),transparent_62%)]" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(231,76,60,0.12),transparent_60%)]" />
      <div className="relative mx-auto grid min-h-[700px] max-w-7xl place-items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
        <div className="grid w-full gap-10">
          <div className="mx-auto grid max-w-5xl gap-6">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-950/5">
              <HeartPulse className="h-4 w-4" />
              Emergency blood help, closer to home
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-normal text-neutral-950 sm:text-6xl lg:text-7xl">
              Find Blood Donors Near You Instantly
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">
              Search by blood group and location to connect with nearby donors
              in seconds.
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-6xl gap-4">
            <div className="grid gap-3 rounded-[2rem] border border-white/80 bg-white/85 p-3 text-left shadow-2xl shadow-blue-950/10 backdrop-blur md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-center">
              <BloodGroupDropdown
                value={filters.bloodGroup}
                onChange={(value) => updateFilter("bloodGroup", value)}
              />
              <StateDropdown
                value={filters.state}
                onChange={(value) => updateFilter("state", value)}
              />
              <CityDropdown
                state={filters.state}
                value={filters.city}
                onChange={(value) => updateFilter("city", value)}
              />

              <Button
                className="h-14 rounded-2xl bg-[#E74C3C] px-6 text-base text-white shadow-lg shadow-red-500/20 hover:bg-red-600"
                disabled={donorQuery.isFetching || isSearchDebouncing}
                onClick={handleFindDonors}
                type="button"
              >
                <Droplet className="h-5 w-5" />
                {donorQuery.isFetching || isSearchDebouncing
                  ? "Searching"
                  : "Find Blood"}
              </Button>
            </div>

            {validationError ? (
              <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-700">
                {validationError}
              </p>
            ) : null}
          </div>

          <DonorList
            donors={donorQuery.data ?? []}
            errorMessage={donorQuery.error?.message}
            hasSearched={hasSearched}
            isLoading={donorQuery.isFetching || isSearchDebouncing}
          />
        </div>
      </div>
    </section>
  );
}
