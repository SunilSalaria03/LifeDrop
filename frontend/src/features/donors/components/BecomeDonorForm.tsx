"use client";

import { useMemo } from "react";
import { City, State } from "country-state-city";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { HeartHandshake } from "lucide-react";
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
import { useToast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { bloodGroups } from "@/lib/constants/locations";
import {
  toIndianE164,
  toIndianNationalNumber,
} from "@/lib/phone/india-phone";
import {
  booleanSelectValue,
  findStateCode,
  formatDateInputValue,
} from "@/features/profile/profile.helpers";
import { profileInsetPanel } from "@/app/profile/profile-card.styles";
import { BecomeDonorFormProps, FieldLabelProps } from "../donor-component.types";
import { useDonorProfile } from "../hooks/useDonorProfile";
import { donorProfileSchema } from "../validations/donor.validation";
import { cn } from "@/lib/utils";

function FieldLabel({
  children,
  htmlFor,
}: FieldLabelProps) {
  return (
    <label
      className="text-xs font-black uppercase tracking-normal text-neutral-500"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toReadableDate = (value: string) => {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }
  return `${day}-${month}-${year}`;
};

export function BecomeDonorForm({ user }: BecomeDonorFormProps) {
  const router = useRouter();
  const { createDonorProfileMutation } = useDonorProfile();
  const { showToast } = useToast();
  const states = useMemo(() => State.getStatesOfCountry("IN"), []);
  const maxBirthDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setFullYear(date.getFullYear() - 18);
    return toDateInputValue(date);
  }, []);
  const maxLastDonationDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 90);
    return toDateInputValue(date);
  }, []);
  const maxBirthDateLabel = useMemo(() => toReadableDate(maxBirthDate), [maxBirthDate]);
  const maxLastDonationDateLabel = useMemo(
    () => toReadableDate(maxLastDonationDate),
    [maxLastDonationDate],
  );
  const initialBirthDate = formatDateInputValue(user.birthDate) || maxBirthDate;
  const initialLastDonationDate =
    formatDateInputValue(user.lastDonationDate) || maxLastDonationDate;

  const formik = useFormik({
    initialValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: toIndianNationalNumber(user.phone),
      bloodGroup: user.bloodGroup ?? "",
      gender: user.gender ?? "",
      birthDate: initialBirthDate,
      weight: user.weight?.toString() ?? "",
      lastDonationDate: initialLastDonationDate,
      showMobile: user.showMobile ?? false,
      smsAlert: user.smsAlert ?? false,
      state: user.state ?? "",
      stateCode: findStateCode(user.state),
      district: user.district ?? user.city ?? "",
      tehsil: user.tehsil ?? "",
      addressLine: user.addressLine ?? user.addressText ?? "",
      pincode: user.pincode ?? "",
      lat: user.location?.coordinates?.[1],
      lng: user.location?.coordinates?.[0],
      isAvailable: true,
    },
    validationSchema: donorProfileSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (typeof values.lat !== "number" || typeof values.lng !== "number") {
        await formik.setFieldError(
          "district",
          "Select a district to use its coordinates.",
        );
        return;
      }

      try {
        await createDonorProfileMutation.mutateAsync({
          name: values.name,
          email: values.email || undefined,
          phone: toIndianE164(values.phone),
          bloodGroup: values.bloodGroup,
          gender: values.gender,
          birthDate: values.birthDate,
          weight: Number(values.weight),
          state: values.state,
          city: values.district,
          district: values.district,
          tehsil: values.tehsil || undefined,
          addressLine: values.addressLine || undefined,
          addressText: values.addressLine || undefined,
          pincode: values.pincode || undefined,
          lat: values.lat,
          lng: values.lng,
          lastDonationDate: values.lastDonationDate || undefined,
          showMobile: values.showMobile,
          smsAlert: values.smsAlert,
          isAvailable: values.isAvailable,
        });

        showToast({
          message: "Your donor profile is active now.",
          title: "Donor profile saved",
          variant: "success",
        });
        router.push("/profile");
      } catch (error) {
        showToast({
          message: getApiErrorMessage(
            error,
            "Donor profile could not be saved. Please check the details and try again.",
          ),
          title: "Save failed",
          variant: "error",
        });
      }
    },
  });

  const districts = useMemo(() => {
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
      district: "",
      tehsil: "",
      lat: undefined,
      lng: undefined,
    });
  };

  const handleDistrictChange = (districtName: string) => {
    const selectedDistrict = districts.find((city) => city.name === districtName);
    void formik.setValues({
      ...formik.values,
      district: districtName,
      tehsil: "",
      lat: selectedDistrict?.latitude
        ? Number(selectedDistrict.latitude)
        : undefined,
      lng: selectedDistrict?.longitude
        ? Number(selectedDistrict.longitude)
        : undefined,
    });
  };

  const firstError = Object.values(formik.errors)[0];

  return (
    <form className="grid gap-6" onSubmit={formik.handleSubmit}>
      <section className={cn(profileInsetPanel, "grid gap-4 sm:p-5")}>
        <h2 className="text-base font-bold text-neutral-950">Personal</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              className="h-12 rounded-2xl bg-white"
              id="name"
              name="name"
              onChange={formik.handleChange}
              placeholder="Enter name"
              value={formik.values.name}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <IndiaPhoneInput
              aria-label="Phone"
              disabled
              id="phone"
              name="phone"
              onChange={(phone) =>
                void formik.setFieldValue("phone", phone, false)
              }
              placeholder="Enter phone number"
              value={formik.values.phone}
            />
          </div>
        </div>
      </section>

      <section className={cn(profileInsetPanel, "grid gap-4 sm:p-5")}>
        <h2 className="text-base font-bold text-neutral-950">Donor</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <FieldLabel>Blood group</FieldLabel>
            <Select
              onValueChange={(bloodGroup) =>
                void formik.setFieldValue("bloodGroup", bloodGroup, false)
              }
              value={formik.values.bloodGroup}
            >
              <SelectTrigger aria-label="Blood group" className="h-12 rounded-2xl bg-white">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {bloodGroups.map((bloodGroup) => (
                  <SelectItem key={bloodGroup} value={bloodGroup}>
                    {bloodGroup}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <FieldLabel>Gender</FieldLabel>
            <Select
              onValueChange={(gender) =>
                void formik.setFieldValue("gender", gender, false)
              }
              value={formik.values.gender}
            >
              <SelectTrigger aria-label="Gender" className="h-12 rounded-2xl bg-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="weight">Weight</FieldLabel>
            <Input
              className="h-12 rounded-2xl bg-white"
              id="weight"
              inputMode="numeric"
              name="weight"
              onChange={formik.handleChange}
              placeholder="Enter weight in kg"
              value={formik.values.weight}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="birthDate">Birth date</FieldLabel>
            <Input
              className="h-12 rounded-2xl bg-white"
              id="birthDate"
              max={maxBirthDate}
              name="birthDate"
              onChange={formik.handleChange}
              type="date"
              value={formik.values.birthDate}
            />
            <p className="text-xs text-neutral-500">
              Must be on or before {maxBirthDateLabel} (18+ years).
            </p>
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="lastDonationDate">
              Last donation date
            </FieldLabel>
            <Input
              className="h-12 rounded-2xl bg-white"
              id="lastDonationDate"
              max={maxLastDonationDate}
              name="lastDonationDate"
              onChange={formik.handleChange}
              type="date"
              value={formik.values.lastDonationDate}
            />
            <p className="text-xs text-neutral-500">
              Must be on or before {maxLastDonationDateLabel} (at least 90 days ago).
            </p>
          </div>
          <div className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-normal text-neutral-500">
              Availability
            </span>
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
        </div>
      </section>

      <section className={cn(profileInsetPanel, "grid gap-4 sm:p-5")}>
        <h2 className="text-base font-bold text-neutral-950">Contact</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <FieldLabel>Show mobile</FieldLabel>
            <Select
              onValueChange={(value) =>
                void formik.setFieldValue("showMobile", value === "true", false)
              }
              value={booleanSelectValue(formik.values.showMobile)}
            >
              <SelectTrigger aria-label="Show mobile" className="h-12 rounded-2xl bg-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Show mobile</SelectItem>
                <SelectItem value="false">Hide mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <FieldLabel>SMS alert</FieldLabel>
            <Select
              onValueChange={(value) =>
                void formik.setFieldValue("smsAlert", value === "true", false)
              }
              value={booleanSelectValue(formik.values.smsAlert)}
            >
              <SelectTrigger aria-label="SMS alert" className="h-12 rounded-2xl bg-white">
                <SelectValue placeholder="Select SMS alert" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">SMS alerts on</SelectItem>
                <SelectItem value="false">SMS alerts off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="pincode">Pincode</FieldLabel>
            <Input
              className="h-12 rounded-2xl bg-white"
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              name="pincode"
              onChange={formik.handleChange}
              placeholder="Enter pincode optional"
              value={formik.values.pincode}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
            <FieldLabel htmlFor="addressLine">Address line</FieldLabel>
            <Input
              className="h-12 rounded-2xl bg-white"
              id="addressLine"
              name="addressLine"
              onChange={formik.handleChange}
              placeholder="House, street, landmark optional"
              value={formik.values.addressLine}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>State</FieldLabel>
            <Select
              onValueChange={handleStateChange}
              value={formik.values.stateCode}
            >
              <SelectTrigger aria-label="State" className="h-12 rounded-2xl bg-white">
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
          </div>
          <div className="grid gap-2">
            <FieldLabel>District</FieldLabel>
            <Select
              disabled={!formik.values.stateCode}
              onValueChange={handleDistrictChange}
              value={formik.values.district}
            >
              <SelectTrigger aria-label="District" className="h-12 rounded-2xl bg-white">
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
          </div>
          <div className="grid gap-2">
            <FieldLabel>Tehsil</FieldLabel>
            <Select
              disabled={!formik.values.district}
              onValueChange={(tehsil) =>
                void formik.setFieldValue("tehsil", tehsil, false)
              }
              value={formik.values.tehsil}
            >
              <SelectTrigger aria-label="Tehsil" className="h-12 rounded-2xl bg-white">
                <SelectValue placeholder="Select tehsil optional" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem
                    key={`tehsil-${district.name}-${district.latitude}`}
                    value={district.name}
                  >
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {firstError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          {firstError}
        </p>
      ) : null}

      <div className="flex justify-center">
        <Button
          className="h-12 w-full rounded-full bg-red-700 px-8 text-white hover:bg-red-800 sm:w-auto"
          disabled={createDonorProfileMutation.isPending}
          type="submit"
        >
          <HeartHandshake className="h-4 w-4" />
          {createDonorProfileMutation.isPending ? "Saving..." : "Join as a Donor"}
        </Button>
      </div>
    </form>
  );
}
