"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BannerBreadcrumbStrip } from "@/components/layout/BannerBreadcrumbStrip";
import { BreadcrumbItem } from "@/components/layout/breadcrumb.types";
import { useDonorSearch } from "@/hooks/useDonorSearch";
import { DonorList } from "./DonorList";
import { HeroBannerHeading } from "./HeroBannerHeading";
import { HeroBannerShell } from "./HeroBannerShell";
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
  const bannerSize = isSearchPage ? "tall" : "compact";
  const searchMode = isHomeRoute ? "preview" : "paginated";

  const banner = getHeroBannerContent(pathname);

  const {
    filters,
    page,
    pageSize,
    hasSearched,
    showResultsSection,
    showDonorSkeletons,
    isSearchInProgress,
    validationError,
    searchResult,
    isLoading,
    errorMessage,
    updateFilters,
    handleFindDonors,
    handlePageChange,
    viewAllHref,
    mode,
  } = useDonorSearch({ mode: searchMode, enabled: isSearchPage });

  const showViewAll =
    mode === "preview" &&
    hasSearched &&
    !isLoading &&
    searchResult.count > pageSize;

  return (
    <>
      {breadcrumb && breadcrumb.length > 0 ? (
        <BannerBreadcrumbStrip items={breadcrumb} overlay />
      ) : null}

      <HeroBannerShell
        contentClassName={cn(
          "flex-col justify-center",
          bannerSize === "compact"
            ? "py-8 sm:py-10 lg:py-12"
            : breadcrumb?.length
              ? "py-16 pb-20 pt-24 sm:py-20 sm:pt-28 lg:py-24"
              : "py-16 sm:py-20 lg:py-24",
        )}
        imageAlt="Blood donor hero"
        imagePriority={isHomeRoute}
        size={bannerSize}
      >
        <div
          className={cn(
            "grid w-full",
            bannerSize === "compact" ? "gap-4" : "gap-7",
          )}
        >
          <HeroBannerHeading banner={banner} size={bannerSize}>
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
                              className={cn(
                                "inline-flex shrink-0 items-center rounded-2xl border border-white/20 bg-white/[0.03] shadow-sm shadow-black/20 backdrop-blur-sm",
                                bannerSize === "compact"
                                  ? "gap-1.5 px-2.5 py-1"
                                  : "gap-1.5 px-2 py-1 sm:gap-2 sm:px-2.5 sm:py-1.5",
                              )}
                            >
                              <StepIcon
                                className={cn(
                                  "shrink-0 text-white/80",
                                  bannerSize === "compact"
                                    ? "h-3 w-3"
                                    : "h-3 w-3 sm:h-3.5 sm:w-3.5",
                                )}
                                aria-hidden
                                strokeWidth={2}
                              />
                              <span
                                className={cn(
                                  "whitespace-nowrap capitalize leading-none text-white/95",
                                  bannerSize === "compact"
                                    ? "text-xs font-medium tracking-normal"
                                    : "text-[0.72rem] sm:text-sm",
                                )}
                              >
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
                      className={cn(
                        "flex items-start gap-2 leading-relaxed text-slate-300/95",
                        bannerSize === "compact"
                          ? "text-xs font-normal sm:text-sm"
                          : "text-xs sm:text-sm",
                        banner.steps.length > 0 &&
                          (bannerSize === "compact"
                            ? "mt-2 sm:mt-2.5"
                            : "mt-3 sm:mt-3.5"),
                      )}
                    >
                      <Sparkles
                        className={cn(
                          "mt-0.5 shrink-0 text-amber-300/90",
                          bannerSize === "compact"
                            ? "h-3 w-3 sm:h-3.5 sm:w-3.5"
                            : "h-3.5 w-3.5 sm:h-4 sm:w-4",
                        )}
                        aria-hidden
                      />
                      <span>{banner.footnote}</span>
                    </p>
                  ) : null}
                </div>
              ) : null}
          </HeroBannerHeading>

            {isSearchPage ? (
              <div
                className="scroll-mt-20 grid w-full gap-4 rounded-4xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:scroll-mt-24 sm:p-4"
                id="landing-donor-search"
              >
                <SearchBar
                  isSearching={isSearchInProgress}
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
      </HeroBannerShell>

      {showResultsSection ? (
        <section
          className="min-h-[28rem] bg-white px-4 py-10 sm:min-h-[32rem] sm:px-6 sm:py-12 lg:px-8 lg:py-16"
          id="donor-search-results"
        >
          <div className="mx-auto max-w-6xl">
            <DonorList
              donors={searchResult.items}
              errorMessage={errorMessage}
              hasSearched={hasSearched}
              isLoading={showDonorSkeletons}
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
