"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeartPulse } from "lucide-react";
import { searchDonors } from "@/features/donors/api/donors.api";
import { DonorSearchFilters } from "@/features/donors/types/donor.types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { DonorList } from "./DonorList";
import { DonorSearchFormValues, SearchBar } from "./SearchBar";

const initialFilters: DonorSearchFormValues = {
  bloodGroup: "",
  state: "",
  stateCode: "",
  city: "",
  lat: undefined,
  lng: undefined,
};

export function HeroSection() {
  const [filters, setFilters] =
    useState<DonorSearchFormValues>(initialFilters);
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
      debouncedSearchFilters?.lat ?? "",
      debouncedSearchFilters?.lng ?? "",
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

  const updateFilters = (values: DonorSearchFormValues) => {
    setValidationError("");
    setFilters(values);
  };

  const validateFilters = () => {
    if (!filters.bloodGroup) {
      setValidationError('Please select blood group before searching.');
      return false;
    }

    if (!filters.state || !filters.city) {
      setValidationError("Please select state and city / district before searching.");
      return false;
    }

    if (filters.lat === undefined || filters.lng === undefined) {
      setValidationError("Selected city coordinates were not found. Please choose another city / district.");
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
      lat: filters.lat,
      lng: filters.lng,
    });
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#fff5f5_100%)]">
      <div className="relative mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl place-items-center px-4 py-12 text-center sm:min-h-[680px] sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid w-full gap-8 sm:gap-9">
          <div className="mx-auto grid max-w-4xl gap-5">
            <p className="mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-red-100 bg-white/90 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm shadow-red-950/5">
              <HeartPulse className="h-4 w-4" />
              <span className="truncate">Emergency blood help, closer to home</span>
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-normal text-neutral-950 sm:text-5xl md:text-6xl lg:text-7xl">
              Find Blood Donors Near You Instantly
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-neutral-600 sm:text-xl sm:leading-8">
              Search by blood group and location to connect with nearby donors
              in seconds.
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-6xl gap-4">
            <SearchBar
              isSearching={donorQuery.isFetching || isSearchDebouncing}
              onChange={updateFilters}
              onSearch={handleFindDonors}
              values={filters}
            />

            {validationError ? (
              <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700 shadow-sm shadow-red-950/5 sm:text-left">
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
