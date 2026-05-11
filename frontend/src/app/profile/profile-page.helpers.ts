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
