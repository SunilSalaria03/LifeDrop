"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeartPulse } from "lucide-react";
import { searchDonors } from "@/features/donors/api/donors.api";
import { DonorSearchFilters } from "@/features/donors/types/donor.types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import bannerImage from "@/assets/images/banner.png";
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
    <>
      {/* ── Dark hero: banner image + headline + search ── */}
      <section className="relative min-h-[700px] overflow-hidden bg-slate-900">
      {/* ── Illustration panel: right 50%, desktop only ── */}
      <div className="absolute inset-y-0 right-0 hidden w-[50%] lg:block">
        <Image
          src={bannerImage}
          alt="Blood donor hero"
          fill
          priority
          className="object-contain object-bottom opacity-85"
        />
        {/* Dark tint to kill the white-background glow */}
        <div className="absolute inset-0 bg-slate-900/30" />
        {/* Left edge: wide fade so illustration bleeds in naturally */}
        <div className="absolute inset-y-0 left-0 w-64 bg-[linear-gradient(to_right,#0f172a,transparent)]" />
        {/* Right edge: remove hard white corner */}
        <div className="absolute inset-y-0 right-0 w-16 bg-[linear-gradient(to_left,#0f172a,transparent)]" />
        {/* Top edge: hides any white bleed at the top */}
        <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(to_bottom,#0f172a,transparent)]" />
        {/* Bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,#0f172a,transparent)]" />
      </div>

      {/* ── Main dark overlay: text panel solid, fades toward illustration ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,1)_0%,rgba(15,23,42,1)_44%,rgba(15,23,42,0.70)_58%,rgba(15,23,42,0.25)_75%,rgba(15,23,42,0.15)_100%)]" />

      {/* ── Full-section top gradient: header area always dark ── */}
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.90),transparent)]" />

      {/* ── Full-section bottom fade into next section ── */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(15,23,42,1),transparent)]" />

      {/* ── Red ambient glow near feet of figure ── */}
      <div className="pointer-events-none absolute bottom-0 right-[22%] h-64 w-64 rounded-full bg-red-700/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid w-full gap-7">

            {/* Badge + headline + subtitle — left-anchored to left column */}
            <div className="grid max-w-2xl gap-5 lg:max-w-[52%]">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-4 py-2 text-sm font-semibold text-red-300 backdrop-blur-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
                  <HeartPulse className="h-4 w-4" />
                </span>
                Emergency blood help, closer to home
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Find Blood Donors{" "}
                <span className="text-red-400">Near You</span>{" "}
                Instantly
              </h1>
              <p className="max-w-lg text-base font-medium leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Search by blood group and location to connect with nearby donors in seconds.
              </p>
            </div>

            {/* Search form — full width */}
            <div className="grid w-full gap-4 rounded-4xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-4">
              <SearchBar
                isSearching={donorQuery.isFetching || isSearchDebouncing}
                onChange={updateFilters}
                onSearch={handleFindDonors}
                values={filters}
              />
              {validationError ? (
                <p className="rounded-2xl border border-red-500/30 bg-red-950/60 px-4 py-3 text-sm font-semibold text-red-300 sm:text-left">
                  {validationError}
                </p>
              ) : null}
            </div>

          </div>
        </div>
      </section>

      {/* ── Search results: white background, outside the banner ── */}
      {hasSearched && (
        <section className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <DonorList
              donors={donorQuery.data ?? []}
              errorMessage={donorQuery.error?.message}
              hasSearched={hasSearched}
              isLoading={donorQuery.isFetching || isSearchDebouncing}
            />
          </div>
        </section>
      )}
    </>
  );
}
