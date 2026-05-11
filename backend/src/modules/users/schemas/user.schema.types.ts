import { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type UserDocument = HydratedDocument<User>;

export type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};
