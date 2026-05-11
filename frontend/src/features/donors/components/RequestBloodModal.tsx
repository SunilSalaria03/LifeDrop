'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Droplet, MapPin, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { getDonorName } from '@/components/landing/landing.helpers';
import { getApiErrorMessage } from '@/lib/api/error-message';
import { sendDonorSmsAlert } from '../api/donors.api';
import { RequestBloodModalProps } from '../donor-component.types';

export function RequestBloodModal({
  donor,
  onOpenChange,
  onSuccess,
  open,
}: RequestBloodModalProps) {
  const { showToast } = useToast();
  const [sendSms, setSendSms] = useState(false);
  const [sendWhatsapp, setSendWhatsapp] = useState(false);
  const [consentToShareContact, setConsentToShareContact] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSendSms(false);
      setSendWhatsapp(false);
      setConsentToShareContact(false);
      setMessage('');
      setIsSubmitting(false);
    }
  }, [open]);

  if (!open || !donor) {
    return null;
  }

  const canSubmit = sendSms && consentToShareContact && !isSubmitting;
  const donorName = getDonorName(donor.name);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!donor || !canSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      await sendDonorSmsAlert({
        donorId: donor.id,
        bloodGroup: donor.bloodGroup,
        sendSms,
        sendWhatsapp,
        consentToShareContact,
        message: message.trim() || undefined,
      });

      showToast({
        message: 'SMS alert sent to donor.',
        title: 'Request sent',
        variant: 'success',
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      showToast({
        message: getApiErrorMessage(
          error,
          'SMS alert could not be sent. Please try again.',
        ),
        title: 'Request failed',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/50 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Close request blood modal"
        className="absolute inset-0 cursor-default"
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <form
        className="relative grid max-h-[calc(100svh-2rem)] w-full max-w-lg gap-0 overflow-y-auto rounded-3xl border border-white/80 bg-white shadow-2xl shadow-red-950/25"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 p-5 sm:p-6">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-700 text-white shadow-lg shadow-red-700/20">
              <Droplet className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-red-700">
                Blood request
              </p>
              <h2 className="mt-1 break-words text-2xl font-bold tracking-normal text-neutral-950">
                Request {donorName}
              </h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                <MapPin className="h-4 w-4 shrink-0 text-red-600" />
                <span className="truncate">{donor.city || 'City not provided'}</span>
              </p>
            </div>
          </div>
          <button
            aria-label="Close request blood modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-red-50 hover:text-red-700"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="w-fit rounded-2xl bg-red-600 px-4 py-2 text-lg font-bold text-white shadow-lg shadow-red-500/20">
              {donor.bloodGroup}
            </Badge>
            <Badge className="w-fit rounded-full bg-red-50 px-3.5 py-1.5 text-red-700 ring-1 ring-red-100">
              {donor.city || 'City not provided'}
            </Badge>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-800">
            <input
              checked={sendSms}
              className="mt-1 h-4 w-4 accent-red-700"
              onChange={(event) => setSendSms(event.target.checked)}
              type="checkbox"
            />
            <span>Send SMS alert.</span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-800 opacity-60">
            <input
              checked={sendWhatsapp}
              className="mt-1 h-4 w-4 accent-red-700"
              onChange={(event) => setSendWhatsapp(event.target.checked)}
              type="checkbox"
            />
            <span>Send WhatsApp alert.</span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-800">
            <input
              checked={consentToShareContact}
              className="mt-1 h-4 w-4 accent-red-700"
              onChange={(event) =>
                setConsentToShareContact(event.target.checked)
              }
              type="checkbox"
            />
            <span>I agree to share my contact details with donor.</span>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-neutral-900">
            <span>Message optional</span>
            <textarea
              className="min-h-28 resize-none rounded-2xl border border-neutral-300 bg-white px-3 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-red-700"
              maxLength={500}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Add a short note for the donor"
              value={message}
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              className="h-12 rounded-full"
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="h-12 rounded-full bg-red-700 text-white hover:bg-red-800"
              disabled={!canSubmit}
              type="submit"
            >
              {isSubmitting ? 'Sending...' : 'Send request'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
