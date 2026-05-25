import { DonorSearchFormValues } from '@/components/landing/landing.types';
import { bloodGroups } from '@/lib/constants/locations';

const BLOOD_GROUP_SET = new Set<string>(bloodGroups);

export const LAST_DONOR_SEARCH_STORAGE_KEY = 'lifedrop:last-donor-search';

export type DonorSearchUrlState = DonorSearchFormValues & {
  page: number;
};

export type DonorSearchSource = 'home' | 'donor-list';

type StoredDonorSearch = {
  query: string;
  source: DonorSearchSource;
};

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
}

function parseCoordinate(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseDonorSearchFromSearchParams(
  params: URLSearchParams,
): DonorSearchUrlState | null {
  const bloodGroup = params.get('bloodGroup')?.trim() ?? '';

  if (!BLOOD_GROUP_SET.has(bloodGroup)) {
    return null;
  }

  const stateCode = params.get('stateCode')?.trim() ?? '';
  const state = params.get('state')?.trim() ?? '';
  const city = params.get('city')?.trim() ?? '';
  const lat = parseCoordinate(params.get('lat'));
  const lng = parseCoordinate(params.get('lng'));

  if (!stateCode || !state || !city || lat === undefined || lng === undefined) {
    return null;
  }

  return {
    bloodGroup,
    stateCode,
    state,
    city,
    lat,
    lng,
    page: parsePositiveInt(params.get('page'), 1),
  };
}

export function donorSearchToQueryString(
  values: DonorSearchFormValues,
  page = 1,
): string {
  const searchParams = new URLSearchParams({
    bloodGroup: values.bloodGroup,
    stateCode: values.stateCode,
    state: values.state,
    city: values.city,
    lat: String(values.lat),
    lng: String(values.lng),
    page: String(Math.max(1, page)),
  });

  return searchParams.toString();
}

export function buildHomeSearchUrl(
  values: DonorSearchFormValues,
  page = 1,
): string {
  return `/?${donorSearchToQueryString(values, page)}`;
}

export function buildDonorListUrl(
  values: DonorSearchFormValues,
  page = 1,
): string {
  return `/donor-list?${donorSearchToQueryString(values, page)}`;
}

export function saveLastDonorSearch(
  values: DonorSearchFormValues,
  page: number,
  source: DonorSearchSource,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const stored: StoredDonorSearch = {
    query: donorSearchToQueryString(values, page),
    source,
  };

  sessionStorage.setItem(
    LAST_DONOR_SEARCH_STORAGE_KEY,
    JSON.stringify(stored),
  );
}

export function getLastDonorSearchBackHref(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  try {
    const raw = sessionStorage.getItem(LAST_DONOR_SEARCH_STORAGE_KEY);

    if (!raw) {
      return '/';
    }

    const stored = JSON.parse(raw) as StoredDonorSearch;
    const parsed = parseDonorSearchFromSearchParams(
      new URLSearchParams(stored.query),
    );

    if (!parsed) {
      return '/';
    }

    if (stored.source === 'donor-list') {
      return `/donor-list?${stored.query}`;
    }

    return `/?${stored.query}`;
  } catch {
    return '/';
  }
}
