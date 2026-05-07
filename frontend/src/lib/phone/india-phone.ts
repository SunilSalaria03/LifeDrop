export const INDIA_DIAL_CODE = '+91';

export function sanitizeIndianPhoneInput(value?: string) {
  return (value ?? '').replace(/\D/g, '').slice(0, 10);
}

export function toIndianNationalNumber(value?: string) {
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
  const nationalNumber = toIndianNationalNumber(value);

  return nationalNumber ? `${INDIA_DIAL_CODE}${nationalNumber}` : '';
}

export function isValidIndianNationalNumber(value?: string) {
  return /^\d{10}$/.test(value ?? '');
}
