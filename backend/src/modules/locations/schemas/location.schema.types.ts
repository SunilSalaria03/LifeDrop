import { HydratedDocument } from 'mongoose';
import { Location } from './location.schema';

export type LocationDocument = HydratedDocument<Location>;

export type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};
