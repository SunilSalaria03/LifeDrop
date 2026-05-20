"use client";

import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Droplet,
  HeartPulse,
  MapPin,
  Sparkles,
  UserSearch,
} from "lucide-react";
import { searchDonors } from "@/features/donors/api/donors.api";
import { DonorSearchFilters } from "@/features/donors/types/donor.types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import bannerImage from "@/assets/images/banner.png";
import { initialDonorSearchFilters } from "./landing.constants";
import { DonorList } from "./DonorList";
import { SearchBar } from "./SearchBar";
import { DonorSearchFormValues } from "./landing.types";

type HeroSearchStep = {
  label: string;
  Icon: LucideIcon;
};

const HERO_SEARCH_STEPS: HeroSearchStep[] = [
  { label: "Blood group", Icon: Droplet },
  { label: "State", Icon: MapPin },
  { label: "City / area", Icon: Building2 },
  { label: "Search donors", Icon: UserSearch },
];

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
            <div className="grid max-w-2xl gap-5 md:max-w-3xl lg:max-w-[58%]">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-4 py-2 text-sm font-semibold text-red-300 backdrop-blur-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
                  <HeartPulse className="h-4 w-4" />
                </span>
                Urgent blood needs. Local donor search
              </p>
              <h1 className="text-balance text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl">
                Search donors{" "}
                <span className="text-red-400">by blood group and location</span>{" "}
                across your city
              </h1>
              <div
                className="w-full max-w-2xl min-w-0 sm:max-w-3xl"
                role="group"
                aria-label="How search works: choose blood group, then state, then city or area, run search donors, then contact donors from the results."
              >
                <div
                  role="list"
                  className="flex w-full min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
                >
                  {HERO_SEARCH_STEPS.map((step, index) => {
                    const StepIcon = step.Icon;
                    return (
                      <Fragment key={step.label}>
                        {index > 0 ? (
                          <span
                            aria-hidden
                            className="h-px w-2.5 shrink-0 self-center bg-gradient-to-r from-transparent via-white/35 to-transparent sm:w-4"
                          />
                        ) : null}
                        <div
                          role="listitem"
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-white/20 bg-transparent px-2 py-1 shadow-sm shadow-black/25 sm:gap-2 sm:rounded-[1.1rem] sm:px-2.5 sm:py-1.5"
                        >
                          <StepIcon
                            className="h-3 w-3 shrink-0 text-white/85 sm:h-3.5 sm:w-3.5"
                            aria-hidden
                            strokeWidth={2}
                          />
                          <span className="whitespace-nowrap text-[0.72rem] font-normal lowercase leading-none tracking-wide text-white/95 sm:text-sm">
                            {step.label}
                          </span>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
                <p className="mt-3 flex items-start gap-2 text-xs font-normal leading-relaxed text-slate-300/95 sm:mt-3.5 sm:text-sm">
                  <Sparkles
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/90 sm:h-4 sm:w-4"
                    aria-hidden
                  />
                  <span>
                    Then contact donors who appear in your results
                  </span>
                </p>
              </div>
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
