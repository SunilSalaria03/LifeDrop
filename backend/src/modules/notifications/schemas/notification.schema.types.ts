import { HydratedDocument } from 'mongoose';
import { Notification } from './notification.schema';

export type NotificationDocument = HydratedDocument<Notification>;
