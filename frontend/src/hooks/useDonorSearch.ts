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
  buildDonorListUrl,
  buildHomeSearchUrl,
  donorSearchToQueryString,
  parseDonorSearchFromSearchParams,
  saveLastDonorSearch,
} from '@/lib/navigation/donor-search-params';
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
};

function scrollToSearchResults() {
  requestAnimationFrame(() => {
    document
      .getElementById('donor-search-results')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

export function useDonorSearch({ mode }: UseDonorSearchOptions) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHomePage = pathname === '/';
  const isDonorListPage = pathname === '/donor-list';
  const shouldSyncUrl = isHomePage || isDonorListPage;
  const pageSize = mode === 'preview' ? 6 : 12;

  const [filters, setFilters] =
    useState<DonorSearchFormValues>(initialDonorSearchFilters);
  const [page, setPage] = useState(1);
  const [searchRequest, setSearchRequest] = useState<DonorSearchFilters | null>(
    null,
  );
  const [validationError, setValidationError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const skipUrlHydrationRef = useRef<string | null>(null);

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
      const urlPage = isDonorListPage ? nextPage : 1;
      const urlKey = donorSearchToQueryString(values, urlPage);

      setHasSearched(true);
      setPage(urlPage);
      setSearchRequest({
        bloodGroup: values.bloodGroup,
        lat: values.lat,
        lng: values.lng,
        page: urlPage,
        limit: pageSize,
      });

      saveLastDonorSearch(
        values,
        urlPage,
        isDonorListPage ? 'donor-list' : 'home',
      );

      if (shouldSyncUrl) {
        skipUrlHydrationRef.current = urlKey;
        const href = isDonorListPage
          ? buildDonorListUrl(values, urlPage)
          : buildHomeSearchUrl(values, 1);

        router.replace(href, { scroll: false });
      }
    },
    [isDonorListPage, pageSize, router, shouldSyncUrl],
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
  }, []);

  const viewAllHref = useMemo(() => {
    if (
      !filters.bloodGroup ||
      filters.lat === undefined ||
      filters.lng === undefined
    ) {
      return buildDonorListUrl(initialDonorSearchFilters, 1);
    }

    return buildDonorListUrl(filters, 1);
  }, [filters]);

  useEffect(() => {
    if (!shouldSyncUrl) {
      return;
    }

    const urlKey = searchParams.toString();

    if (skipUrlHydrationRef.current === urlKey) {
      skipUrlHydrationRef.current = null;
      return;
    }

    const parsed = parseDonorSearchFromSearchParams(searchParams);

    if (!parsed) {
      return;
    }

    const { page: urlPage, ...formValues } = parsed;
    const effectivePage = isDonorListPage ? urlPage : 1;

    setFilters(formValues);
    setValidationError('');
    setHasSearched(true);
    setPage(effectivePage);
    setSearchRequest({
      bloodGroup: formValues.bloodGroup,
      lat: formValues.lat,
      lng: formValues.lng,
      page: effectivePage,
      limit: pageSize,
    });

    if (isHomePage) {
      scrollToSearchResults();
    }
  }, [isDonorListPage, isHomePage, pageSize, searchParams, shouldSyncUrl]);

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
