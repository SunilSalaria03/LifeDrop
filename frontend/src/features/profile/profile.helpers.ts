import { State } from 'country-state-city';

export function findStateCode(stateName?: string) {
  return (
    State.getStatesOfCountry('IN').find((state) => state.name === stateName)
      ?.isoCode ?? ''
  );
}

export function formatDateInputValue(date?: string) {
  if (!date) {
    return '';
  }

  return date.slice(0, 10);
}

export function booleanSelectValue(value?: boolean) {
  return value ? 'true' : 'false';
}

export function toGenderOrUndefined(
  value?: string,
): 'male' | 'female' | 'other' | undefined {
  if (value === 'male' || value === 'female' || value === 'other') {
    return value;
  }

  return undefined;
}

export function calculateAgeFromDob(birthDate?: string) {
  if (!birthDate) {
    return "N/A";
  }

  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) {
    return "N/A";
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  if (age < 0) {
    return "N/A";
  }

  return `${age}`;
}