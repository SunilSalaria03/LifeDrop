'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { City, State } from 'country-state-city';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { Megaphone, Send } from 'lucide-react';
import { IndiaPhoneInput } from '@/components/forms/IndiaPhoneInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toIndianE164, toIndianNationalNumber } from '@/lib/phone/india-phone';
import { createCampaign, updateCampaign } from '../api/campaigns.api';
import {
  BloodDonationCampaign,
  CampaignType,
  DonationType,
  OrganizerType,
} from '../types/campaign.types';
import { createCampaignSchema } from '../validations/campaign.validation';
import {
  profileCard,
  profileCardBody,
  profileCardHeader,
  profileInsetPanel,
} from '@/app/profile/profile-card.styles';
import { cn } from '@/lib/utils';

const defaultInitialValues = {
  title: '',
  shortDescription: '',
  description: '',
  type: 'blood_donation' as CampaignType,
  stateCode: '',
  city: '',
  district: '',
  state: '',
  address: '',
  pincode: '',
  venue: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  capacity: '',
  organizer: '',
  organizerType: 'individual' as OrganizerType,
  organizerPhone: '',
  organizerEmail: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  bloodGroupsNeeded: [] as string[],
};

const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label
      className="text-xs font-black uppercase tracking-normal text-neutral-500"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

type CreateCampaignFormProps = {
  mode?: 'create' | 'edit';
  campaign?: BloodDonationCampaign;
  campaignId?: string;
};

function toDateInputValue(value?: string): string {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed.toISOString().slice(0, 10);
}

