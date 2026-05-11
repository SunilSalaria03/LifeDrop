import { HydratedDocument } from 'mongoose';
import { DonorProfile } from './donor-profile.schema';

export type DonorProfileDocument = HydratedDocument<DonorProfile>;

export type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};
