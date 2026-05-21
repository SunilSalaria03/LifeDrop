import { AuthUser } from '@/features/auth/types/auth.types';

export function getInitials(name?: string, email?: string, phone?: string) {
  const displayValue = name?.trim() || email?.trim() || phone?.trim() || 'LD';

  return displayValue
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function getDisplayName(user?: AuthUser) {
  return (
    user?.name?.trim() ||
    user?.email?.trim() ||
    user?.phone?.trim() ||
    'LifeDrop User'
  );
}

export function formatDate(date?: string) {
  if (!date) {
    return 'Not provided';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function getProfileLocation(user?: AuthUser) {
  return [user?.district ?? user?.city, user?.state]
    .filter(Boolean)
    .join(', ');
}

export function getProfileHeadline(
  user?: AuthUser,
  bloodGroup?: string | null,
) {
  const isDonor = user?.role === 'donor' || Boolean(bloodGroup);

  if (isDonor) {
    const group = bloodGroup || user?.bloodGroup;
    return group
      ? `Blood donor · ${group}`
      : 'Blood donor on LifeDrop';
  }

  return 'LifeDrop community member';
}

export function getMemberSinceYear(date?: string) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat('en-IN', { year: 'numeric' }).format(
    new Date(date),
  );
}
