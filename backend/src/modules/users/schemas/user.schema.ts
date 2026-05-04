import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum AuthProvider {
  Phone = 'phone',
  Google = 'google'
}

export enum UserRole {
  User = 'user',
  Donor = 'donor',
  Admin = 'admin'
}

export type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};

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
    }
  }
})
export class User {
  @Prop({ trim: true })
  name?: string;

  @Prop({ lowercase: true, trim: true })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  profileImage?: string;

  @Prop({ type: String, enum: AuthProvider, required: true })
  authProvider: AuthProvider;

  @Prop({ type: String, enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Prop({ select: false })
  googleId?: string;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  isProfileCompleted: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    },
    _id: false
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
UserSchema.index(
  { location: '2dsphere' },
  {
    sparse: true,
    partialFilterExpression: {
      location: { $exists: true }
    }
  }
);
