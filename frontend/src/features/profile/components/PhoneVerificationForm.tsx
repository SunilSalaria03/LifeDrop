'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
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
import { useProfile } from '../hooks/useProfile';
import { PhoneVerificationFormProps } from '../profile-component.types';
import { profilePhoneSchema } from '../validations/profile.validation';

export function PhoneVerificationForm({ user }: PhoneVerificationFormProps) {
  const router = useRouter();
  const {
    updateProfileMutation,
    sendProfileOtpMutation,
    verifyProfilePhoneMutation,
  } = useProfile();
  const { showToast } = useToast();

  const formik = useFormik({
    initialValues: {
      phone: toIndianNationalNumber(user.phone),
      otp: '',
    },
    validationSchema: profilePhoneSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await verifyProfilePhoneMutation.mutateAsync({
          phone: toIndianE164(values.phone),
          otp: values.otp ?? '',
        });
        showToast({
          message: 'Phone number verified successfully.',
          title: 'OTP verified',
          variant: 'success',
        });
        const redirect = getSearchParam('redirect');
        router.push(getSafeInternalPath(redirect));
      } catch (error) {
        showToast({
          message: getApiErrorMessage(
            error,
            'Phone verification failed. Check the OTP and try again.',
          ),
          title: 'Verification failed',
          variant: 'error',
        });
      }
    },
  });

  const handleSendOtp = async () => {
    const isPhoneValid = await profilePhoneSchema
      .pick(['phone'])
      .isValid({ phone: formik.values.phone });

    if (!isPhoneValid) {
      await formik.setFieldTouched('phone', true);
      return;
    }

    await updateProfileMutation.mutateAsync({
      phone: toIndianE164(formik.values.phone),
    });
    await sendProfileOtpMutation.mutateAsync({
      phone: toIndianE164(formik.values.phone),
    });
  };

  return (
    <form className="grid gap-4 rounded-2xl border border-red-100 bg-red-50/60 p-4 sm:p-5" onSubmit={formik.handleSubmit}>
      <div>
        <h2 className="text-lg font-bold text-neutral-950">Verify your phone</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-600">
          Google users must verify a phone number before completing their profile.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-neutral-900" htmlFor="phone">
          Phone number
        </label>
        <IndiaPhoneInput
          id="phone"
          name="phone"
          onBlur={formik.handleBlur}
          onChange={(phone) => void formik.setFieldValue('phone', phone, false)}
          value={formik.values.phone}
        />
        {formik.touched.phone && formik.errors.phone ? (
          <p className="text-sm font-medium text-red-700">{formik.errors.phone}</p>
        ) : null}
      </div>

      <Button
        className="h-11 w-full rounded-full bg-white"
        disabled={updateProfileMutation.isPending || sendProfileOtpMutation.isPending}
        onClick={handleSendOtp}
        type="button"
        variant="outline"
      >
        {sendProfileOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
      </Button>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-neutral-900" htmlFor="otp">
          OTP
        </label>
        <Input
          className="h-12 rounded-2xl"
          id="otp"
          inputMode="numeric"
          name="otp"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="123456"
          value={formik.values.otp}
        />
        {formik.touched.otp && formik.errors.otp ? (
          <p className="text-sm font-medium text-red-700">{formik.errors.otp}</p>
        ) : null}
      </div>

      {sendProfileOtpMutation.isError || verifyProfilePhoneMutation.isError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          Phone verification failed. Check the phone number and OTP, then try again.
        </p>
      ) : null}

      <Button
        className="h-12 w-full rounded-full bg-red-600 text-white hover:bg-red-700"
        disabled={verifyProfilePhoneMutation.isPending}
        type="submit"
      >
        {verifyProfilePhoneMutation.isPending ? 'Verifying...' : 'Verify phone'}
      </Button>
    </form>
  );
}
