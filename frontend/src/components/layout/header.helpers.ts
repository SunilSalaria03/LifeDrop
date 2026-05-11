export function getInitials(name?: string, phone?: string, email?: string) {
  const displayValue = name?.trim() || email?.trim() || phone?.trim() || 'LD';

  return displayValue
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function getDisplayName(name?: string, phone?: string, email?: string) {
  return name?.trim() || phone?.trim() || email?.trim() || 'LifeDrop User';
}
