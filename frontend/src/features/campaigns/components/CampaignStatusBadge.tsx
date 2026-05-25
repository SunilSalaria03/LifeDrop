import { cn } from '@/lib/utils';
import { CampaignStatus } from '../types/campaign.types';

const statusStyles: Record<CampaignStatus, string> = {
  upcoming: 'bg-amber-50 text-amber-800 ring-amber-200',
  ongoing: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  completed: 'bg-neutral-100 text-neutral-700 ring-neutral-200',
};

const statusOnDarkStyles: Record<CampaignStatus, string> = {
  upcoming: 'bg-amber-400/20 text-amber-100 ring-amber-300/40',
  ongoing: 'bg-emerald-400/20 text-emerald-100 ring-emerald-300/40',
  completed: 'bg-white/15 text-slate-200 ring-white/25',
};

const statusLabels: Record<CampaignStatus, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
};

export function CampaignStatusBadge({
  status,
  variant = 'default',
}: {
  status: CampaignStatus;
  variant?: 'default' | 'onDark';
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1 ring-inset',
        variant === 'onDark' ? statusOnDarkStyles[status] : statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
