'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { searchDonors } from '@/features/donors/api/donors.api';
import {
  DonorSearchFilters,
  DonorSearchResponse,
} from '@/features/donors/types/donor.types';
import { initialDonorSearchFilters } from '@/components/landing/landing.constants';
import { DonorSearchFormValues } from '@/components/landing/landing.types';
import {
  DONOR_LIST_PATH,
  DonorSearchSession,
  getDonorSearchSession,
  setDonorSearchSession,
} from '@/lib/donor-search/donor-search-session';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export type DonorSearchMode = 'preview' | 'paginated';

const EMPTY_RESPONSE: DonorSearchResponse = {
  items: [],
  count: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
  radiusKm: 50,
};

type UseDonorSearchOptions = {
  mode: DonorSearchMode;
  /** When false, skip session restore and search API (banner-only pages) */
  enabled?: boolean;
};

type RestoredSearchState = {
  filters: DonorSearchFormValues;
  page: number;
  hasSearched: boolean;
  searchRequest: DonorSearchFilters;
};

function scrollToSearchResults() {
  requestAnimationFrame(() => {
    document
      .getElementById('donor-search-results')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function restoreSearchFromSession(
  mode: DonorSearchMode,
  isDonorListPage: boolean,
): RestoredSearchState | null {
  const stored = getDonorSearchSession();

  if (!stored?.hasSearched) {
    return null;
  }

  const page = mode === 'paginated' ? stored.page : 1;
  const limit = mode === 'paginated' ? 12 : 6;

  return {
    filters: stored.filters,
    page,
    hasSearched: true,
    searchRequest: {
      bloodGroup: stored.filters.bloodGroup,
      lat: stored.filters.lat,
      lng: stored.filters.lng,
      page,
      limit,
    },
  };
}

function persistSearchSession(
  values: DonorSearchFormValues,
  page: number,
  source: DonorSearchSession['source'],
): void {
  setDonorSearchSession({
    filters: values,
    hasSearched: true,
    page,
    source,
  });
}

export function useDonorSearch({
  mode,
  enabled = true,
}: UseDonorSearchOptions) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHomePage = pathname === '/';
  const isDonorListPage = pathname === DONOR_LIST_PATH;
  const isSearchPage = isHomePage || isDonorListPage;
  const pageSize = mode === 'paginated' ? 12 : 6;

  const [filters, setFilters] = useState<DonorSearchFormValues>(
    initialDonorSearchFilters,
  );
  const [page, setPage] = useState(1);
  const [searchRequest, setSearchRequest] = useState<DonorSearchFilters | null>(
    null,
  );
  const [validationError, setValidationError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const strippedLegacyQueryRef = useRef(false);
  const restoredFromStorageRef = useRef(false);

  const debouncedSearchRequest = useDebouncedValue(searchRequest, 450);

  const queryKey = useMemo(
    () => [
      'donor-search',
      mode,
      debouncedSearchRequest?.bloodGroup ?? '',
      debouncedSearchRequest?.lat ?? '',
      debouncedSearchRequest?.lng ?? '',
      debouncedSearchRequest?.page ?? 1,
      debouncedSearchRequest?.limit ?? pageSize,
    ],
    [debouncedSearchRequest, mode, pageSize],
  );

  const donorQuery = useQuery({
    enabled: Boolean(debouncedSearchRequest),
    queryKey,
    queryFn: () =>
      searchDonors(debouncedSearchRequest as DonorSearchFilters),
    retry: 1,
    staleTime: 60_000,
  });

  const isSearchDebouncing = Boolean(
    searchRequest && searchRequest !== debouncedSearchRequest,
  );

  const searchResult = donorQuery.data ?? EMPTY_RESPONSE;

  const runSearchWithValues = useCallback(
    (values: DonorSearchFormValues, nextPage = 1) => {
      if (!enabled) {
        return;
      }

      const effectivePage = isDonorListPage ? nextPage : 1;

      setHasSearched(true);
      setPage(effectivePage);
      setSearchRequest({
        bloodGroup: values.bloodGroup,
        lat: values.lat,
        lng: values.lng,
        page: effectivePage,
        limit: pageSize,
      });

      persistSearchSession(
        values,
        effectivePage,
        isDonorListPage ? 'donor-list' : 'home',
      );
    },
    [enabled, isDonorListPage, pageSize],
  );

  const validateFilters = useCallback(() => {
    if (!filters.bloodGroup) {
      setValidationError('Please select blood group before searching.');
      return false;
    }

    if (!filters.state || !filters.city) {
      setValidationError(
        'Please select state and city / district before searching.',
      );
      return false;
    }

    if (filters.lat === undefined || filters.lng === undefined) {
      setValidationError(
        'Selected city coordinates were not found. Please choose another city / district.',
      );
      return false;
    }

    setValidationError('');
    return true;
  }, [filters]);

  const handleFindDonors = useCallback(() => {
    if (!validateFilters()) {
      return;
    }

    runSearchWithValues(filters, 1);
  }, [filters, runSearchWithValues, validateFilters]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (!validateFilters()) {
        return;
      }

      const totalPages = searchResult.totalPages;
      const clampedPage =
        totalPages > 0
          ? Math.min(Math.max(1, nextPage), totalPages)
          : Math.max(1, nextPage);

      runSearchWithValues(filters, clampedPage);

      if (isDonorListPage) {
        scrollToSearchResults();
      }
    },
    [
      filters,
      isDonorListPage,
      runSearchWithValues,
      searchResult.totalPages,
      validateFilters,
    ],
  );

  const updateFilters = useCallback((values: DonorSearchFormValues) => {
    setValidationError('');
    setFilters(values);

    const stored = getDonorSearchSession();

    if (stored?.hasSearched) {
      setDonorSearchSession({
        ...stored,
        filters: values,
      });
    }
  }, []);

  /** Restore search from sessionStorage after refresh (same tab) */
  useEffect(() => {
    if (!enabled || restoredFromStorageRef.current) {
      return;
    }

    restoredFromStorageRef.current = true;

    const restored = restoreSearchFromSession(mode, isDonorListPage);

    if (!restored) {
      return;
    }

    setFilters(restored.filters);
    setValidationError('');
    setHasSearched(true);
    setPage(restored.page);
    setSearchRequest(restored.searchRequest);
  }, [enabled, isDonorListPage, mode]);

  const viewAllHref = DONOR_LIST_PATH;

  /** Remove legacy query-string search params from the address bar */
  useEffect(() => {
    if (!enabled || !isSearchPage || strippedLegacyQueryRef.current) {
      return;
    }

    strippedLegacyQueryRef.current = true;

    if (searchParams.toString()) {
      router.replace(pathname, { scroll: false });
    }
  }, [enabled, isSearchPage, pathname, router, searchParams]);

  /** When opening donor-list from home, mark session source for back navigation */
  useEffect(() => {
    if (!enabled || !isDonorListPage || !hasSearched) {
      return;
    }

    const stored = getDonorSearchSession();

    if (stored && stored.source !== 'donor-list') {
      setDonorSearchSession({
        ...stored,
        source: 'donor-list',
        page: stored.page || page,
      });
    }
  }, [enabled, hasSearched, isDonorListPage, page]);

  return {
    filters,
    page: searchResult.page || page,
    pageSize,
    hasSearched,
    validationError,
    searchResult,
    isLoading: donorQuery.isFetching || isSearchDebouncing,
    errorMessage: donorQuery.error?.message,
    updateFilters,
    handleFindDonors,
    handlePageChange,
    viewAllHref,
    mode,
  };
}
