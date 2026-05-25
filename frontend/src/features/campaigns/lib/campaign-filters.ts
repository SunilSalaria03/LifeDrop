import { CAMPAIGNS } from '../data/campaigns.data';

export const CAMPAIGN_PAGE_SIZE = 9;
import {
  BloodDonationCampaign,
  CAMPAIGN_MONTH_ALL,
  CampaignFilterValues,
  CampaignStatus,
} from '../types/campaign.types';

export function getCampaignMonthKey(campaign: BloodDonationCampaign) {
  const date = new Date(campaign.startDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatCampaignMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);

  if (!year || !month) {
    return monthKey;
  }

  return new Date(year, month - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

export function getCampaignMonthOptions() {
  const keys = new Set(CAMPAIGNS.map(getCampaignMonthKey));

  return [
    { value: CAMPAIGN_MONTH_ALL, label: 'All months' },
    ...Array.from(keys)
      .sort()
      .map((key) => ({
        value: key,
        label: formatCampaignMonthLabel(key),
      })),
  ];
}

export function getCampaignStateOptions() {
  const states = new Set(CAMPAIGNS.map((campaign) => campaign.state));

  return [
    { value: 'all', label: 'All states' },
    ...Array.from(states)
      .sort()
      .map((state) => ({ value: state, label: state })),
  ];
}

export function filterCampaigns(
  campaigns: BloodDonationCampaign[],
  filters: CampaignFilterValues,
) {
  const cityQuery = filters.city.trim().toLowerCase();

  return campaigns.filter((campaign) => {
    if (cityQuery) {
      const matchesCity =
        campaign.city.toLowerCase().includes(cityQuery) ||
        campaign.district.toLowerCase().includes(cityQuery) ||
        campaign.pincode.includes(cityQuery);

      if (!matchesCity) {
        return false;
      }
    }

    if (filters.state !== 'all' && campaign.state !== filters.state) {
      return false;
    }

    if (
      filters.status !== 'all' &&
      campaign.status !== (filters.status as CampaignStatus)
    ) {
      return false;
    }

    if (
      filters.month !== CAMPAIGN_MONTH_ALL &&
      getCampaignMonthKey(campaign) !== filters.month
    ) {
      return false;
    }

    return true;
  });
}

export function getCampaignStats(campaigns: BloodDonationCampaign[]) {
  const cities = new Set(campaigns.map((campaign) => campaign.city));

  return {
    upcoming: campaigns.filter((campaign) => campaign.status === 'upcoming')
      .length,
    ongoing: campaigns.filter((campaign) => campaign.status === 'ongoing')
      .length,
    cities: cities.size,
    registrations: campaigns.reduce(
      (total, campaign) => total + campaign.registrationCount,
      0,
    ),
  };
}

export function formatCampaignDateRange(
  startDate: string,
  endDate: string,
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameDay = start.toDateString() === end.toDateString();

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (sameDay) {
    return dateFormatter.format(start);
  }

  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}

export const EMPTY_CAMPAIGN_FILTERS: CampaignFilterValues = {
  city: '',
  state: 'all',
  status: 'all',
  month: CAMPAIGN_MONTH_ALL,
};
