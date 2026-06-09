import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { APP_AVATAR_PATHS } from '../avatar.constants';
import { GeoPoint } from './user.schema.types';

export enum AuthProvider {
  Phone = 'phone',
  Google = 'google',
}

export enum UserRole {
  User = 'user',
  Donor = 'donor',
  Admin = 'admin',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      const safeRet = ret as Record<string, unknown>;
      safeRet.id = safeRet._id?.toString();
      delete safeRet._id;
      delete safeRet.__v;
      delete safeRet.refreshToken;
      return safeRet;
    },
  },
})
export class User {
  @Prop({ trim: true })
  name?: string;

  @Prop({ lowercase: true, trim: true })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true, default: APP_AVATAR_PATHS.other })
  avatarUrl?: string;

  @Prop({ trim: true })
  avatarKey?: string;

  @Prop({ type: String, enum: AuthProvider, required: true })
  authProvider: AuthProvider;

  @Prop({ type: String, enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Prop({ select: false })
  googleId?: string;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop({ default: false })
  isProfileCompleted: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ trim: true })
  addressText?: string;

  @Prop({ trim: true })
  addressLine?: string;

  @Prop({ trim: true })
  bloodGroup?: string;

  @Prop({ type: String, enum: Gender })
  gender?: Gender;

  @Prop()
  birthDate?: Date;

  @Prop({ min: 1 })
  weight?: number;

  @Prop()
  lastDonationDate?: Date;

  @Prop({ default: false })
  showMobile?: boolean;

  @Prop({ default: false })
  showEmail?: boolean;

  @Prop({ default: false })
  smsAlert?: boolean;

  @Prop({ trim: true })
  pincode?: string;

  @Prop({ trim: true })
  state?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  district?: string;

  @Prop({ trim: true })
  tehsil?: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
    _id: false,
  })
  location?: GeoPoint;

  @Prop({ select: false })
  refreshToken?: string;

  @Prop({ select: false })
  otpHash?: string;

  @Prop({ select: false })
  otpValidUntil?: Date;

  @Prop({ select: false })
  otpLastSentAt?: Date;

  @Prop({ select: false, default: 0 })
  otpFailedAttempts: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ isBlocked: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ bloodGroup: 1 });
UserSchema.index({ state: 1 });
UserSchema.index({ city: 1 });
UserSchema.index({ district: 1 });
UserSchema.index({ pincode: 1 });
UserSchema.index(
  { location: '2dsphere' },
  {
    sparse: true,
    partialFilterExpression: {
      location: { $exists: true },
    },
  },
);
