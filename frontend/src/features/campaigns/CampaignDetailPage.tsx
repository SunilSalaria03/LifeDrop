import { BloodDonationCampaign } from './types/campaign.types';
import { CampaignDetailContent } from './components/CampaignDetailContent';
import { CampaignDetailHero } from './components/CampaignDetailHero';

type CampaignDetailPageProps = {
  campaign: BloodDonationCampaign;
};

/** Campaign detail page — hero banner + structured campaign information. */
export function CampaignDetailPage({ campaign }: CampaignDetailPageProps) {
  return (
    <>
      <CampaignDetailHero campaign={campaign} />
      <CampaignDetailContent campaign={campaign} />
    </>
  );
}
