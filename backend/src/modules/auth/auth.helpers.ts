import { CookieRequest } from './auth.types';
import { ACCESS_TOKEN_COOKIE } from './auth.constants';

export function extractAccessTokenFromCookie(request: CookieRequest): string | null {
  return request.cookies?.[ACCESS_TOKEN_COOKIE] ?? null;
}
