import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BloodGroup } from '../../donors/schemas/donor-profile.schema';
import { User } from '../../users/schemas/user.schema';

export type BloodRequestDocument = HydratedDocument<BloodRequest>;

export enum UrgencyLevel {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Emergency = 'EMERGENCY',
}

export enum BloodRequestStatus {
  Open = 'OPEN',
  Matched = 'MATCHED',
  Contacted = 'CONTACTED',
  Fulfilled = 'FULFILLED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
}

export type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};

const GeoPointSchema = new MongooseSchema<GeoPoint>(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false },
);

@Schema({
  timestamps: true,
  collection: 'bloodrequests',
  toJSON: {
    transform: (_doc, ret) => {
      const safeRet = ret as Record<string, unknown>;
      safeRet.id = safeRet._id?.toString();
      delete safeRet._id;
      delete safeRet.__v;
      return safeRet;
    },
  },
})
export class BloodRequest {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  requesterId: Types.ObjectId;

  @Prop({ type: String, enum: BloodGroup, required: true })
  bloodGroup: BloodGroup;

  @Prop({ required: true, min: 1 })
  unitsRequired: number;

  @Prop({ trim: true })
  patientName?: string;

  @Prop({ trim: true })
  hospitalName?: string;

  @Prop({ required: true, trim: true })
  contactPhone: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ trim: true })
  district?: string;

  @Prop({ trim: true })
  addressText?: string;

  @Prop({ type: GeoPointSchema, required: true })
  location: GeoPoint;

  @Prop({ type: String, enum: UrgencyLevel, default: UrgencyLevel.Medium })
  urgencyLevel: UrgencyLevel;

  @Prop({ trim: true })
  message?: string;

  @Prop({
    type: String,
    enum: BloodRequestStatus,
    default: BloodRequestStatus.Open,
  })
  status: BloodRequestStatus;

  @Prop({ required: true })
  expiresAt: Date;
}

export const BloodRequestSchema = SchemaFactory.createForClass(BloodRequest);

BloodRequestSchema.index({ location: '2dsphere' });
BloodRequestSchema.index({ bloodGroup: 1 });
BloodRequestSchema.index({ status: 1 });
BloodRequestSchema.index({ state: 1 });
BloodRequestSchema.index({ city: 1 });
BloodRequestSchema.index({ expiresAt: 1 });
