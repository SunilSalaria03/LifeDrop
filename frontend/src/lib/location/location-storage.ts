import { SelectedLocation } from '@/features/location/types/location.types';
import {
  LOCATION_CHANGED_EVENT,
  LOCATION_STORAGE_KEY,
} from './location.constants';

export function getStoredLocation(): SelectedLocation | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedLocation = window.localStorage.getItem(LOCATION_STORAGE_KEY);

  if (!storedLocation) {
    return null;
  }

  try {
    return JSON.parse(storedLocation) as SelectedLocation;
  } catch {
    window.localStorage.removeItem(LOCATION_STORAGE_KEY);
    return null;
  }
}

export function saveStoredLocation(location: SelectedLocation): void {
  window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  window.dispatchEvent(new CustomEvent(LOCATION_CHANGED_EVENT));
}

export function clearStoredLocation(): void {
  window.localStorage.removeItem(LOCATION_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(LOCATION_CHANGED_EVENT));
}

export function subscribeToLocationChanges(callback: () => void): () => void {
  window.addEventListener(LOCATION_CHANGED_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(LOCATION_CHANGED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