export function CreateCampaignForm({
  mode = 'create',
  campaign,
  campaignId,
}: CreateCampaignFormProps) {
  const isEditMode = mode === 'edit';
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const states = useMemo(() => State.getStatesOfCountry('IN'), []);
  const initialValues = useMemo(() => {
    if (!campaign) {
      return { ...defaultInitialValues };
    }

    const matchedState = states.find(
      (state) => state.name.toLowerCase() === campaign.state.toLowerCase(),
    );

    return {
      title: campaign.title ?? '',
      shortDescription: campaign.shortDescription ?? '',
      description: campaign.description ?? '',
      type: campaign.type ?? ('blood_donation' as CampaignType),
      stateCode: matchedState?.isoCode ?? '',
      city: campaign.city ?? '',
      district: campaign.district ?? '',
      state: campaign.state ?? '',
      address: campaign.address ?? '',
      pincode: campaign.pincode ?? '',
      venue: campaign.venue ?? '',
      startDate: toDateInputValue(campaign.startDate),
      endDate: toDateInputValue(campaign.endDate),
      startTime: campaign.startTime ?? '',
      endTime: campaign.endTime ?? '',
      capacity:
        typeof campaign.capacity === 'number' ? `${campaign.capacity}` : '',
      organizer: campaign.organizer ?? '',
      organizerType: campaign.organizerType ?? ('individual' as OrganizerType),
      organizerPhone: toIndianNationalNumber(campaign.organizerPhone) ?? '',
      organizerEmail: campaign.organizerEmail ?? '',
      contactName: campaign.contactPerson?.name ?? '',
      contactPhone: toIndianNationalNumber(campaign.contactPerson?.phone) ?? '',
      contactEmail: campaign.contactPerson?.email ?? '',
      bloodGroupsNeeded: campaign.bloodGroupsNeeded ?? [],
    };
  }, [campaign, states]);

  const createCampaignMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error: Error) => {
      showToast({
        title: 'Campaign submit failed',
        message: error.message,
        variant: 'error',
      });
    },
  });
  const updateCampaignMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateCampaign>[1]) => {
      if (!campaignId) {
        throw new Error('Campaign id is missing for update.');
      }
      return updateCampaign(campaignId, payload);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      router.push('/campaigns/my');
    },
    onError: (error: Error) => {
      showToast({
        title: 'Campaign update failed',
        message: error.message,
        variant: 'error',
      });
    },
  });

  function toIsoDate(date: string, time?: string): string {
    if (!date) {
      return '';
    }

    if (!time) {
      return new Date(`${date}T00:00:00`).toISOString();
    }

    return new Date(`${date}T${time}:00`).toISOString();
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createCampaignSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!user) {
        window.dispatchEvent(
          new CustomEvent('lifedrop:open-auth-modal', {
            detail: {
              redirect:
                isEditMode && campaignId
                  ? `/campaigns/my/${campaignId}/edit`
                  : '/campaigns/create',
            },
          }),
        );
        return;
      }

      try {
        const payload = {
          title: values.title.trim(),
          shortDescription: values.shortDescription.trim(),
          description: values.description.trim(),
          type: values.type,
          organizer: {
            name: values.organizer.trim(),
            type: values.organizerType,
            phone: toIndianE164(values.organizerPhone) || undefined,
            email: values.organizerEmail.trim() || undefined,
          },
          location: {
            venue: values.venue.trim(),
            address: values.address.trim(),
            city: values.city.trim(),
            district: values.district.trim(),
            state: values.state.trim(),
            pincode: values.pincode.trim(),
          },
          startDate: toIsoDate(values.startDate, values.startTime),
          endDate: toIsoDate(values.endDate, values.endTime),
          startTime: values.startTime || undefined,
          endTime: values.endTime || undefined,
          capacity: values.capacity ? Number(values.capacity) : undefined,
          registrationRequired: true,
          allowWalkIn: true,
          bloodGroupsNeeded:
            values.type === 'blood_donation' ? values.bloodGroupsNeeded : undefined,
          donationTypes:
            values.type === 'blood_donation'
              ? (['whole_blood'] as DonationType[])
              : undefined,
          contactPerson: {
            name: values.contactName.trim() || undefined,
            phone: toIndianE164(values.contactPhone) || undefined,
            email: values.contactEmail.trim() || undefined,
          },
        };

        if (isEditMode) {
          await updateCampaignMutation.mutateAsync(payload);
          showToast({
            title: 'Campaign updated',
            message: 'Your campaign changes were saved.',
            variant: 'success',
          });
          return;
        }

        await createCampaignMutation.mutateAsync(payload);
      } catch (error) {
        showToast({
          title: isEditMode ? 'Campaign update failed' : 'Campaign submit failed',
          message: error instanceof Error ? error.message : 'Submit failed.',
          variant: 'error',
        });
      }
    },
  });

  const districts = useMemo(() => {
    if (!formik.values.stateCode) {
      return [];
    }

    return City.getCitiesOfState('IN', formik.values.stateCode);
  }, [formik.values.stateCode]);

  const getFieldError = (field: keyof typeof formik.values) => {
    if (formik.submitCount === 0) {
      return undefined;
    }
    const error = formik.errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  function handleStateChange(stateCode: string) {
    const selectedState = states.find((state) => state.isoCode === stateCode);
    void formik.setValues({
      ...formik.values,
      stateCode,
      state: selectedState?.name ?? '',
      district: '',
      city: '',
    });
  }

  function handleDistrictChange(districtName: string) {
    void formik.setValues({
      ...formik.values,
      district: districtName,
      city: districtName,
    });
  }

  function toggleBloodGroup(group: string) {
    const selected = formik.values.bloodGroupsNeeded.includes(group);
    const next = selected
      ? formik.values.bloodGroupsNeeded.filter((value) => value !== group)
      : [...formik.values.bloodGroupsNeeded, group];
    void formik.setFieldValue('bloodGroupsNeeded', next);
  }

  if (isSubmitted) {
    return (
      <Card className={profileCard}>
        <CardContent className={`${profileCardBody} grid gap-4 text-center`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <Megaphone className="h-8 w-8" aria-hidden />
          </div>
          <h2 className="text-xl font-bold text-neutral-950">
            {isEditMode ? 'Campaign updated successfully' : 'Campaign details received'}
          </h2>
          <p className="mx-auto max-w-md text-sm leading-6 text-neutral-600">
            {isEditMode
              ? 'Your campaign changes are saved.'
              : 'Campaign submitted successfully. It will be visible after admin approval.'}
          </p>
          <Button
            asChild
            className="mx-auto mt-2 h-11 w-fit rounded-full bg-red-700 px-6 hover:bg-red-800"
          >
            <Link href={isEditMode ? '/campaigns/my' : '/campaigns'}>
              {isEditMode ? 'Back to my campaigns' : 'Back to campaigns'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={profileCard}>
      <CardHeader className={profileCardHeader}>
        <h2 className="text-lg font-bold text-neutral-950">
          {isEditMode ? 'Edit campaign details' : 'Create your campaign'}
        </h2>
        <p className="text-sm text-neutral-600">
          Add accurate campaign, location, and contact details so donors can find your drive quickly.
        </p>
      </CardHeader>
      <CardContent className={profileCardBody}>
        <form className="grid gap-6" onSubmit={formik.handleSubmit}>
          <section className={cn(profileInsetPanel, 'grid gap-4 sm:p-5')}>
            <h3 className="text-base font-bold text-neutral-950">Campaign basics</h3>
            <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5 sm:col-span-2">
              <FieldLabel htmlFor="campaign-title">Campaign title</FieldLabel>
              <Input
                className="h-11 rounded-xl"
                id="campaign-title"
                name="title"
                onChange={formik.handleChange}
                placeholder="e.g. Community blood drive — Mohali"
                value={formik.values.title}
              />
              {getFieldError('title') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('title')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <FieldLabel htmlFor="campaign-summary">Short summary</FieldLabel>
              <textarea
                className="min-h-[88px] w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm shadow-sm outline-none ring-offset-background placeholder:text-neutral-400 focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-red-500/20"
                id="campaign-summary"
                name="shortDescription"
                onChange={formik.handleChange}
                placeholder="One line about your drive, venue, and who can donate"
                value={formik.values.shortDescription}
              />
              {getFieldError('shortDescription') ? (
                <p className="text-xs font-medium text-red-700">
                  {getFieldError('shortDescription')}
                </p>
              ) : null}
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <FieldLabel htmlFor="campaign-description">Description</FieldLabel>
              <textarea
                className="min-h-[110px] w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm shadow-sm outline-none ring-offset-background placeholder:text-neutral-400 focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-red-500/20"
                id="campaign-description"
                name="description"
                onChange={formik.handleChange}
                placeholder="Detailed campaign information"
                value={formik.values.description}
              />
              {getFieldError('description') ? (
                <p className="text-xs font-medium text-red-700">
                  {getFieldError('description')}
                </p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-type">
                Campaign type
              </label>
              <select
                className="h-11 rounded-xl border border-neutral-300 bg-white px-3 text-sm shadow-sm outline-none ring-offset-background focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-red-500/20"
                id="campaign-type"
                onChange={(event) =>
                  void formik.setValues({
                    ...formik.values,
                    type: event.target.value as CampaignType,
                  })
                }
                value={formik.values.type}
              >
                <option value="blood_donation">Blood donation</option>
                <option value="awareness">Awareness</option>
                <option value="health_checkup">Health checkup</option>
              </select>
              {getFieldError('type') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('type')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-organizer-type">
                Organizer type
              </label>
              <select
                className="h-11 rounded-xl border border-neutral-300 bg-white px-3 text-sm shadow-sm outline-none ring-offset-background focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-red-500/20"
                id="campaign-organizer-type"
                onChange={(event) =>
                  void formik.setValues({
                    ...formik.values,
                    organizerType: event.target.value as OrganizerType,
                  })
                }
                value={formik.values.organizerType}
              >
                <option value="individual">Individual</option>
                <option value="hospital">Hospital</option>
                <option value="ngo">NGO</option>
                <option value="college">College</option>
                <option value="company">Company</option>
              </select>
              {getFieldError('organizerType') ? (
                <p className="text-xs font-medium text-red-700">
                  {getFieldError('organizerType')}
                </p>
              ) : null}
            </div>
            </div>
          </section>
          <section className={cn(profileInsetPanel, 'grid gap-4 sm:p-5')}>
            <h3 className="text-base font-bold text-neutral-950">Location & schedule</h3>
            <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800">
                State
              </label>
              <Select onValueChange={handleStateChange} value={formik.values.stateCode}>
                <SelectTrigger aria-label="State" className="h-11 rounded-xl">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('stateCode') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('stateCode')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800">
                District
              </label>
              <Select
                disabled={!formik.values.stateCode}
                onValueChange={handleDistrictChange}
                value={formik.values.district}
              >
                <SelectTrigger aria-label="District" className="h-11 rounded-xl">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem
                      key={`${district.name}-${district.latitude}`}
                      value={district.name}
                    >
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('district') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('district')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-pincode">
                Pincode
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-pincode"
                inputMode="numeric"
                maxLength={6}
                name="pincode"
                onChange={(event) =>
                  void formik.setFieldValue(
                    'pincode',
                    event.target.value.replace(/\D/g, '').slice(0, 6),
                    false,
                  )
                }
                type="text"
                value={formik.values.pincode}
              />
              {getFieldError('pincode') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('pincode')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-venue">
                Venue
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-venue"
                name="venue"
                onChange={formik.handleChange}
                placeholder="Hospital, blood bank, or camp location"
                value={formik.values.venue}
              />
              {getFieldError('venue') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('venue')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-address">
                Address
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-address"
                name="address"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
              {getFieldError('address') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('address')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-start">
                Start date
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-start"
                name="startDate"
                onChange={formik.handleChange}
                type="date"
                value={formik.values.startDate}
              />
              {getFieldError('startDate') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('startDate')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-end">
                End date
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-end"
                name="endDate"
                onChange={formik.handleChange}
                type="date"
                value={formik.values.endDate}
              />
              {getFieldError('endDate') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('endDate')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-start-time">
                Start time
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-start-time"
                name="startTime"
                onChange={formik.handleChange}
                type="time"
                value={formik.values.startTime}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-end-time">
                End time
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-end-time"
                name="endTime"
                onChange={formik.handleChange}
                type="time"
                value={formik.values.endTime}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-capacity">
                Capacity (donors)
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-capacity"
                name="capacity"
                onChange={formik.handleChange}
                type="number"
                value={formik.values.capacity}
              />
              {getFieldError('capacity') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('capacity')}</p>
              ) : null}
            </div>
            </div>
          </section>
          <section className={cn(profileInsetPanel, 'grid gap-4 sm:p-5')}>
            <h3 className="text-base font-bold text-neutral-950">Organizer & contact</h3>
            <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-organizer">
                Organizer name
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-organizer"
                name="organizer"
                onChange={formik.handleChange}
                value={formik.values.organizer}
              />
              {getFieldError('organizer') ? (
                <p className="text-xs font-medium text-red-700">{getFieldError('organizer')}</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-organizer-email">
                Organizer email
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-organizer-email"
                name="organizerEmail"
                onChange={formik.handleChange}
                type="email"
                value={formik.values.organizerEmail}
              />
              {getFieldError('organizerEmail') ? (
                <p className="text-xs font-medium text-red-700">
                  {getFieldError('organizerEmail')}
                </p>
              ) : null}
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-phone">
                Contact phone
              </label>
              <IndiaPhoneInput
                aria-label="Organizer contact phone"
                id="campaign-phone"
                onChange={(phone) =>
                  void formik.setFieldValue('organizerPhone', phone, false)
                }
                placeholder="9876543210"
                value={formik.values.organizerPhone}
              />
              {getFieldError('organizerPhone') ? (
                <p className="text-xs font-medium text-red-700">
                  {getFieldError('organizerPhone')}
                </p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-contact-name">
                Contact person name
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-contact-name"
                name="contactName"
                onChange={formik.handleChange}
                value={formik.values.contactName}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-contact-phone">
                Contact person phone
              </label>
              <IndiaPhoneInput
                aria-label="Contact person phone"
                id="campaign-contact-phone"
                onChange={(phone) =>
                  void formik.setFieldValue('contactPhone', phone, false)
                }
                placeholder="9876543210"
                value={formik.values.contactPhone}
              />
              {getFieldError('contactPhone') ? (
                <p className="text-xs font-medium text-red-700">
                  {getFieldError('contactPhone')}
                </p>
              ) : null}
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-contact-email">
                Contact person email
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-contact-email"
                name="contactEmail"
                onChange={formik.handleChange}
                type="email"
                value={formik.values.contactEmail}
              />
              {getFieldError('contactEmail') ? (
                <p className="text-xs font-medium text-red-700">
                  {getFieldError('contactEmail')}
                </p>
              ) : null}
            </div>
            {formik.values.type === 'blood_donation' ? (
              <div className="grid gap-2 sm:col-span-2">
                <p className="text-sm font-semibold text-neutral-800">
                  Blood groups needed
                </p>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUP_OPTIONS.map((group) => {
                    const selected = formik.values.bloodGroupsNeeded.includes(group);
                    return (
                      <button
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                          selected
                            ? 'border-red-700 bg-red-700 text-white'
                            : 'border-neutral-300 bg-white text-neutral-700 hover:border-red-300'
                        }`}
                        key={group}
                        onClick={() => toggleBloodGroup(group)}
                        type="button"
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>
                {getFieldError('bloodGroupsNeeded') ? (
                  <p className="text-xs font-medium text-red-700">
                    {getFieldError('bloodGroupsNeeded')}
                  </p>
                ) : null}
              </div>
            ) : null}
            </div>
          </section>

          <div className="flex justify-center">
            <Button
              className="h-12 w-full gap-2 rounded-full bg-red-700 px-8 text-white hover:bg-red-800 sm:w-auto"
              disabled={
                createCampaignMutation.isPending || updateCampaignMutation.isPending
              }
              type="submit"
            >
              <Send className="h-4 w-4 shrink-0" aria-hidden />
              {createCampaignMutation.isPending || updateCampaignMutation.isPending
                ? isEditMode
                  ? 'Saving...'
                  : 'Submitting...'
                : isEditMode
                  ? 'Update Campaign'
                  : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
