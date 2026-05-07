"use client";

import { useMemo } from "react";
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
import { useToast } from "@/components/ui/toast";
import { AuthUser } from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/lib/api/error-message";
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

function formatDateInputValue(date?: string) {
  if (!date) {
    return "";
  }

  return date.slice(0, 10);
}

function booleanSelectValue(value?: boolean) {
  return value ? "true" : "false";
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label
      className="grid gap-2 text-sm font-semibold text-neutral-700"
      htmlFor={htmlFor}
    >
      <span>{children}</span>
    </label>
  );
}

export function BecomeDonorForm({ user }: BecomeDonorFormProps) {
  const router = useRouter();
  const { createDonorProfileMutation } = useDonorProfile();
  const { showToast } = useToast();
  const states = useMemo(() => State.getStatesOfCountry("IN"), []);

  const formik = useFormik({
    initialValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: toIndianNationalNumber(user.phone),
      bloodGroup: user.bloodGroup ?? "",
      gender: user.gender ?? "",
      birthDate: formatDateInputValue(user.birthDate),
      weight: user.weight?.toString() ?? "",
      lastDonationDate: formatDateInputValue(user.lastDonationDate),
      showMobile: user.showMobile ?? false,
      smsAlert: user.smsAlert ?? false,
      state: user.state ?? "",
      stateCode: findStateCode(user.state),
      district: user.district ?? user.city ?? "",
      tehsil: user.tehsil ?? "",
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
      <section className="grid gap-4">
        <h2 className="text-base font-bold text-neutral-950">Personal</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              className="h-12 rounded-2xl"
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
              disabled
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

      <section className="grid gap-4">
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
              <SelectTrigger className="h-12 rounded-2xl">
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
              <SelectTrigger className="h-12 rounded-2xl">
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
              className="h-12 rounded-2xl"
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
              className="h-12 rounded-2xl"
              id="birthDate"
              name="birthDate"
              onChange={formik.handleChange}
              type="date"
              value={formik.values.birthDate}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="lastDonationDate">
              Last donation date
            </FieldLabel>
            <Input
              className="h-12 rounded-2xl"
              id="lastDonationDate"
              name="lastDonationDate"
              onChange={formik.handleChange}
              type="date"
              value={formik.values.lastDonationDate}
            />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-semibold text-neutral-700">
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

      <section className="grid gap-4">
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
              <SelectTrigger className="h-12 rounded-2xl">
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
              <SelectTrigger className="h-12 rounded-2xl">
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
              className="h-12 rounded-2xl"
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              name="pincode"
              onChange={formik.handleChange}
              placeholder="Enter pincode optional"
              value={formik.values.pincode}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>State</FieldLabel>
            <Select
              onValueChange={handleStateChange}
              value={formik.values.stateCode}
            >
              <SelectTrigger className="h-12 rounded-2xl">
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
              <SelectTrigger className="h-12 rounded-2xl">
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
              <SelectTrigger className="h-12 rounded-2xl">
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
