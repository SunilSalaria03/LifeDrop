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

function FieldError({ active, message }: { active: boolean; message?: string }) {
  if (!active) {
    return null;
  }

  return (
    <p
      className={cn(
        "min-h-4 text-xs font-medium",
        message ? "text-red-700" : "text-transparent",
      )}
    >
      {message || "\u00A0"}
    </p>
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
      lat: undefined,
      lng: undefined,
    }, true);
  };

  const handleDistrictChange = (districtName: string) => {
    const selectedDistrict = districts.find((city) => city.name === districtName);
    void formik.setValues({
      ...formik.values,
      district: districtName,
      lat: selectedDistrict?.latitude
        ? Number(selectedDistrict.latitude)
        : undefined,
      lng: selectedDistrict?.longitude
        ? Number(selectedDistrict.longitude)
        : undefined,
    }, true);
  };

  const getFieldError = (field: keyof typeof formik.values) => {
    if (formik.submitCount === 0) {
      return undefined;
    }
    const error = formik.errors[field];
    return typeof error === "string" ? error : undefined;
  };

  const getFirstError = (fields: Array<keyof typeof formik.values>) =>
    fields.map(getFieldError).find(Boolean);
  const showValidationFeedback = formik.submitCount > 0;

  return (
    <form className="grid gap-6" onSubmit={formik.handleSubmit}>
      <section className={cn(profileInsetPanel, "grid gap-4 sm:p-5")}>
        <h2 className="text-base font-bold text-neutral-950">Personal</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("name") && "border-red-500 focus:border-red-500",
              )}
              id="name"
              name="name"
              onChange={formik.handleChange}
              placeholder="Enter name"
              value={formik.values.name}
            />
            <FieldError active={showValidationFeedback} message={getFieldError("name")} />
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
            <FieldError active={showValidationFeedback} message={getFieldError("phone")} />
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
                void formik.setFieldValue("bloodGroup", bloodGroup, true)
              }
              value={formik.values.bloodGroup}
            >
              <SelectTrigger
                aria-label="Blood group"
                className={cn(
                  "h-12 rounded-2xl bg-white",
                  getFieldError("bloodGroup") && "border-red-500 focus:border-red-500",
                )}
              >
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
            <FieldError
              active={showValidationFeedback}
              message={getFieldError("bloodGroup")}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>Gender</FieldLabel>
            <Select
              onValueChange={(gender) =>
                void formik.setFieldValue("gender", gender, true)
              }
              value={formik.values.gender}
            >
              <SelectTrigger
                aria-label="Gender"
                className={cn(
                  "h-12 rounded-2xl bg-white",
                  getFieldError("gender") && "border-red-500 focus:border-red-500",
                )}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FieldError active={showValidationFeedback} message={getFieldError("gender")} />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="weight">Weight</FieldLabel>
            <Input
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("weight") && "border-red-500 focus:border-red-500",
              )}
              id="weight"
              inputMode="numeric"
              min={1}
              name="weight"
              onChange={(event) =>
                void formik.setFieldValue("weight", event.target.value, true)
              }
              placeholder="Enter weight in kg"
              type="number"
              value={formik.values.weight}
            />
            <FieldError active={showValidationFeedback} message={getFieldError("weight")} />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="birthDate">Birth date</FieldLabel>
            <Input
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("birthDate") && "border-red-500 focus:border-red-500",
              )}
              id="birthDate"
              max={maxBirthDate}
              name="birthDate"
              onChange={formik.handleChange}
              type="date"
              value={formik.values.birthDate}
            />
            <FieldError active={showValidationFeedback} message={getFieldError("birthDate")} />
           
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="lastDonationDate">
              Last donation date
            </FieldLabel>
            <Input
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("lastDonationDate") && "border-red-500 focus:border-red-500",
              )}
              id="lastDonationDate"
              max={maxLastDonationDate}
              name="lastDonationDate"
              onChange={formik.handleChange}
              type="date"
              value={formik.values.lastDonationDate}
            />
            <FieldError
              active={showValidationFeedback}
              message={getFieldError("lastDonationDate")}
            />
             
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="isAvailable">Availability</FieldLabel>
            <label
              className={cn(
                "flex h-12 w-full items-center justify-between rounded-2xl border border-neutral-300 bg-white px-3 text-sm text-neutral-700 transition-colors",
                getFieldError("isAvailable") && "border-red-500",
              )}
              htmlFor="isAvailable"
            >
              <input
                checked={formik.values.isAvailable}
                className="peer sr-only"
                id="isAvailable"
                name="isAvailable"
                onChange={formik.handleChange}
                type="checkbox"
              />
              <span className="font-medium">Available for requests</span>
              <span
                aria-hidden="true"
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  formik.values.isAvailable ? "bg-red-700" : "bg-neutral-300",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                    formik.values.isAvailable ? "translate-x-5" : "translate-x-1",
                  )}
                />
              </span>
            </label>
            <FieldError
              active={showValidationFeedback}
              message={getFieldError("isAvailable")}
            />
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
 
          <div className="grid gap-2 ">
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
              <SelectTrigger
                aria-label="State"
                className={cn(
                  "h-12 rounded-2xl bg-white",
                  getFirstError(["stateCode", "state"]) && "border-red-500 focus:border-red-500",
                )}
              >
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
            <FieldError
              active={showValidationFeedback}
              message={getFirstError(["stateCode", "state"])}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel>District</FieldLabel>
            <Select
              disabled={!formik.values.stateCode}
              onValueChange={handleDistrictChange}
              value={formik.values.district}
            >
              <SelectTrigger
                aria-label="District"
                className={cn(
                  "h-12 rounded-2xl bg-white",
                  getFirstError(["district", "lat", "lng"]) &&
                    "border-red-500 focus:border-red-500",
                )}
              >
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
            <FieldError
              active={showValidationFeedback}
              message={getFirstError(["district", "lat", "lng"])}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="pincode">Pincode</FieldLabel>
            <Input
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("pincode") && "border-red-500 focus:border-red-500",
              )}
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              name="pincode"
              onChange={formik.handleChange}
              placeholder="Enter pincode"
              value={formik.values.pincode}
            />
            <FieldError active={showValidationFeedback} message={getFieldError("pincode")} />
          </div>
        </div>
      </section>

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
