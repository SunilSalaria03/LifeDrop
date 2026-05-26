'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Megaphone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  profileCard,
  profileCardBody,
} from '@/app/profile/profile-card.styles';

const initialValues = {
  title: '',
  shortDescription: '',
  city: '',
  state: '',
  venue: '',
  startDate: '',
  endDate: '',
  capacity: '',
  organizer: '',
  organizerPhone: '',
};

export function CreateCampaignForm() {
  const [values, setValues] = useState(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const update =
    (field: keyof typeof initialValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className={profileCard}>
        <CardContent className={`${profileCardBody} grid gap-4 text-center`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <Megaphone className="h-8 w-8" aria-hidden />
          </div>
          <h2 className="text-xl font-bold text-neutral-950">
            Campaign details received
          </h2>
          <p className="mx-auto max-w-md text-sm leading-6 text-neutral-600">
            Thank you for listing a blood donation drive on LifeDrop. Our team
            will review your submission and publish the campaign after
            verification.
          </p>
          <Button
            asChild
            className="mx-auto mt-2 h-11 w-fit rounded-full bg-red-700 px-6 hover:bg-red-800"
          >
            <Link href="/campaigns">Back to campaigns</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={profileCard}>
      <CardContent className={profileCardBody}>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-title">
                Campaign title
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-title"
                onChange={update('title')}
                placeholder="e.g. Community blood drive — Mohali"
                required
                value={values.title}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <label
                className="text-sm font-semibold text-neutral-800"
                htmlFor="campaign-summary"
              >
                Short summary
              </label>
              <textarea
                className="min-h-[88px] w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm shadow-sm outline-none ring-offset-background placeholder:text-neutral-400 focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-red-500/20"
                id="campaign-summary"
                onChange={update('shortDescription')}
                placeholder="One line about your drive, venue, and who can donate"
                required
                value={values.shortDescription}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-city">
                City
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-city"
                onChange={update('city')}
                required
                value={values.city}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-state">
                State
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-state"
                onChange={update('state')}
                required
                value={values.state}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-venue">
                Venue
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-venue"
                onChange={update('venue')}
                placeholder="Hospital, blood bank, or camp location"
                required
                value={values.venue}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-start">
                Start date
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-start"
                onChange={update('startDate')}
                required
                type="date"
                value={values.startDate}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-end">
                End date
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-end"
                onChange={update('endDate')}
                required
                type="date"
                value={values.endDate}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-capacity">
                Capacity (donors)
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-capacity"
                min={1}
                onChange={update('capacity')}
                required
                type="number"
                value={values.capacity}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-organizer">
                Organizer name
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-organizer"
                onChange={update('organizer')}
                required
                value={values.organizer}
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-neutral-800" htmlFor="campaign-phone">
                Contact phone
              </label>
              <Input
                className="h-11 rounded-xl"
                id="campaign-phone"
                onChange={update('organizerPhone')}
                placeholder="10-digit mobile number"
                required
                value={values.organizerPhone}
              />
            </div>
          </div>

          <div className="flex justify-center border-t border-neutral-100 pt-6">
            <Button
              className="h-11 gap-2 rounded-full bg-red-700 px-8 hover:bg-red-800"
              type="submit"
            >
              <Send className="h-4 w-4 shrink-0" aria-hidden />
              Create Campaign
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
