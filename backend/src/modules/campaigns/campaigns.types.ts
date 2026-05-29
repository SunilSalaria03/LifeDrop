export type CampaignListResult<TItem> = {
  items: TItem[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
};
