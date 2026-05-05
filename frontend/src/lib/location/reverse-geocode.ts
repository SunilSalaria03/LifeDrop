import { SelectedLocation } from '@/features/location/types/location.types';

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
  state?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
};

type NominatimResponse = {
  address?: NominatimAddress;
};

export async function reverseGeocodeLocation(
  lat: number,
  lng: number,
): Promise<SelectedLocation> {
  const searchParams = new URLSearchParams({
    format: 'json',
    lat: String(lat),
    lon: String(lng),
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${searchParams.toString()}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Nominatim API failed.');
  }

  const data = (await response.json()) as NominatimResponse;
  const address = data.address;
  const city =
    address?.city ??
    address?.town ??
    address?.village ??
    address?.municipality;

  if (!address?.state || !city) {
    throw new Error('City not found.');
  }

  return {
    country: address.country ?? 'India',
    state: address.state,
    city,
    district: address.state_district ?? address.county,
    pincode: address.postcode,
    lat,
    lng,
    source: 'gps',
  };
}
