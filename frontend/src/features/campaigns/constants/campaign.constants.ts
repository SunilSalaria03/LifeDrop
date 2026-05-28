import { CampaignFilterValues } from '../types/campaign.types';

export const CAMPAIGN_PAGE_SIZE = 9;

export const EMPTY_CAMPAIGN_FILTERS: CampaignFilterValues = {
  search: '',
  type: 'all',
  city: '',
  state: 'all',
  status: 'all',
  month: 'all',
};
