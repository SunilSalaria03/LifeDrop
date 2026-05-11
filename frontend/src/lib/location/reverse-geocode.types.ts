export type NominatimAddress = {
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

export type NominatimResponse = {
  address?: NominatimAddress;
};
