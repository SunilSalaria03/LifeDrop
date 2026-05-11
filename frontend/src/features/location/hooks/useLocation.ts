'use client';

import { useEffect, useState } from 'react';
import { SelectedLocation } from '../types/location.types';
import {
  clearStoredLocation,
  getStoredLocation,
  saveStoredLocation,
  subscribeToLocationChanges,
} from '@/lib/location/location-storage';
import { reverseGeocodeLocation } from '@/lib/location/reverse-geocode';
import { GEOLOCATION_OPTIONS } from '../location.constants';
import {
  getGeolocationErrorMessage,
  isGeolocationError,
} from '../location.helpers';

export function useSelectedLocation() {
  const [location, setLocation] = useState<SelectedLocation | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedLocation = getStoredLocation();
    setLocation(storedLocation);

    const unsubscribe = subscribeToLocationChanges(() => {
      setLocation(getStoredLocation());
    });

    if (!storedLocation) {
      void detectCurrentLocation();
    }

    return unsubscribe;
  }, []);

  const detectCurrentLocation = async () => {
    setError('');

    if (!('geolocation' in navigator)) {
      setError('Unable to detect location');
      return false;
    }

    setIsDetecting(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            GEOLOCATION_OPTIONS,
          );
        },
      );
      const detectedLocation = await reverseGeocodeLocation(
        position.coords.latitude,
        position.coords.longitude,
      );

      saveStoredLocation(detectedLocation);
      setLocation(detectedLocation);
      return true;
    } catch (detectError) {
      const message = isGeolocationError(detectError)
        ? getGeolocationErrorMessage(detectError)
        : detectError instanceof Error && detectError.message === 'City not found.'
          ? 'Unable to detect location'
          : 'Unable to detect location';

      setError(message);
      return false;
    } finally {
      setIsDetecting(false);
    }
  };

  const clearLocation = () => {
    setError('');
    clearStoredLocation();
    setLocation(null);
  };

  return {
    location,
    isDetecting,
    error,
    detectCurrentLocation,
    clearLocation,
  };
}
