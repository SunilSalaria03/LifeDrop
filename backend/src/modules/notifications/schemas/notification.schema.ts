import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BloodRequest } from '../../blood-requests/schemas/blood-request.schema';
import { User } from '../../users/schemas/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationChannel {
  Sms = 'SMS',
  Email = 'EMAIL',
  Push = 'PUSH',
  InApp = 'IN_APP',
}

export enum NotificationStatus {
  Pending = 'PENDING',
  Sent = 'SENT',
  Failed = 'FAILED',
  Skipped = 'SKIPPED',
}

@Schema({
  timestamps: true,
  collection: 'notifications',
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
export class Notification {
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: BloodRequest.name })
  bloodRequestId?: Types.ObjectId;

  @Prop({ type: String, enum: NotificationChannel, required: true })
  channel: NotificationChannel;

  @Prop({
    type: String,
    enum: NotificationStatus,
    default: NotificationStatus.Pending,
  })
  status: NotificationStatus;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ trim: true })
  recipient?: string;

  @Prop()
  sentAt?: Date;

  @Prop({ trim: true })
  failureReason?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ bloodRequestId: 1 });
NotificationSchema.index({ channel: 1 });
NotificationSchema.index({ status: 1 });
NotificationSchema.index({ createdAt: -1 });
