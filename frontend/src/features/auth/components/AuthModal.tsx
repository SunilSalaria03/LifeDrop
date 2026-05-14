'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Droplet, RotateCcw, Send, ShieldCheck, X } from 'lucide-react';
import { IndiaPhoneInput } from '@/components/forms/IndiaPhoneInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/api/error-message';
import {
  toIndianE164,
  toIndianNationalNumber,
} from '@/lib/phone/india-phone';
import { getSafeInternalPath, getSearchParam } from '@/lib/navigation/safe-url';
import { GoogleLoginButton } from './GoogleLoginButton';
import { useAuth } from '../hooks/useAuth';
import { AuthUser } from '../types/auth.types';
import { AuthModalProps, AuthStep, OtpFlow } from '../auth-component.types';
import { useProfile } from '@/features/profile/hooks/useProfile';
import {
  phoneOtpSendSchema,
  phoneOtpVerifySchema,
} from '../validations/auth.validation';

export function AuthModal({
  isOpen,
  onAuthenticated,
  onClose,
  initialPhone = '',
  profileUser,
  profileRedirect,
}: AuthModalProps) {
  const router = useRouter();
  const { sendOtpMutation, verifyOtpMutation } = useAuth();
  const { updateProfileMutation, verifyProfilePhoneMutation } = useProfile();
  const { showToast } = useToast();
  const initialNationalPhone = toIndianNationalNumber(initialPhone);
  const [step, setStep] = useState<AuthStep>(initialNationalPhone ? 'otp' : 'login');
  const [otpFlow, setOtpFlow] = useState<OtpFlow>('login');
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
      const profilePhone = toIndianNationalNumber(profileUser?.phone);
      const nextOtpFlow =
        profileUser && !profileUser.phoneVerified ? 'profile' : 'login';
      setStep(nextOtpFlow === 'profile' ? 'login' : nationalPhone ? 'otp' : 'login');
      setOtpFlow(nextOtpFlow);
      setPhoneForOtp(profilePhone || nationalPhone);
      setResendSeconds(0);
    }
  }, [initialPhone, isOpen, profileUser]);

  useEffect(() => {
    if (!isOpen || step !== 'otp' || resendSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, resendSeconds, step]);

  const sendFormik = useFormik({
    initialValues: {
      phone: phoneForOtp,
    },
    validationSchema: phoneOtpSendSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (otpFlow === 'profile') {
        await updateProfileMutation.mutateAsync({
          phone: toIndianE164(values.phone),
        });
      }

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
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const verifiedUser =
          otpFlow === 'profile'
            ? await verifyProfilePhoneMutation.mutateAsync({
                phone: toIndianE164(phoneForOtp),
                otp: values.otp,
              })
            : (
                await verifyOtpMutation.mutateAsync({
                  phone: toIndianE164(phoneForOtp),
                  otp: values.otp,
                })
              ).user;

        showToast({
          message: 'OTP verified successfully.',
          title: 'Login successful',
          variant: 'success',
        });
        onAuthenticated?.(verifiedUser);

        if (otpFlow === 'profile') {
          const redirect = getSearchParam('redirect');
          onClose();
          router.push(getSafeInternalPath(redirect || profileRedirect));
          return;
        }

        onClose();
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

  function handleGoogleAuthenticated(user: AuthUser) {
    onAuthenticated?.(user);

    if (user.phoneVerified) {
      onClose();
      return;
    }

    const nationalPhone = toIndianNationalNumber(user.phone);
    setOtpFlow('profile');
    setPhoneForOtp(nationalPhone);
    setStep('login');
    setResendSeconds(0);
  }

  if (!isOpen) {
    return null;
  }

  const title =
    otpFlow === 'profile'
      ? step === 'login'
        ? 'Verify your phone'
        : 'Verify your OTP'
      : step === 'login'
        ? 'Login to LifeDrop'
        : 'Verify your OTP';
  const description =
    step === 'login'
      ? otpFlow === 'profile'
        ? 'Enter your verified phone number to receive a secure verification code.'
        : 'Enter your phone number to receive a secure verification code.'
      : `Use the 6 digit code sent to +91 ${phoneForOtp}.`;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 py-6 backdrop-blur-md"
      role="dialog"
    >
      <button
        aria-label="Close login modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div className="relative grid max-h-[calc(100svh-2rem)] w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_28px_90px_rgba(69,10,10,0.35)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_18%_0%,rgba(220,38,38,0.16),transparent_42%),linear-gradient(135deg,rgba(254,226,226,0.95),rgba(255,255,255,0.2))]" />
        <div className="relative max-h-[calc(100svh-2rem)] overflow-y-auto">
        <div className="flex items-start justify-between gap-5 border-b border-red-100/80 p-5 sm:p-6">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-700 text-white shadow-xl shadow-red-700/25 ring-4 ring-white">
              <Droplet className="h-6 w-6" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-xs font-black uppercase tracking-wider text-red-700">
                Secure access
              </p>
              <h2 className="mt-1 text-2xl font-black leading-tight tracking-normal text-neutral-950">
                {title}
              </h2>
              <p className="mt-2 max-w-xs text-sm font-medium leading-6 text-neutral-600">
                {description}
              </p>
            </div>
          </div>
          <button
            aria-label="Close login modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent text-neutral-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700"
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
                    onChange={(phone) =>
                      void sendFormik.setFieldValue('phone', phone, false)
                    }
                    value={sendFormik.values.phone}
                  />
                  {sendFormik.touched.phone && sendFormik.errors.phone ? (
                    <p className="text-sm font-medium text-red-700">
                      {sendFormik.errors.phone}
                    </p>
                  ) : null}
                </div>

                {sendOtpMutation.isError || updateProfileMutation.isError ? (
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
                  disabled={sendOtpMutation.isPending || updateProfileMutation.isPending}
                  type="submit"
                >
                  <Send className="h-4 w-4" />
                  {sendOtpMutation.isPending || updateProfileMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>

              {otpFlow === 'login' ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-neutral-200" />
                    <span className="text-xs font-semibold uppercase text-neutral-400">
                      or continue with
                    </span>
                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>

                  <GoogleLoginButton onAuthenticated={handleGoogleAuthenticated} />
                </>
              ) : null}
            </>
          ) : (
            <form className="grid gap-4" onSubmit={verifyFormik.handleSubmit}>
              <div className="grid gap-2 rounded-3xl border border-red-100 bg-red-50/50 p-4">
                <label className="text-sm font-black text-neutral-900" htmlFor="auth-otp">
                  OTP code
                </label>
                <Input
                  className="h-14 rounded-2xl border-red-100 bg-white text-center text-lg font-black tracking-[0.35em] shadow-sm placeholder:text-neutral-300 focus-visible:ring-red-200"
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

              {verifyOtpMutation.isError || verifyProfilePhoneMutation.isError ? (
                <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
                  OTP verification failed. Check the code or request a new OTP.
                </p>
              ) : null}

              <Button
                className="h-12 rounded-full bg-red-700 text-white shadow-lg shadow-red-700/20 hover:bg-red-800"
                disabled={
                  verifyOtpMutation.isPending ||
                  verifyProfilePhoneMutation.isPending ||
                  !phoneForOtp
                }
                type="submit"
              >
                <ShieldCheck className="h-4 w-4" />
                {verifyOtpMutation.isPending || verifyProfilePhoneMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Button
                className="h-12 rounded-full border-red-100 bg-white font-bold text-neutral-500 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                disabled={sendOtpMutation.isPending || resendSeconds > 0 || !phoneForOtp}
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

              <button
                className="mx-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-50 hover:text-red-800"
                onClick={handleBackToLogin}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>
            </form>
          )}

          <p className="flex items-start gap-3 rounded-2xl border border-red-100 bg-[linear-gradient(135deg,#fff7f7,#fee2e2)] px-4 py-3 text-left text-xs font-bold leading-5 text-red-800 shadow-sm">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            Your contact details stay private and are only used for approved request flows.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
