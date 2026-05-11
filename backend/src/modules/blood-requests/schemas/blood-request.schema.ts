import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BloodGroup } from '../../donors/schemas/donor-profile.schema';
import { User } from '../../users/schemas/user.schema';

export enum BloodRequestStatus {
  Pending = 'pending',
  Sent = 'sent',
  Failed = 'failed',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Expired = 'expired',
}

export enum SmsStatus {
  Pending = 'pending',
  Sent = 'sent',
  Failed = 'failed',
}

export enum WhatsappStatus {
  Pending = 'pending',
  Sent = 'sent',
  Failed = 'failed',
  Skipped = 'skipped',
}

export enum WhatsappProvider {
  Twilio = 'twilio',
}

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

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  donorId: Types.ObjectId;

  @Prop({ type: String, enum: BloodGroup, required: true })
  bloodGroup: BloodGroup;

  @Prop({
    type: String,
    enum: BloodRequestStatus,
    default: BloodRequestStatus.Pending,
  })
  status: BloodRequestStatus;

  @Prop({ default: true })
  sendSms: boolean;

  @Prop({ required: true })
  consentToShareContact: boolean;

  @Prop({ type: String, enum: SmsStatus, default: SmsStatus.Pending })
  smsStatus: SmsStatus;

  @Prop({ trim: true })
  smsProvider?: string;

  @Prop({ trim: true })
  smsProviderMessageId?: string;

  @Prop({ trim: true })
  smsError?: string;

  @Prop({ default: false })
  sendWhatsapp: boolean;

  @Prop({
    type: String,
    enum: WhatsappStatus,
    default: WhatsappStatus.Skipped,
  })
  whatsappStatus: WhatsappStatus;

  @Prop({ type: String, enum: WhatsappProvider })
  whatsappProvider?: WhatsappProvider;

  @Prop({ trim: true })
  whatsappProviderMessageId?: string;

  @Prop({ trim: true })
  whatsappError?: string;

  @Prop({ trim: true, maxlength: 500 })
  message?: string;
}

export const BloodRequestSchema = SchemaFactory.createForClass(BloodRequest);

BloodRequestSchema.index({ requesterId: 1 });
BloodRequestSchema.index({ donorId: 1 });
BloodRequestSchema.index({ bloodGroup: 1 });
BloodRequestSchema.index({ status: 1 });
BloodRequestSchema.index({ smsStatus: 1 });
BloodRequestSchema.index({ whatsappStatus: 1 });
BloodRequestSchema.index({ createdAt: -1 });
