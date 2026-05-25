import { DonorSearchFormValues } from '@/components/landing/landing.types';
import { initialDonorSearchFilters } from '@/components/landing/landing.constants';

export type DonorSearchSource = 'home' | 'donor-list';

export type DonorSearchSession = {
  filters: DonorSearchFormValues;
  hasSearched: boolean;
  page: number;
  source: DonorSearchSource;
};

/** In-memory only — cleared on full page refresh; survives in-app navigation */
let session: DonorSearchSession | null = null;

export function getDonorSearchSession(): DonorSearchSession | null {
  return session;
}

export function setDonorSearchSession(next: DonorSearchSession): void {
  session = next;
}

export function clearDonorSearchSession(): void {
  session = null;
}

export function getLastDonorSearchBackHref(): string {
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
  return !session?.hasSearched;
}

export { initialDonorSearchFilters };
