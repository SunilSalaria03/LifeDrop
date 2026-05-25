import { DonorSearchFormValues } from '@/components/landing/landing.types';
import { initialDonorSearchFilters } from '@/components/landing/landing.constants';

export const DONOR_SEARCH_STORAGE_KEY = 'lifedrop:donor-search';

export type DonorSearchSource = 'home' | 'donor-list';

export type DonorSearchSession = {
  filters: DonorSearchFormValues;
  hasSearched: boolean;
  page: number;
  source: DonorSearchSource;
};

/** Fast read path after first load in this tab */
let memoryCache: DonorSearchSession | null = null;

function isValidSession(data: unknown): data is DonorSearchSession {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const session = data as DonorSearchSession;

  return (
    session.hasSearched === true &&
    hasValidDonorSearchFilters(session.filters) &&
    Number.isFinite(session.page) &&
    session.page >= 1 &&
    (session.source === 'home' || session.source === 'donor-list')
  );
}

function readFromSessionStorage(): DonorSearchSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(DONOR_SEARCH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isValidSession(parsed)) {
      sessionStorage.removeItem(DONOR_SEARCH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(DONOR_SEARCH_STORAGE_KEY);
    return null;
  }
}

export function getDonorSearchSession(): DonorSearchSession | null {
  if (memoryCache) {
    return memoryCache;
  }

  const stored = readFromSessionStorage();
  memoryCache = stored;

  return stored;
}

export function setDonorSearchSession(next: DonorSearchSession): void {
  memoryCache = next;

  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(DONOR_SEARCH_STORAGE_KEY, JSON.stringify(next));
}

export function clearDonorSearchSession(): void {
  memoryCache = null;

  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(DONOR_SEARCH_STORAGE_KEY);
}

export function getLastDonorSearchBackHref(): string {
  const session = getDonorSearchSession();

  if (!session?.hasSearched) {
    return '/';
  }

  return session.source === 'donor-list' ? '/donor-list' : '/';
}

export const DONOR_LIST_PATH = '/donor-list';

export function hasValidDonorSearchFilters(
  values: DonorSearchFormValues,
): boolean {
  return Boolean(
    values.bloodGroup &&
      values.state &&
      values.city &&
      values.lat !== undefined &&
      values.lng !== undefined,
  );
}

export function isEmptyDonorSearchSession(): boolean {
  return !getDonorSearchSession()?.hasSearched;
}

export { initialDonorSearchFilters };
