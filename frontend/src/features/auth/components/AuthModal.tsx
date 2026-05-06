'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { ArrowLeft, Droplet, ShieldCheck, X } from 'lucide-react';
import { IndiaPhoneInput } from '@/components/forms/IndiaPhoneInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  toIndianE164,
  toIndianNationalNumber,
} from '@/lib/phone/india-phone';
import { GoogleLoginButton } from './GoogleLoginButton';
import { useAuth } from '../hooks/useAuth';
import { AuthUser } from '../types/auth.types';
import {
  phoneOtpSendSchema,
  phoneOtpVerifySchema,
} from '../validations/auth.validation';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: (user: AuthUser) => void;
  initialPhone?: string;
};

type AuthStep = 'login' | 'otp';

export function AuthModal({
  isOpen,
  onAuthenticated,
  onClose,
  initialPhone = '',
}: AuthModalProps) {
  const { sendOtpMutation, verifyOtpMutation } = useAuth();
  const initialNationalPhone = toIndianNationalNumber(initialPhone);
  const [step, setStep] = useState<AuthStep>(initialNationalPhone ? 'otp' : 'login');
  const [phoneForOtp, setPhoneForOtp] = useState(initialNationalPhone);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const nationalPhone = toIndianNationalNumber(initialPhone);
      setStep(nationalPhone ? 'otp' : 'login');
      setPhoneForOtp(nationalPhone);
      setResendSeconds(0);
    }
  }, [initialPhone, isOpen]);

  useEffect(() => {
    if (!isOpen || step !== 'otp' || resendSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, resendSeconds, step]);

  useEffect(() => {
    if (verifyOtpMutation.isSuccess) {
      onClose();
    }
  }, [onClose, verifyOtpMutation.isSuccess]);

  const sendFormik = useFormik({
    initialValues: {
      phone: phoneForOtp,
    },
    validationSchema: phoneOtpSendSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await sendOtpMutation.mutateAsync({
        phone: toIndianE164(values.phone),
      });
      setPhoneForOtp(values.phone);
      setStep('otp');
      setResendSeconds(60);
    },
  });

  const verifyFormik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: phoneOtpVerifySchema,
    onSubmit: async (values) => {
      const authResponse = await verifyOtpMutation.mutateAsync({
        phone: toIndianE164(phoneForOtp),
        otp: values.otp,
      });
      onAuthenticated?.(authResponse.user);
    },
  });

  async function handleResendOtp() {
    if (!phoneForOtp || resendSeconds > 0) {
      return;
    }

    await sendOtpMutation.mutateAsync({
      phone: toIndianE164(phoneForOtp),
    });
    setResendSeconds(60);
  }

  function handleBackToLogin() {
    verifyFormik.resetForm();
    setStep('login');
    setResendSeconds(0);
  }

  if (!isOpen) {
    return null;
  }

  const title = step === 'login' ? 'Login to LifeDrop' : 'Verify your OTP';
  const description =
    step === 'login'
      ? 'Enter your phone number to receive a secure verification code.'
      : `Use the 6 digit code sent to +91 ${phoneForOtp}.`;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/50 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Close login modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div className="relative grid max-h-[calc(100svh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/80 bg-white shadow-2xl shadow-red-950/25">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 p-5 sm:p-6">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-700 text-white shadow-lg shadow-red-700/20">
              <Droplet className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-red-700">
                Secure access
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-normal text-neutral-950">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {description}
              </p>
            </div>
          </div>
          <button
            aria-label="Close login modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-red-50 hover:text-red-700"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 sm:p-6">
          {step === 'login' ? (
            <>
              <form className="grid gap-4" onSubmit={sendFormik.handleSubmit}>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-neutral-900" htmlFor="auth-phone">
                    Phone number
                  </label>
                  <IndiaPhoneInput
                    className="bg-white"
                    id="auth-phone"
                    name="phone"
                    onBlur={sendFormik.handleBlur}
                    onChange={(phone) => void sendFormik.setFieldValue('phone', phone)}
                    value={sendFormik.values.phone}
                  />
                  {sendFormik.touched.phone && sendFormik.errors.phone ? (
                    <p className="text-sm font-medium text-red-700">
                      {sendFormik.errors.phone}
                    </p>
                  ) : null}
                </div>

                {sendOtpMutation.isError ? (
                  <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
                    Could not send OTP. Check the number and Twilio setup.
                  </p>
                ) : null}

                {sendOtpMutation.isSuccess ? (
                  <p className="rounded-2xl bg-green-50 px-3 py-2 text-sm font-medium text-green-800 ring-1 ring-green-100">
                    OTP sent successfully.
                  </p>
                ) : null}

                <Button
                  className="h-12 rounded-full bg-red-700 text-white shadow-lg shadow-red-700/20 hover:bg-red-800"
                  disabled={sendOtpMutation.isPending}
                  type="submit"
                >
                  {sendOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs font-semibold uppercase text-neutral-400">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              <GoogleLoginButton onAuthenticated={onAuthenticated} onSuccess={onClose} />
            </>
          ) : (
            <form className="grid gap-4" onSubmit={verifyFormik.handleSubmit}>
              <button
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-red-700"
                onClick={handleBackToLogin}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-neutral-900" htmlFor="auth-otp">
                  OTP code
                </label>
                <Input
                  className="h-14 rounded-2xl bg-white text-center text-lg font-bold tracking-[0.35em]"
                  id="auth-otp"
                  inputMode="numeric"
                  maxLength={6}
                  name="otp"
                  onBlur={verifyFormik.handleBlur}
                  onChange={verifyFormik.handleChange}
                  placeholder="123456"
                  value={verifyFormik.values.otp}
                />
                {verifyFormik.touched.otp && verifyFormik.errors.otp ? (
                  <p className="text-sm font-medium text-red-700">
                    {verifyFormik.errors.otp}
                  </p>
                ) : null}
              </div>

              {verifyOtpMutation.isError ? (
                <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
                  OTP verification failed. Check the code or request a new OTP.
                </p>
              ) : null}

              <Button
                className="h-12 rounded-full bg-red-700 text-white shadow-lg shadow-red-700/20 hover:bg-red-800"
                disabled={verifyOtpMutation.isPending || !phoneForOtp}
                type="submit"
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Button
                className="h-12 rounded-full"
                disabled={sendOtpMutation.isPending || resendSeconds > 0 || !phoneForOtp}
                onClick={handleResendOtp}
                type="button"
                variant="outline"
              >
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
          )}

          <p className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-left text-xs font-medium leading-5 text-red-800 ring-1 ring-red-100">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            Your contact details stay private and are only used for approved request flows.
          </p>
        </div>
      </div>
    </div>
  );
}
