'use client';

import { useMemo } from 'react';
import { City, State } from 'country-state-city';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { IndiaPhoneInput } from '@/components/forms/IndiaPhoneInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  toIndianE164,
  toIndianNationalNumber,
} from '@/lib/phone/india-phone';
import { getSafeInternalPath, getSearchParam } from '@/lib/navigation/safe-url';
import { findStateCode } from '../profile.helpers';
import { ProfileSetupFormProps } from '../profile-component.types';
import { useProfile } from '../hooks/useProfile';
import { profileSetupSchema } from '../validations/profile.validation';

export function ProfileSetupForm({ user }: ProfileSetupFormProps) {
  const router = useRouter();
  const { updateProfileMutation } = useProfile();
  const states = useMemo(() => State.getStatesOfCountry('IN'), []);

  const formik = useFormik({
    initialValues: {
      name: user.name ?? '',
      phone: toIndianNationalNumber(user.phone),
      state: user.state ?? '',
      stateCode: findStateCode(user.state),
      city: user.city ?? '',
      district: user.district ?? '',
      addressLine: user.addressLine ?? user.addressText ?? '',
      lat: user.location?.coordinates?.[1],
      lng: user.location?.coordinates?.[0],
    },
    validationSchema: profileSetupSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      const updatedUser = await updateProfileMutation.mutateAsync({
        name: values.name,
        phone: values.phone ? toIndianE164(values.phone) : undefined,
        state: values.state,
        city: values.city,
        district: values.district,
        addressLine: values.addressLine,
        addressText: values.addressLine,
        lat: values.lat,
        lng: values.lng,
      });

      if (!updatedUser.isProfileCompleted) {
        return;
      }

      const redirect = getSearchParam('redirect');
      router.push(getSafeInternalPath(redirect));
    },
  });

  const cities = useMemo(() => {
    if (!formik.values.stateCode) {
      return [];
    }

    return City.getCitiesOfState('IN', formik.values.stateCode);
  }, [formik.values.stateCode]);

  const handleStateChange = (stateCode: string) => {
    const selectedState = states.find((state) => state.isoCode === stateCode);
    void formik.setValues({
      ...formik.values,
      stateCode,
      state: selectedState?.name ?? '',
      city: '',
      lat: undefined,
      lng: undefined,
    });
  };

  const handleCityChange = (cityName: string) => {
    const selectedCity = cities.find((city) => city.name === cityName);
    void formik.setValues({
      ...formik.values,
      city: cityName,
      lat: selectedCity?.latitude ? Number(selectedCity.latitude) : undefined,
      lng: selectedCity?.longitude ? Number(selectedCity.longitude) : undefined,
    });
  };

  return (
    <form className="grid gap-4" onSubmit={formik.handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-neutral-900" htmlFor="name">
          Name
        </label>
        <Input
          className="h-12 rounded-2xl"
          id="name"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name ? (
          <p className="text-sm font-medium text-red-700">{formik.errors.name}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-neutral-900" htmlFor="phone">
          Phone
        </label>
        <IndiaPhoneInput
          disabled={user.phoneVerified}
          id="phone"
          name="phone"
          onBlur={formik.handleBlur}
          onChange={(phone) => void formik.setFieldValue('phone', phone, false)}
          value={formik.values.phone}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Select onValueChange={handleStateChange} value={formik.values.stateCode}>
          <SelectTrigger aria-label="State" className="h-12 rounded-2xl">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.isoCode} value={state.isoCode}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          disabled={!formik.values.stateCode}
          onValueChange={handleCityChange}
          value={formik.values.city}
        >
          <SelectTrigger aria-label="City" className="h-12 rounded-2xl">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={`${city.name}-${city.latitude}`} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          className="h-12 rounded-2xl"
          name="district"
          onChange={formik.handleChange}
          placeholder="District optional"
          value={formik.values.district}
        />
        <Input
          className="h-12 rounded-2xl"
          name="addressLine"
          onChange={formik.handleChange}
          placeholder="Address line optional"
          value={formik.values.addressLine}
        />
      </div>

      {updateProfileMutation.isError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          Profile could not be saved. Please check the details and try again.
        </p>
      ) : null}

      {updateProfileMutation.data && !updateProfileMutation.data.isProfileCompleted ? (
        <p className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-100">
          Verify your phone before continuing.
        </p>
      ) : null}

      <Button
        className="h-12 w-full rounded-full bg-red-600 text-white hover:bg-red-700"
        disabled={updateProfileMutation.isPending}
        type="submit"
      >
        <Save className="h-4 w-4" />
        {updateProfileMutation.isPending ? 'Saving...' : 'Complete profile'}
      </Button>
    </form>
  );
}
