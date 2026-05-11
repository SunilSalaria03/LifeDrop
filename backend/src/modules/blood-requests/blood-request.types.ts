import {
  BloodRequestStatus,
  SmsStatus,
  WhatsappProvider,
  WhatsappStatus,
} from './schemas/blood-request.schema';
import { BloodRequestDocument } from './schemas/blood-request.schema.types';

export type SmsAlertResult = {
  bloodRequestId: string;
  message: string;
  smsStatus: SmsStatus;
  status: BloodRequestStatus;
  smsProvider?: string;
  smsProviderMessageId?: string;
  smsError?: string;
  whatsappStatus: WhatsappStatus;
  whatsappProvider?: WhatsappProvider;
  whatsappProviderMessageId?: string;
  whatsappError?: string;
};

export type SmsMessageInput = {
  bloodGroup: string;
  donorPhone: string;
  message?: string;
  requesterPhone: string;
};

export type WhatsappAlertInput = SmsMessageInput & {
  bloodRequest: BloodRequestDocument;
  sendWhatsapp: boolean;
};
