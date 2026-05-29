import {
  BackendCampaign,
  BackendCampaignStatus,
  BloodDonationCampaign,
  CampaignStatus,
} from '../types/campaign.types';

function mapStatus(status?: BackendCampaignStatus): CampaignStatus {
  if (status === 'ongoing' || status === 'completed') {
    return status;
  }

  return 'upcoming';
}

export function mapCampaignToUiModel(campaign: BackendCampaign): BloodDonationCampaign {
  const hasCapacity = typeof campaign.capacity === 'number';

  return {
    id: campaign.id,
    slug: campaign.slug,
    title: campaign.title ?? 'Untitled campaign',
    shortDescription: campaign.shortDescription ?? '',
    description: campaign.description ?? '',
    type: campaign.type ?? 'blood_donation',
    backendStatus: campaign.status ?? 'upcoming',
    organizerType: campaign.organizer?.type,
    city: campaign.location?.city ?? 'N/A',
    state: campaign.location?.state ?? 'N/A',
    district: campaign.location?.district ?? campaign.location?.city ?? 'N/A',
    venue: campaign.location?.venue ?? 'Venue to be announced',
    address: campaign.location?.address ?? '',
    landmark: campaign.location?.landmark ?? '',
    pincode: campaign.location?.pincode ?? 'N/A',
    isVerified: Boolean(campaign.isVerified),
    isFeatured: Boolean(campaign.isFeatured),
    status: mapStatus(campaign.status),
    startDate: campaign.startDate ?? new Date().toISOString(),
    endDate: campaign.endDate ?? campaign.startDate ?? new Date().toISOString(),
    startTime: campaign.startTime,
    endTime: campaign.endTime,
    registrationDeadline: campaign.registrationDeadline,
    organizer: campaign.organizer?.name ?? 'Organizer to be announced',
    organizerPhone: campaign.organizer?.phone ?? campaign.contactPerson?.phone,
    organizerEmail: campaign.organizer?.email ?? campaign.contactPerson?.email,
    organizerWebsite: campaign.organizer?.website,
    bloodGroupsNeeded: campaign.bloodGroupsNeeded ?? [],
    donationTypes: campaign.donationTypes ?? [],
    registrationCount: campaign.registrationCount ?? 0,
    capacity: campaign.capacity,
    hasCapacity,
    allowWalkIn: campaign.allowWalkIn ?? true,
    registrationRequired: campaign.registrationRequired ?? true,
    contactPerson: campaign.contactPerson,
    images: campaign.images,
    highlights: campaign.highlights ?? [],
    scheduleNotes: campaign.scheduleNotes ?? '',
    eligibilityNotes: campaign.eligibilityNotes ?? '',
    instructions: campaign.instructions ?? '',
  };
}
