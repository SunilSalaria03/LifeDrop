import { HydratedDocument } from 'mongoose';
import { BloodRequest } from './blood-request.schema';

export type BloodRequestDocument = HydratedDocument<BloodRequest>;
