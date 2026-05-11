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
