export function isGeolocationError(error: unknown): error is GeolocationPositionError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'number'
  );
}

export function getGeolocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === 1) {
    return 'Location permission denied';
  }

  return 'Unable to detect location';
}
