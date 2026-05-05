export type SelectedLocation = {
  country: string;
  state: string;
  city: string;
  district?: string;
  pincode?: string;
  lat: number;
  lng: number;
  source: 'gps';
};
