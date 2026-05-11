import { Request } from 'express';
import { UserDocument } from '../users/schemas/user.schema.types';

export type AuthenticatedRequest = Request & {
  user: UserDocument;
};

export type CookieRequest = Request & {
  cookies?: Record<string, string | undefined>;
};
