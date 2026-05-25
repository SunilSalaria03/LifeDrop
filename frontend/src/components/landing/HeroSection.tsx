"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BannerBreadcrumbStrip } from "@/components/layout/BannerBreadcrumbStrip";
import { BreadcrumbItem } from "@/components/layout/breadcrumb.types";
import { useDonorSearch } from "@/hooks/useDonorSearch";
import bannerImage from "@/assets/images/banner.png";
import { DonorList } from "./DonorList";
import { SearchBar } from "./SearchBar";
import { getHeroBannerContent } from "./hero-banner.content";

type HeroSectionProps = {
  breadcrumb?: BreadcrumbItem[];
};

export function HeroSection({ breadcrumb }: HeroSectionProps = {}) {
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
  const isDonorListPage = pathname === "/donor-list";
  const isSearchPage = isHomeRoute || isDonorListPage;
  const searchMode = isHomeRoute ? "preview" : "paginated";

  const banner = getHeroBannerContent(pathname);
  const BadgeIcon = banner.BadgeIcon;

  const {
    filters,
    page,
    pageSize,
    hasSearched,
    validationError,
    searchResult,
    isLoading,
    errorMessage,
    updateFilters,
    handleFindDonors,
    handlePageChange,
    viewAllHref,
    mode,
  } = useDonorSearch({ mode: searchMode });

  const showViewAll =
    mode === "preview" &&
    hasSearched &&
    !isLoading &&
    searchResult.count > pageSize;

  return (
    <>
      <section className="relative min-h-[700px] overflow-hidden bg-slate-900">
        {breadcrumb && breadcrumb.length > 0 ? (
          <BannerBreadcrumbStrip items={breadcrumb} overlay />
        ) : null}

        <div className="absolute inset-y-0 right-0 hidden w-[50%] lg:block">
          <Image
            src={bannerImage}
            alt="Blood donor hero"
            fill
            priority={isHomeRoute}
            className="object-contain object-bottom opacity-85"
          />
          <div className="absolute inset-0 bg-slate-900/30" />
          <div className="absolute inset-y-0 left-0 w-64 bg-[linear-gradient(to_right,#0f172a,transparent)]" />
          <div className="absolute inset-y-0 right-0 w-16 bg-[linear-gradient(to_left,#0f172a,transparent)]" />
          <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(to_bottom,#0f172a,transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,#0f172a,transparent)]" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,1)_0%,rgba(15,23,42,1)_44%,rgba(15,23,42,0.70)_58%,rgba(15,23,42,0.25)_75%,rgba(15,23,42,0.15)_100%)]" />

        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.90),transparent)]" />

        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(15,23,42,1),transparent)]" />

        <div className="pointer-events-none absolute bottom-0 right-[22%] h-64 w-64 rounded-full bg-red-700/20 blur-3xl" />

        <div
          className={cn(
            "relative mx-auto flex min-h-[700px] max-w-7xl px-4 sm:px-6 lg:px-8",
            breadcrumb?.length
              ? "items-center py-16 pb-20 pt-24 sm:py-20 sm:pt-28 lg:py-24"
              : "items-center py-16 sm:py-20 lg:py-24",
          )}
        >
          <div className="grid w-full gap-7">
            <div className="grid max-w-2xl gap-5 md:max-w-3xl lg:max-w-[58%]">
              <p
                aria-label={banner.badgeAriaLabel}
                className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-500/40 bg-red-700/20 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-300 backdrop-blur-sm sm:px-4 sm:tracking-[0.14em]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
                  <BadgeIcon className="h-4 w-4" />
                </span>
                {banner.badgeText}
              </p>
              <h1 className="text-balance text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl">
                {banner.titleBefore}
                <span className="text-red-400">{banner.titleHighlight}</span>
                {banner.titleMiddle}
                {banner.titleHighlight2 ? (
                  <span className="text-red-400">{banner.titleHighlight2}</span>
                ) : null}
                {banner.titleAfter}
              </h1>
              {banner.steps.length > 0 || banner.footnote ? (
                <div
                  className="w-full max-w-2xl min-w-0 sm:max-w-3xl"
                  role="group"
                  aria-label={banner.stepsGroupAriaLabel}
                >
                  {banner.steps.length > 0 ? (
                    <div
                      role="list"
                      className="flex w-full min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
                    >
                      {banner.steps.map((step, index) => {
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
                              <span className="whitespace-nowrap text-[0.72rem] font-normal capitalize leading-none tracking-wide text-white/95 sm:text-sm">
                                {step.label}
                              </span>
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>
                  ) : null}
                  {banner.footnote ? (
                    <p
                      className={`flex items-start gap-2 text-xs font-normal leading-relaxed text-slate-300/95 sm:text-sm${banner.steps.length > 0 ? " mt-3 sm:mt-3.5" : ""}`}
                    >
                      <Sparkles
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/90 sm:h-4 sm:w-4"
                        aria-hidden
                      />
                      <span>{banner.footnote}</span>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            {isSearchPage ? (
              <div
                className="scroll-mt-20 grid w-full gap-4 rounded-4xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:scroll-mt-24 sm:p-4"
                id="landing-donor-search"
              >
                <SearchBar
                  isSearching={isLoading}
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
            ) : null}
          </div>
        </div>
      </section>

      {hasSearched ? (
        <section
          className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
          id="donor-search-results"
        >
          <div className="mx-auto max-w-6xl">
            <DonorList
              donors={searchResult.items}
              errorMessage={errorMessage}
              hasSearched={hasSearched}
              isLoading={isLoading}
              mode={mode}
              onPageChange={
                mode === "paginated" ? handlePageChange : undefined
              }
              page={page}
              pageSize={pageSize}
              showViewAll={showViewAll}
              totalCount={searchResult.count}
              totalPages={searchResult.totalPages}
              viewAllHref={viewAllHref}
            />
          </div>
        </section>
      ) : null}
    </>
  );
}
