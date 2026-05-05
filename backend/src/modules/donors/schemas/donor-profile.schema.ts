import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type DonorProfileDocument = HydratedDocument<DonorProfile>;

export enum BloodGroup {
  APositive = 'A+',
  ANegative = 'A-',
  BPositive = 'B+',
  BNegative = 'B-',
  ABPositive = 'AB+',
  ABNegative = 'AB-',
  OPositive = 'O+',
  ONegative = 'O-',
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
  collection: 'donorprofiles',
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
export class DonorProfile {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: BloodGroup, required: true })
  bloodGroup: BloodGroup;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  alternatePhone?: string;

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

  @Prop()
  lastDonationDate?: Date;

  @Prop()
  nextEligibleDate?: Date;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 0, min: 0 })
  totalDonations: number;
}

export const DonorProfileSchema = SchemaFactory.createForClass(DonorProfile);

DonorProfileSchema.index({ userId: 1 }, { unique: true });
DonorProfileSchema.index({ location: '2dsphere' });
DonorProfileSchema.index({ bloodGroup: 1 });
DonorProfileSchema.index({ state: 1 });
DonorProfileSchema.index({ city: 1 });
DonorProfileSchema.index({ district: 1 });
DonorProfileSchema.index({ isAvailable: 1 });
DonorProfileSchema.index({ isActive: 1 });
DonorProfileSchema.index({ isVerified: 1 });
