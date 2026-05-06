"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { City, State } from "country-state-city";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Droplet,
  Edit3,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { IndiaPhoneInput } from "@/components/forms/IndiaPhoneInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthUser } from "@/features/auth/types/auth.types";
import { useDonorProfile } from "@/features/donors/hooks/useDonorProfile";
import { MyDonorProfile } from "@/features/donors/types/donor.types";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { updateProfileFormSchema } from "@/features/profile/validations/profile.validation";
import { bloodGroups } from "@/lib/constants/locations";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { toIndianE164, toIndianNationalNumber } from "@/lib/phone/india-phone";
import { useToast } from "@/components/ui/toast";

type InfoItemProps = {
  icon: LucideIcon;
  label: string;
  value?: string;
};

function getInitials(name?: string, email?: string, phone?: string) {
  const displayValue = name?.trim() || email?.trim() || phone?.trim() || "LD";

  return displayValue
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getDisplayName(user?: AuthUser) {
  return (
    user?.name?.trim() ||
    user?.email?.trim() ||
    user?.phone?.trim() ||
    "LifeDrop User"
  );
}

function findStateCode(stateName?: string) {
  return (
    State.getStatesOfCountry("IN").find((state) => state.name === stateName)
      ?.isoCode ?? ""
  );
}

function formatDate(date?: string) {
  if (!date) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
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

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4 transition hover:border-red-100 hover:bg-red-50/40">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-red-700 shadow-sm shadow-red-950/5">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase text-neutral-500">
          {label}
        </span>
        <span className="mt-1 block break-words text-sm font-semibold text-neutral-950">
          {value || "Not provided"}
        </span>
      </span>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <Card className="animate-pulse rounded-2xl border-white/80 bg-white/90 shadow-xl shadow-red-950/10">
        <CardContent className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:p-8">
          <div className="h-24 w-24 rounded-full bg-neutral-200" />
          <div className="grid gap-3">
            <div className="h-8 w-64 max-w-full rounded-full bg-neutral-200" />
            <div className="h-4 w-80 max-w-full rounded-full bg-neutral-100" />
            <div className="h-4 w-56 max-w-full rounded-full bg-neutral-100" />
          </div>
        </CardContent>
      </Card>
      <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-28 rounded-2xl bg-white/90 shadow-sm" key={index} />
        ))}
      </div>
    </div>
  );
}

