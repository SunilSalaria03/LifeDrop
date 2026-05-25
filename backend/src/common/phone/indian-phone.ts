import { BadRequestException } from '@nestjs/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const INDIAN_PHONE_VALIDATION_MESSAGE =
  'Phone number must be a valid Indian mobile number.';
export const INDIAN_PHONE_DUPLICATE_MESSAGE =
  'Phone number is already used by another account.';

const INDIAN_MOBILE_NATIONAL_REGEX = /^[6-9]\d{9}$/;

function extractIndianMobileNationalNumber(phone: string): string | null {
  const parsedPhone = parsePhoneNumberFromString(phone, 'IN');

  if (!parsedPhone || !parsedPhone.isValid() || parsedPhone.country !== 'IN') {
    return null;
  }

  const nationalNumber = parsedPhone.nationalNumber;

  if (!INDIAN_MOBILE_NATIONAL_REGEX.test(nationalNumber)) {
    return null;
  }

  return nationalNumber;
}

export function normalizeIndianPhoneToE164(phone: string): string | null {
  const trimmedPhone = phone?.trim() ?? '';

  if (!trimmedPhone) {
    return null;
  }

  const nationalNumber = extractIndianMobileNationalNumber(trimmedPhone);

  return nationalNumber ? `+91${nationalNumber}` : null;
}

export function isValidIndianMobilePhone(phone: string): boolean {
  return normalizeIndianPhoneToE164(phone) !== null;
}

export function normalizeIndianPhoneToE164OrThrow(
  phone: string,
  message = INDIAN_PHONE_VALIDATION_MESSAGE,
): string {
  const normalizedPhone = normalizeIndianPhoneToE164(phone);

  if (!normalizedPhone) {
    throw new BadRequestException(message);
  }

  return normalizedPhone;
}
