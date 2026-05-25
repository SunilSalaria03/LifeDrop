import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const INDIA_DIAL_CODE = '+91';
export const INDIAN_MOBILE_VALIDATION_MESSAGE =
  'Enter a valid 10 digit Indian mobile number.';
const INDIAN_MOBILE_NATIONAL_REGEX = /^[6-9]\d{9}$/;

export function sanitizeIndianPhoneInput(value?: string) {
  return (value ?? '').replace(/\D/g, '').slice(0, 10);
}

function extractIndianMobileNationalNumber(value?: string) {
  const trimmedValue = value?.trim() ?? '';

  if (!trimmedValue) {
    return '';
  }

  const parsedPhone = parsePhoneNumberFromString(trimmedValue, 'IN');

  if (!parsedPhone || !parsedPhone.isValid() || parsedPhone.country !== 'IN') {
    return '';
  }

  const nationalNumber = parsedPhone.nationalNumber;

  return INDIAN_MOBILE_NATIONAL_REGEX.test(nationalNumber) ? nationalNumber : '';
}

export function toIndianNationalNumber(value?: string) {
  const parsedNationalNumber = extractIndianMobileNationalNumber(value);

  if (parsedNationalNumber) {
    return parsedNationalNumber;
  }

  const trimmedValue = value?.trim() ?? '';

  if (trimmedValue.startsWith(INDIA_DIAL_CODE)) {
    return sanitizeIndianPhoneInput(trimmedValue.slice(INDIA_DIAL_CODE.length));
  }

  const digitsOnly = trimmedValue.replace(/\D/g, '');

  if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
    return sanitizeIndianPhoneInput(digitsOnly.slice(2));
  }

  if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
    return sanitizeIndianPhoneInput(digitsOnly.slice(1));
  }

  return sanitizeIndianPhoneInput(digitsOnly);
}

export function toIndianE164(value?: string) {
  const nationalNumber = extractIndianMobileNationalNumber(value);

  return nationalNumber ? `${INDIA_DIAL_CODE}${nationalNumber}` : '';
}

export function isValidIndianNationalNumber(value?: string) {
  return Boolean(extractIndianMobileNationalNumber(value));
}
