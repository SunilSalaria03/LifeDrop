'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { RotateCcw, Send, ShieldCheck } from 'lucide-react';
import { IndiaPhoneInput } from '@/components/forms/IndiaPhoneInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/api/error-message';
import {
  toIndianE164,
  toIndianNationalNumber,
} from '@/lib/phone/india-phone';
import {
  getSafeInternalPath,
  stripNextInternalSearchParams,
} from '@/lib/navigation/safe-url';
import { phoneOtpSendSchema, phoneOtpVerifySchema } from '../validations/auth.validation';
import { useAuth } from '../hooks/useAuth';
import { PhoneOtpFormProps } from '../auth-component.types';

export function PhoneOtpForm({ mode }: PhoneOtpFormProps) {
  const router = useRouter();
  const [phoneFromQuery, setPhoneFromQuery] = useState('');
  const [redirect, setRedirect] = useState<string | null>(null);
  const [hasLoadedQuery, setHasLoadedQuery] = useState(false);
  const { sendOtpMutation, verifyOtpMutation } = useAuth();
  const { showToast } = useToast();
  const [resendSeconds, setResendSeconds] = useState(60);

  useEffect(() => {
    const params = stripNextInternalSearchParams(
      new URLSearchParams(window.location.search),
    );
    setPhoneFromQuery(toIndianNationalNumber(params.get('phone') ?? ''));
    const redirectParam = params.get('redirect');
    setRedirect(redirectParam ? getSafeInternalPath(redirectParam) : null);
    setHasLoadedQuery(true);
  }, []);

  useEffect(() => {
    if (hasLoadedQuery && mode === 'verify' && !phoneFromQuery) {
      router.replace('/?auth=login');
    }
  }, [hasLoadedQuery, mode, phoneFromQuery, router]);

  useEffect(() => {
    if (mode !== 'verify') {
      return;
    }

    setResendSeconds(60);
  }, [mode, phoneFromQuery]);

  useEffect(() => {
    if (mode !== 'verify' || resendSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode, resendSeconds]);

  const sendFormik = useFormik({
    initialValues: {
      phone: phoneFromQuery
    },
    validationSchema: phoneOtpSendSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      await sendOtpMutation.mutateAsync({
        phone: toIndianE164(values.phone)
      });
      router.push(
        `/?auth=login&phone=${encodeURIComponent(toIndianE164(values.phone))}${
          redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''
        }`,
      );
    }
  });

  const verifyFormik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: phoneOtpVerifySchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await verifyOtpMutation.mutateAsync({
          phone: toIndianE164(phoneFromQuery),
          otp: values.otp
        });
        showToast({
          message: 'OTP verified successfully.',
          title: 'Login successful',
          variant: 'success',
        });
      } catch (error) {
        showToast({
          message: getApiErrorMessage(
            error,
            'OTP verification failed. Check the code and try again.',
          ),
          title: 'Verification failed',
          variant: 'error',
        });
      }
    }
  });

  async function handleResendOtp() {
    if (!phoneFromQuery || resendSeconds > 0) {
      return;
    }

    await sendOtpMutation.mutateAsync({
      phone: toIndianE164(phoneFromQuery)
    });
    setResendSeconds(60);
  }

  if (mode === 'verify') {
    return (
      <form className="grid gap-4" onSubmit={verifyFormik.handleSubmit}>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-neutral-900" htmlFor="otp">
            OTP
          </label>
          <Input
            id="otp"
            name="otp"
            inputMode="numeric"
            placeholder="xxxxxx"
            className="h-12 rounded-2xl bg-white"
            value={verifyFormik.values.otp}
            onBlur={verifyFormik.handleBlur}
            onChange={verifyFormik.handleChange}
          />
          {verifyFormik.touched.otp && verifyFormik.errors.otp ? (
            <p className="text-sm font-medium text-red-700">{verifyFormik.errors.otp}</p>
          ) : null}
        </div>

        {verifyOtpMutation.isError ? (
          <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
            OTP verification failed. Check the code or request a new OTP.
          </p>
        ) : null}

        <Button
          className="h-12 rounded-full bg-red-600 text-white hover:bg-red-700"
          type="submit"
          disabled={verifyOtpMutation.isPending || !phoneFromQuery}
        >
          <ShieldCheck className="h-4 w-4" />
          {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <Button
          className="h-12 rounded-full"
          disabled={sendOtpMutation.isPending || resendSeconds > 0 || !phoneFromQuery}
          onClick={handleResendOtp}
          type="button"
          variant="outline"
        >
          <RotateCcw className="h-4 w-4" />
          {sendOtpMutation.isPending
            ? 'Resending...'
            : resendSeconds > 0
              ? `Resend OTP in ${resendSeconds}s`
              : 'Resend OTP'}
        </Button>

        {sendOtpMutation.isError ? (
          <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
            Could not resend OTP yet. Please wait and try again.
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={sendFormik.handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-neutral-900" htmlFor="phone">
          Phone number
        </label>
        <IndiaPhoneInput
          id="phone"
          name="phone"
          className="h-12 rounded-2xl bg-white"
          value={sendFormik.values.phone}
          onBlur={sendFormik.handleBlur}
          onChange={(phone) => void sendFormik.setFieldValue('phone', phone, false)}
        />
        {sendFormik.touched.phone && sendFormik.errors.phone ? (
          <p className="text-sm font-medium text-red-700">{sendFormik.errors.phone}</p>
        ) : null}
      </div>

      {sendOtpMutation.isError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          Could not send OTP. Check the number and Twilio setup.
        </p>
      ) : null}

      <Button
        className="h-12 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
        type="submit"
        disabled={sendOtpMutation.isPending}
      >
        <Send className="h-4 w-4" />
        {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
      </Button>
    </form>
  );
}
