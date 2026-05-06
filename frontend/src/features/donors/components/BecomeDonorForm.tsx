"use client";

import { useMemo, useState } from "react";
import { City, State } from "country-state-city";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { IndiaPhoneInput } from "@/components/forms/IndiaPhoneInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthUser } from "@/features/auth/types/auth.types";
import { bloodGroups } from "@/lib/constants/locations";
import {
  toIndianE164,
  toIndianNationalNumber,
} from "@/lib/phone/india-phone";
import { useDonorProfile } from "../hooks/useDonorProfile";
import { donorProfileSchema } from "../validations/donor.validation";

type BecomeDonorFormProps = {
  user: AuthUser;
};

function findStateCode(stateName?: string) {
  return (
    State.getStatesOfCountry("IN").find((state) => state.name === stateName)
      ?.isoCode ?? ""
  );
}

export function BecomeDonorForm({ user }: BecomeDonorFormProps) {
  const router = useRouter();
  const { createDonorProfileMutation } = useDonorProfile();
  const states = useMemo(() => State.getStatesOfCountry("IN"), []);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const formik = useFormik({
    initialValues: {
      bloodGroup: "",
      phone: toIndianNationalNumber(user.phone),
      alternatePhone: "",
      state: user.state ?? "",
      stateCode: findStateCode(user.state),
      city: user.city ?? "",
      district: user.district ?? "",
      addressText: user.addressText ?? "",
      lat: user.location?.coordinates?.[1],
      lng: user.location?.coordinates?.[0],
      lastDonationDate: "",
      isAvailable: true,
    },
    validationSchema: donorProfileSchema,
    onSubmit: async (values) => {
      if (typeof values.lat !== "number" || typeof values.lng !== "number") {
        await formik.setFieldError(
          "city",
          "Select a city to use its coordinates.",
        );
        return;
      }

      await createDonorProfileMutation.mutateAsync({
        bloodGroup: values.bloodGroup,
        phone: toIndianE164(values.phone),
        alternatePhone: values.alternatePhone
          ? toIndianE164(values.alternatePhone)
          : undefined,
        state: values.state,
        city: values.city,
        district: values.district || undefined,
        addressText: values.addressText || undefined,
        lat: values.lat,
        lng: values.lng,
        lastDonationDate: values.lastDonationDate || undefined,
        isAvailable: values.isAvailable,
      });
      setShowSuccessToast(true);
      window.setTimeout(() => router.push("/"), 900);
    },
  });

  const cities = useMemo(() => {
    if (!formik.values.stateCode) {
      return [];
    }

    return City.getCitiesOfState("IN", formik.values.stateCode);
  }, [formik.values.stateCode]);

  const handleStateChange = (stateCode: string) => {
    const selectedState = states.find((state) => state.isoCode === stateCode);
    void formik.setValues({
      ...formik.values,
      stateCode,
      state: selectedState?.name ?? "",
      city: "",
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
      {showSuccessToast ? (
        <div className="fixed inset-x-4 top-4 z-50 rounded-2xl border border-green-100 bg-white px-4 py-3 text-sm font-semibold text-green-800 shadow-xl shadow-green-950/10 sm:left-auto sm:w-fit">
          Donor profile saved successfully.
        </div>
      ) : null}

      <Select
        onValueChange={(bloodGroup) =>
          void formik.setFieldValue("bloodGroup", bloodGroup)
        }
        value={formik.values.bloodGroup}
      >
        <SelectTrigger className="h-12 rounded-2xl">
          <SelectValue placeholder="Blood group" />
        </SelectTrigger>
        <SelectContent>
          {bloodGroups.map((bloodGroup) => (
            <SelectItem key={bloodGroup} value={bloodGroup}>
              {bloodGroup}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid gap-3 sm:grid-cols-2">
        <IndiaPhoneInput
          name="phone"
          onChange={(phone) => void formik.setFieldValue("phone", phone)}
          placeholder="Phone"
          value={formik.values.phone}
        />
        <IndiaPhoneInput
          name="alternatePhone"
          onChange={(phone) =>
            void formik.setFieldValue("alternatePhone", phone)
          }
          placeholder="Alternate phone optional"
          value={formik.values.alternatePhone}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          onValueChange={handleStateChange}
          value={formik.values.stateCode}
        >
          <SelectTrigger className="h-12 rounded-2xl">
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
          <SelectTrigger className="h-12 rounded-2xl">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem
                key={`${city.name}-${city.latitude}`}
                value={city.name}
              >
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
          placeholder="District"
          value={formik.values.district}
        />
        <Input
          className="h-12 rounded-2xl"
          name="addressText"
          onChange={formik.handleChange}
          placeholder="Address"
          value={formik.values.addressText}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          className="h-12 rounded-2xl"
          name="lastDonationDate"
          onChange={formik.handleChange}
          type="date"
          value={formik.values.lastDonationDate}
        />
        <label className="flex h-12 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700">
          <input
            checked={formik.values.isAvailable}
            name="isAvailable"
            onChange={formik.handleChange}
            type="checkbox"
          />
          Available for requests
        </label>
      </div>

      {Object.keys(formik.touched).length > 0 &&
      Object.values(formik.errors)[0] ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          {Object.values(formik.errors)[0]}
        </p>
      ) : null}

      {createDonorProfileMutation.isError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          Donor profile could not be saved. You may already have a donor
          profile.
        </p>
      ) : null}

      <Button
        className="h-12 w-full rounded-full bg-red-600 text-white hover:bg-red-700"
        disabled={createDonorProfileMutation.isPending}
        type="submit"
      >
        {createDonorProfileMutation.isPending ? "Saving..." : "Become a donor"}
      </Button>
    </form>
  );
}