function ProfileEditForm({
  onCancel,
  user,
}: {
  onCancel: () => void;
  user: AuthUser;
}) {
  const { updateProfileMutation } = useProfile();
  const { showToast } = useToast();
  const states = useMemo(() => State.getStatesOfCountry("IN"), []);
  const isDonor = user.role === "donor";

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
      pincode: user.pincode ?? "",
      state: user.state ?? "",
      stateCode: findStateCode(user.state),
      district: user.district ?? user.city ?? "",
      tehsil: user.tehsil ?? "",
    },
    validationSchema: updateProfileFormSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await updateProfileMutation.mutateAsync({
          name: values.name,
          email: values.email || undefined,
          phone: toIndianE164(values.phone),
          pincode: values.pincode || undefined,
          state: values.state,
          city: values.district,
          district: values.district,
          tehsil: values.tehsil || undefined,
          ...(isDonor
            ? {
                bloodGroup: values.bloodGroup || undefined,
                gender: values.gender || undefined,
                birthDate: values.birthDate || undefined,
                weight: values.weight ? Number(values.weight) : undefined,
                lastDonationDate: values.lastDonationDate || undefined,
                showMobile: values.showMobile,
                smsAlert: values.smsAlert,
              }
            : {}),
        });
        showToast({
          message: "Profile updated successfully.",
          title: "Profile saved",
          variant: "success",
        });
        onCancel();
      } catch (error) {
        showToast({
          message: getApiErrorMessage(
            error,
            "Profile could not be updated. Please check the details and try again.",
          ),
          title: "Update failed",
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
    });
  };

  const handleDistrictChange = (districtName: string) => {
    void formik.setValues({
      ...formik.values,
      district: districtName,
      tehsil: "",
    });
  };

  const firstError = Object.values(formik.errors)[0];

  return (
    <form className="grid gap-6" onSubmit={formik.handleSubmit}>
      <section className="grid gap-4">
        <h3 className="text-base font-bold text-neutral-950">
          Login Information
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            className="h-12 rounded-2xl"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Full name"
            value={formik.values.name}
          />
          <Input
            className="h-12 rounded-2xl"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="Email"
            type="email"
            value={formik.values.email}
          />
          <IndiaPhoneInput
            name="phone"
            onBlur={formik.handleBlur}
            onChange={(phone) =>
              void formik.setFieldValue("phone", phone, false)
            }
            placeholder="Mobile number"
            value={formik.values.phone}
          />
        </div>
      </section>

      {isDonor ? (
      <section className="grid gap-4">
        <h3 className="text-base font-bold text-neutral-950">
          Donor Information
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            onValueChange={(bloodGroup) =>
              void formik.setFieldValue("bloodGroup", bloodGroup, false)
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
          <Select
            onValueChange={(gender) =>
              void formik.setFieldValue("gender", gender, false)
            }
            value={formik.values.gender}
          >
            <SelectTrigger className="h-12 rounded-2xl">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="h-12 rounded-2xl"
            inputMode="numeric"
            name="weight"
            onChange={formik.handleChange}
            placeholder="Weight"
            value={formik.values.weight}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            className="h-12 rounded-2xl"
            name="birthDate"
            onChange={formik.handleChange}
            type="date"
            value={formik.values.birthDate}
          />
          <Input
            className="h-12 rounded-2xl"
            name="lastDonationDate"
            onChange={formik.handleChange}
            type="date"
            value={formik.values.lastDonationDate}
          />
        </div>
      </section>
      ) : null}

      <section className="grid gap-4">
        <h3 className="text-base font-bold text-neutral-950">
          Contact Information
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isDonor ? (
          <Select
            onValueChange={(value) =>
              void formik.setFieldValue("showMobile", value === "true", false)
            }
            value={booleanSelectValue(formik.values.showMobile)}
          >
            <SelectTrigger className="h-12 rounded-2xl">
              <SelectValue placeholder="Show mobile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Show mobile</SelectItem>
              <SelectItem value="false">Hide mobile</SelectItem>
            </SelectContent>
          </Select>
          ) : null}
          {isDonor ? (
          <Select
            onValueChange={(value) =>
              void formik.setFieldValue("smsAlert", value === "true", false)
            }
            value={booleanSelectValue(formik.values.smsAlert)}
          >
            <SelectTrigger className="h-12 rounded-2xl">
              <SelectValue placeholder="SMS alert" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">SMS alerts on</SelectItem>
              <SelectItem value="false">SMS alerts off</SelectItem>
            </SelectContent>
          </Select>
          ) : null}
          <Input
            className="h-12 rounded-2xl"
            inputMode="numeric"
            maxLength={6}
            name="pincode"
            onChange={formik.handleChange}
            placeholder="Pin code"
            value={formik.values.pincode}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
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
            onValueChange={handleDistrictChange}
            value={formik.values.district}
          >
            <SelectTrigger className="h-12 rounded-2xl">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((city) => (
                <SelectItem
                  key={`${city.name}-${city.latitude}`}
                  value={city.name}
                >
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            disabled={!formik.values.district}
            onValueChange={(tehsil) =>
              void formik.setFieldValue("tehsil", tehsil, false)
            }
            value={formik.values.tehsil}
          >
            <SelectTrigger className="h-12 rounded-2xl">
              <SelectValue placeholder="Tehsil" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((city) => (
                <SelectItem
                  key={`tehsil-${city.name}-${city.latitude}`}
                  value={city.name}
                >
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {firstError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          {firstError}
        </p>
      ) : null}

      {updateProfileMutation.isError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          Profile could not be updated. Please check the details and try again.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          className="h-12 rounded-full"
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="h-12 rounded-full bg-red-700 text-white hover:bg-red-800"
          disabled={updateProfileMutation.isPending}
          type="submit"
        >
          {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

const donorEditSchema = yup.object({
  bloodGroup: yup.string().required("Blood group is required."),
  phone: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, "Enter a 10 digit Indian mobile number.")
    .required("Phone is required."),
  alternatePhone: yup
    .string()
    .trim()
    .test(
      "optional-e164",
      "Enter a 10 digit Indian mobile number.",
      (value) => !value || /^\d{10}$/.test(value),
    ),
  state: yup.string().required("State is required."),
  stateCode: yup.string().required("State is required."),
  city: yup.string().required("City is required."),
  district: yup.string().optional(),
  addressText: yup.string().optional(),
  lat: yup.number().optional(),
  lng: yup.number().optional(),
  lastDonationDate: yup.string().optional(),
  isAvailable: yup.boolean().optional(),
});

function DonorEditForm({
  donor,
  onCancel,
}: {
  donor: MyDonorProfile;
  onCancel: () => void;
}) {
  const { updateDonorProfileMutation } = useDonorProfile();
  const states = useMemo(() => State.getStatesOfCountry("IN"), []);

  const formik = useFormik({
    initialValues: {
      bloodGroup: donor.bloodGroup ?? "",
      phone: toIndianNationalNumber(donor.phone),
      alternatePhone: toIndianNationalNumber(donor.alternatePhone),
      state: donor.state ?? "",
      stateCode: findStateCode(donor.state),
      city: donor.city ?? "",
      district: donor.district ?? "",
      addressText: donor.addressText ?? "",
      lat: undefined as number | undefined,
      lng: undefined as number | undefined,
      lastDonationDate: donor.lastDonationDate ?? "",
      isAvailable: donor.isAvailable ?? true,
    },
    validationSchema: donorEditSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      await updateDonorProfileMutation.mutateAsync({
        bloodGroup: values.bloodGroup,
        phone: toIndianE164(values.phone),
        alternatePhone: values.alternatePhone
          ? toIndianE164(values.alternatePhone)
          : undefined,
        state: values.state,
        city: values.city,
        district: values.district || undefined,
        addressText: values.addressText || undefined,
        lat: typeof values.lat === "number" ? values.lat : undefined,
        lng: typeof values.lng === "number" ? values.lng : undefined,
        lastDonationDate: values.lastDonationDate || undefined,
        isAvailable: values.isAvailable,
      });
      onCancel();
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

  const firstError = Object.values(formik.errors)[0];

  return (
    <form className="grid gap-4" onSubmit={formik.handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
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
        <IndiaPhoneInput
          name="phone"
          onChange={(phone) => void formik.setFieldValue("phone", phone, false)}
          placeholder="Donor phone"
          value={formik.values.phone}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <IndiaPhoneInput
          name="alternatePhone"
          onChange={(phone) =>
            void formik.setFieldValue("alternatePhone", phone, false)
          }
          placeholder="Alternate phone optional"
          value={formik.values.alternatePhone}
        />
        <Input
          className="h-12 rounded-2xl"
          name="lastDonationDate"
          onChange={formik.handleChange}
          type="date"
          value={formik.values.lastDonationDate}
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
          placeholder="District optional"
          value={formik.values.district}
        />
        <Input
          className="h-12 rounded-2xl"
          name="addressText"
          onChange={formik.handleChange}
          placeholder="Address optional"
          value={formik.values.addressText}
        />
      </div>

      <label className="flex h-12 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700">
        <input
          checked={formik.values.isAvailable}
          name="isAvailable"
          onChange={formik.handleChange}
          type="checkbox"
        />
        Available for donation requests
      </label>

      {firstError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          {firstError}
        </p>
      ) : null}

      {updateDonorProfileMutation.isError ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          Donor details could not be updated. Please check the form and try
          again.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          className="h-12 rounded-full"
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="h-12 rounded-full bg-red-700 text-white hover:bg-red-800"
          disabled={updateDonorProfileMutation.isPending}
          type="submit"
        >
          {updateDonorProfileMutation.isPending
            ? "Updating..."
            : "Update donor details"}
        </Button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { meQuery } = useAuth();
  const { myDonorProfileQuery } = useDonorProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingDonor, setIsEditingDonor] = useState(false);
  const user = meQuery.data;
  const donor = myDonorProfileQuery.data;
  const isLoading = meQuery.isLoading || myDonorProfileQuery.isLoading;
  const isDonor = user?.role === "donor";
  const completedItems = [
    Boolean(user?.name),
    Boolean(user?.phone || user?.email),
    Boolean((user?.district || user?.city) && user?.state),
    Boolean(user?.phoneVerified),
  ].filter(Boolean).length;
  const completionPercent = Math.round((completedItems / 4) * 100);

  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#fff5f5_100%)] px-4 py-8 text-neutral-950 sm:px-6 sm:py-10 lg:px-8">
        {isLoading || !user ? (
          <ProfileSkeleton />
        ) : (
          <div className="mx-auto grid max-w-7xl gap-6">
            <Card className="overflow-hidden rounded-2xl border-white/80 bg-white/95 shadow-xl shadow-red-950/10">
              <CardContent className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
                <Avatar className="h-24 w-24 border-4 border-red-50 bg-red-50 shadow-lg shadow-red-950/10 sm:h-28 sm:w-28">
                  {user.profileImage ? (
                    <AvatarImage
                      alt={getDisplayName(user)}
                      src={user.profileImage}
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl font-bold text-red-700">
                    {getInitials(
                      user.name,
                      user.email,
                      user.phone,
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="grid min-w-0 gap-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="break-words text-2xl font-bold tracking-normal text-neutral-950 sm:text-4xl">
                          {getDisplayName(user)}
                        </h1>
                        {user.phoneVerified ? (
                          <ShieldCheck className="h-6 w-6 text-red-700" />
                        ) : null}
                      </div>
                      <p className="mt-2 flex items-start gap-2 text-sm font-medium text-neutral-600 sm:text-base">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                        <span className="break-words">
                          {[
                            user.district ?? user.city,
                            user.state,
                          ].filter(Boolean).join(", ") ||
                            "Location not provided"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                      <Button
                        className="h-11 rounded-full border-red-100 bg-white hover:bg-red-50"
                        onClick={() =>
                          setIsEditingProfile((current) => !current)
                        }
                        type="button"
                        variant="outline"
                      >
                        {isEditingProfile ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Edit3 className="h-4 w-4" />
                        )}
                        {isEditingProfile ? "Close edit" : "Edit profile"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-red-50 px-3.5 py-1.5 text-red-700 ring-1 ring-red-100">
                      {user.role === "donor" || donor
                        ? "Donor account"
                        : "User account"}
                    </Badge>
                    <Badge
                      className={
                        user.phoneVerified
                          ? "gap-1.5 bg-green-50 px-3.5 py-1.5 text-green-700 ring-1 ring-green-100"
                          : "gap-1.5 bg-amber-50 px-3.5 py-1.5 text-amber-700 ring-1 ring-amber-100"
                      }
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {user.phoneVerified
                        ? "Verified"
                        : "Verification pending"}
                    </Badge>

                    <Badge className="rounded-full bg-red-50 text-red-700 hover:bg-red-100">
                      Profile {completionPercent}% Complete
                    </Badge>

                    {user.role === "donor" && donor?.bloodGroup && (
                      <Badge className="rounded-full bg-red-100 text-red-700 hover:bg-red-100">
                        {donor?.bloodGroup}
                      </Badge>
                    )}

                    {user.role === "donor" && (
                      <Badge className="rounded-full bg-green-100 text-green-700 hover:bg-green-100">
                        {donor ? "Active Donor" : "Not Donor"}
                      </Badge>
                    )}

                    <Badge className="rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-100">
                      Member since {formatDate(user.createdAt)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isEditingProfile ? (
              <Card className="rounded-2xl border-red-100 bg-white/95 shadow-xl shadow-red-950/10">
                <CardHeader className="p-5 sm:p-6">
                  <h2 className="text-xl font-bold text-neutral-950">
                    Update Profile
                  </h2>
                  <p className="text-sm leading-6 text-neutral-600">
                    Keep your contact and location details accurate for faster
                    request handling.
                  </p>
                </CardHeader>
                <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                  <ProfileEditForm
                    onCancel={() => setIsEditingProfile(false)}
                    user={user}
                  />
                </CardContent>
              </Card>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <Card className="rounded-2xl border-white/80 bg-white/95 shadow-lg shadow-red-950/5">
                <CardHeader className="p-5 sm:p-6">
                  <h2 className="text-xl font-bold text-neutral-950">
                    Personal Information
                  </h2>
                </CardHeader>
                <CardContent className="grid gap-3 p-5 pt-0 sm:grid-cols-2 sm:p-6 sm:pt-0">
                  <InfoItem
                    icon={UserRound}
                    label="Full name"
                    value={user.name}
                  />
                  <InfoItem icon={Mail} label="Email" value={user.email} />
                  <InfoItem
                    icon={Phone}
                    label="Phone number"
                    value={user.phone}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="District and state"
                    value={[
                      user.district ?? user.city,
                      user.state,
                    ].filter(Boolean).join(", ")}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Pin code"
                    value={user.pincode}
                  />
                  <InfoItem
                    icon={CalendarCheck}
                    label="Account created"
                    value={formatDate(user.createdAt)}
                  />
                  <InfoItem
                    icon={BadgeCheck}
                    label="Verification status"
                    value={
                      user.phoneVerified ? "Verified" : "Pending verification"
                    }
                  />
                  {isDonor ? (
                    <>
                      <InfoItem
                        icon={UserRound}
                        label="Gender"
                        value={user.gender}
                      />
                      <InfoItem
                        icon={Droplet}
                        label="Blood group"
                        value={user.bloodGroup ?? donor?.bloodGroup}
                      />
                    </>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="h-fit rounded-2xl border-white/80 bg-white/95 shadow-lg shadow-red-950/5">
                <CardHeader className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-950">
                        Donor Information
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">
                        {donor
                          ? "Manage your donor availability and donation details."
                          : "You can help nearby patients find blood faster."}
                      </p>
                    </div>
                    {donor ? (
                      <Badge className="bg-red-50 text-red-700 ring-1 ring-red-100">
                        Donor
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 p-5 pt-0 sm:p-6 sm:pt-0">
                  {myDonorProfileQuery.isError ? (
                    <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
                      Donor details could not be loaded.
                    </p>
                  ) : donor ? (
                    <>
                      <div className="grid gap-3">
                        <InfoItem
                          icon={Droplet}
                          label="Blood group"
                          value={donor.bloodGroup}
                        />
                        <InfoItem
                          icon={CheckCircle2}
                          label="Availability"
                          value={
                            donor.isAvailable
                              ? "Available for requests"
                              : "Not available"
                          }
                        />
                        <InfoItem
                          icon={CalendarCheck}
                          label="Last donation"
                          value={formatDate(donor.lastDonationDate)}
                        />
                      </div>
                      <Button
                        className="h-12 rounded-full bg-red-700 text-white hover:bg-red-800"
                        onClick={() => setIsEditingDonor((current) => !current)}
                        type="button"
                      >
                        <Edit3 className="h-4 w-4" />
                        {isEditingDonor
                          ? "Close donor form"
                          : "Update donor details"}
                      </Button>
                    </>
                  ) : (
                    <div className="grid gap-4 rounded-2xl border border-red-100 bg-red-50/70 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700 text-white shadow-lg shadow-red-700/20">
                        <HeartHandshake className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-950">
                          Become a LifeDrop donor
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">
                          Add your blood group and availability so people near
                          your city can find help in urgent moments.
                        </p>
                      </div>
                      <Button
                        asChild
                        className="h-12 rounded-full bg-red-700 text-white hover:bg-red-800"
                      >
                        <Link href="/become-donor">Become a Donor</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {donor && isEditingDonor ? (
              <Card className="rounded-2xl border-red-100 bg-white/95 shadow-xl shadow-red-950/10">
                <CardHeader className="p-5 sm:p-6">
                  <h2 className="text-xl font-bold text-neutral-950">
                    Update Donor Details
                  </h2>
                  <p className="text-sm leading-6 text-neutral-600">
                    Update your blood group, contact preferences, location, and
                    availability.
                  </p>
                </CardHeader>
                <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                  <DonorEditForm
                    donor={donor}
                    onCancel={() => setIsEditingDonor(false)}
                  />
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
