'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { phoneOtpSendSchema, phoneOtpVerifySchema } from '../validations/auth.validation';
import { useAuth } from '../hooks/useAuth';

type PhoneOtpFormProps = {
  mode: 'send' | 'verify';
};

export function PhoneOtpForm({ mode }: PhoneOtpFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phoneFromQuery = searchParams.get('phone') ?? '';
  const { sendOtpMutation, verifyOtpMutation } = useAuth();
  const [resendSeconds, setResendSeconds] = useState(60);

  useEffect(() => {
    if (mode === 'verify' && !phoneFromQuery) {
      router.replace('/auth/login');
    }
  }, [mode, phoneFromQuery, router]);

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
    onSubmit: async (values) => {
      await sendOtpMutation.mutateAsync({
        phone: values.phone
      });
      router.push(`/auth/otp?phone=${encodeURIComponent(values.phone)}`);
    }
  });

  const verifyFormik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: phoneOtpVerifySchema,
    onSubmit: async (values) => {
      await verifyOtpMutation.mutateAsync({
        phone: phoneFromQuery,
        otp: values.otp
      });
    }
  });

  async function handleResendOtp() {
    if (!phoneFromQuery || resendSeconds > 0) {
      return;
    }

    await sendOtpMutation.mutateAsync({
      phone: phoneFromQuery
    });
    setResendSeconds(60);
  }

  if (mode === 'verify') {
    return (
      <form className="grid gap-4" onSubmit={verifyFormik.handleSubmit}>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-neutral-900" htmlFor="otp">
            OTP
          </label>
          <Input
            id="otp"
            name="otp"
            inputMode="numeric"
            placeholder="123456"
            value={verifyFormik.values.otp}
            onBlur={verifyFormik.handleBlur}
            onChange={verifyFormik.handleChange}
          />
          {verifyFormik.touched.otp && verifyFormik.errors.otp ? (
            <p className="text-sm text-red-700">{verifyFormik.errors.otp}</p>
          ) : null}
        </div>

        {verifyOtpMutation.isError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
            OTP verification failed. Check the code or request a new OTP.
          </p>
        ) : null}

        <Button type="submit" disabled={verifyOtpMutation.isPending || !phoneFromQuery}>
          {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={sendOtpMutation.isPending || resendSeconds > 0 || !phoneFromQuery}
          onClick={handleResendOtp}
        >
          {sendOtpMutation.isPending
            ? 'Resending...'
            : resendSeconds > 0
              ? `Resend OTP in ${resendSeconds}s`
              : 'Resend OTP'}
        </Button>

        {sendOtpMutation.isError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
            Could not resend OTP yet. Please wait and try again.
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={sendFormik.handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-neutral-900" htmlFor="phone">
          Phone number
        </label>
        <Input
          id="phone"
          name="phone"
          placeholder="+919999999999"
          value={sendFormik.values.phone}
          onBlur={sendFormik.handleBlur}
          onChange={sendFormik.handleChange}
        />
        {sendFormik.touched.phone && sendFormik.errors.phone ? (
          <p className="text-sm text-red-700">{sendFormik.errors.phone}</p>
        ) : null}
      </div>

      {sendOtpMutation.isError ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          Could not send OTP. Check the number and Twilio setup.
        </p>
      ) : null}

      <Button type="submit" disabled={sendOtpMutation.isPending}>
        {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
      </Button>
    </form>
  );
}
