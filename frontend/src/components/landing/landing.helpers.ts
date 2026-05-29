export function getDonorName(name?: string) {
  return name?.trim() || 'LifeDrop Donor';
}

export function getInitials(name?: string) {
  return getDonorName(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function formatDonorDate(date?: string) {
  if (!date) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDonorPhone(phone?: string, showMobile: boolean = false) {
  if (!phone) {
    return 'N/A';
  }

  const cleaned = phone.replace(/\D/g, '');
  let mobile = cleaned;

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    mobile = cleaned.slice(2);
  }

  if (mobile.length !== 10) {
    return phone;
  }

  if (showMobile) {
    return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
  }

  return `+91 XXXXX ${mobile.slice(5)}`;
}

export function formatDonorEmail(
  email?: string,
  showEmail: boolean = false,
) {
  if (!email) {
    return "N/A";
  }

  if (showEmail) {
    return email;
  }

  const [localPart, domainPart] = email.split("@");

  if (!localPart || !domainPart) {
    return email;
  }

  const visiblePrefixLength = Math.min(2, localPart.length);
  const visiblePrefix = localPart.slice(0, visiblePrefixLength);
  const maskedSuffixLength = Math.max(localPart.length - visiblePrefixLength, 0);
  const maskedSuffix = "*".repeat(Math.max(maskedSuffixLength, 4));

  return `${visiblePrefix}${maskedSuffix}@${domainPart}`;
}
