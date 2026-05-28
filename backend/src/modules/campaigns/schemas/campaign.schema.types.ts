import { HydratedDocument, Types } from 'mongoose';
import { Campaign } from './campaign.schema';

export type CampaignDocument = HydratedDocument<Campaign>;

export type CampaignOwner = {
  userId: Types.ObjectId;
  name?: string;
  role: 'donor' | 'user' | 'admin';
  phone?: string;
  email?: string;
};
