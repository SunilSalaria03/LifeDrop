import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GeoPoint } from './location.schema.types';

@Schema({
  timestamps: true,
  collection: 'locations',
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
export class Location {
  @Prop({ required: true, trim: true, default: 'India' })
  country: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  district: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ trim: true })
  pincode?: string;

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

  @Prop({ default: true })
  isActive: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.index({ state: 1 });
LocationSchema.index({ district: 1 });
LocationSchema.index({ city: 1 });
LocationSchema.index({ pincode: 1 });
LocationSchema.index(
  { location: '2dsphere' },
  {
    sparse: true,
    partialFilterExpression: {
      location: { $exists: true },
    },
  },
);
LocationSchema.index(
  { country: 1, state: 1, district: 1, city: 1, pincode: 1 },
  { unique: true },
);
