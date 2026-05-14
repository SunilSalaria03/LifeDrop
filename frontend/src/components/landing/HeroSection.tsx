"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeartPulse } from "lucide-react";
import { searchDonors } from "@/features/donors/api/donors.api";
import { DonorSearchFilters } from "@/features/donors/types/donor.types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import bannerImage from "@/assets/images/banner-image.webp";
import { initialDonorSearchFilters } from "./landing.constants";
import { DonorList } from "./DonorList";
import { SearchBar } from "./SearchBar";
import { DonorSearchFormValues } from "./landing.types";

export function HeroSection() {
  const [filters, setFilters] =
    useState<DonorSearchFormValues>(initialDonorSearchFilters);
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
    <section className="relative overflow-hidden bg-slate-900">
      {/* Banner image */}
      <Image
        src={bannerImage}
        alt=""
        fill
        priority
        className="object-cover object-center opacity-[0.13] mix-blend-luminosity"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.97)_0%,rgba(15,23,42,0.88)_55%,rgba(127,29,29,0.50)_100%)]" />
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -right-48 -top-48 h-144 w-xl rounded-full bg-red-700/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-red-900/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl place-items-center px-4 py-14 text-center sm:min-h-[700px] sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid w-full gap-9 sm:gap-10 lg:gap-12">
          <div className="mx-auto grid max-w-4xl gap-5 sm:gap-6">
            <p className="mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-4 py-2 text-sm font-semibold text-red-300 backdrop-blur-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
                <HeartPulse className="h-4 w-4" />
              </span>
              <span className="truncate">Emergency blood help, closer to home</span>
            </p>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Find Blood Donors{" "}
              <span className="text-red-400">Near You</span>{" "}
              Instantly
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium leading-7 text-slate-300 sm:text-xl sm:leading-8">
              Search by blood group and location to connect with nearby donors
              in seconds.
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-6xl gap-4 rounded-4xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-4">
            <SearchBar
              isSearching={donorQuery.isFetching || isSearchDebouncing}
              onChange={updateFilters}
              onSearch={handleFindDonors}
              values={filters}
            />

            {validationError ? (
              <p className="rounded-2xl border border-red-500/30 bg-red-950/60 px-4 py-3 text-center text-sm font-semibold text-red-300 shadow-sm sm:text-left">
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
