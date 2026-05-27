"use client";

import Link from "next/link";
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
import { AuthUser } from "@/features/auth/types/auth.types";
import { MyDonorProfile } from "@/features/donors/types/donor.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GenderAvatar } from "@/components/ui/gender-avatar";
import { cn } from "@/lib/utils";
import {
  formatDate,
  getDisplayName,
  getInitials,
  getMemberSinceYear,
  getProfileHeadline,
  getProfileLocation,
} from "./profile-page.helpers";
import {
  profileCard,
  profileCardBody,
  profileCardHeader,
  profileFieldCard,
} from "./profile-card.styles";
import { InfoItemProps } from "./profile-page.types";

type InfoFieldCardProps = InfoItemProps & {
  className?: string;
};

export function InfoFieldCard({
  icon: Icon,
  label,
  value,
  className,
}: InfoFieldCardProps) {
  return (
    <div className={cn(profileFieldCard, className)}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-700">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {label}
          </span>
          <span
            className={`mt-1 block break-words text-sm font-semibold ${value !== "N/A" ? "text-neutral-900" : "text-neutral-500"}`}
          >
            {value ?? "N/A"}
          </span>
        </span>
      </div>
    </div>
  );
}

export type ProfileHeaderCardProps = {
  completionPercent: number;
  donor: MyDonorProfile | null;
  isEditingProfile: boolean;
  onToggleEdit: () => void;
  user: AuthUser;
};

export function ProfileHeaderCard({
  completionPercent,
  donor,
  isEditingProfile,
  onToggleEdit,
  user,
}: ProfileHeaderCardProps) {
  const displayName = getDisplayName(user);
  const location = getProfileLocation(user);
  const headline = getProfileHeadline(
    user,
    donor?.bloodGroup ?? user.bloodGroup,
  );
  const memberYear = getMemberSinceYear(user.createdAt);
  const isDonorAccount = user.role === "donor" || Boolean(donor);

  return (
    <Card className={cn(profileCard, "w-full")}>
      <CardContent className={profileCardBody}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <GenderAvatar
            alt={displayName}
            avatarUrl={user.avatarUrl}
            className="h-20 w-20 shrink-0 border border-neutral-200 bg-red-50 shadow-sm sm:h-24 sm:w-24"
            fallback={getInitials(user.name, user.email, user.phone)}
            fallbackClassName="text-xl font-bold text-red-700 sm:text-2xl"
            gender={user.gender}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                    {displayName}
                  </h1>
                  {user.phoneVerified ? (
                    <ShieldCheck
                      aria-label="Verified profile"
                      className="h-5 w-5 shrink-0 text-red-700"
                    />
                  ) : null}
                </div>

                <p className="mt-1 text-sm text-neutral-600 sm:text-base">
                  {headline}
                  <span className="text-neutral-300"> · </span>
                  <span className="font-medium text-red-700">LifeDrop</span>
                </p>

                {location ? (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-600">
                    <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
                    {location}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                <Button
                  className="h-10 px-4"
                  onClick={onToggleEdit}
                  type="button"
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

            <div className="mt-4 flex flex-wrap gap-2">
              {(donor?.bloodGroup || user.bloodGroup) && (
                <Badge className="rounded-md border border-red-200 bg-red-50 font-medium text-red-800">
                  {donor?.bloodGroup ?? user.bloodGroup}
                </Badge>
              )}
              <Badge
                className={
                  user.phoneVerified
                    ? "gap-1 rounded-md border border-green-200 bg-green-50 font-medium text-green-800"
                    : "gap-1 rounded-md border border-amber-200 bg-amber-50 font-medium text-amber-800"
                }
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {user.phoneVerified ? "Phone verified" : "Phone pending"}
              </Badge>
              {isDonorAccount && donor ? (
                <Badge className="rounded-md border border-green-200 bg-green-50 font-medium text-green-800">
                  Active donor
                </Badge>
              ) : null}
              <Badge className="rounded-md border border-neutral-200 bg-neutral-50 font-medium text-neutral-700">
                {isDonorAccount ? "Donor account" : "User account"}
              </Badge>
              <Badge className="rounded-md border border-red-200 bg-red-50 font-medium text-red-800">
                Profile {completionPercent}% complete
              </Badge>
              {memberYear ? (
                <Badge className="rounded-md border border-neutral-200 bg-neutral-50 font-medium text-neutral-700">
                  Member since {memberYear}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PersonalInformationCard({
  donor,
  isDonor,
  user,
}: {
  donor: MyDonorProfile | null;
  isDonor: boolean;
  user: AuthUser;
}) {
  const getAge = (birthDate?: string) => {
    if (!birthDate) {
      return undefined;
    }

    const parsedBirthDate = new Date(birthDate);

    if (Number.isNaN(parsedBirthDate.getTime())) {
      return undefined;
    }

    const now = new Date();
    let age = now.getFullYear() - parsedBirthDate.getFullYear();
    const hasBirthdayPassedThisYear =
      now.getMonth() > parsedBirthDate.getMonth() ||
      (now.getMonth() === parsedBirthDate.getMonth() &&
        now.getDate() >= parsedBirthDate.getDate());

    if (!hasBirthdayPassedThisYear) {
      age -= 1;
    }

    return age >= 0 ? `${age}` : undefined;
  };

  const bloodGroup = user.bloodGroup ?? donor?.bloodGroup;
  const birthDate = user.birthDate ?? donor?.birthDate;
  const weight = user.weight ?? donor?.weight;
  const gender = user.gender ?? donor?.gender;
  const address = user.addressLine ?? user.addressText;
  const location = [user.district ?? user.city, user.state]
    .filter(Boolean)
    .join(", ");
  const lastDonationDate = user.lastDonationDate ?? donor?.lastDonationDate;

  const fields: InfoItemProps[] = [
    { icon: Droplet, label: "Blood group", value: bloodGroup },
    { icon: UserRound, label: "Name", value: user.name },
    { icon: Phone, label: "Phone number", value: user.phone },
    { icon: Mail, label: "Email", value: user.email },
    { icon: UserRound, label: "Gender", value: gender },
    { icon: CalendarCheck, label: "Age", value: getAge(birthDate) },
    {
      icon: CalendarCheck,
      label: "Weight",
      value: typeof weight === "number" ? `${weight} kg` : undefined,
    },
    {
      icon: CalendarCheck,
      label: "Last donation",
      value: formatDate(lastDonationDate),
    },

    {
      icon: MapPin,
      label: "Location",
      value: location,
    },
    { icon: MapPin, label: "Pin code", value: user.pincode },
    { icon: MapPin, label: "State", value: user.state },
    { icon: MapPin, label: "City", value: user.city ?? user.district },
    {
      icon: MapPin,
      label: "Address",
      value: address,
    },
  ];

  return (
    <Card className={cn(profileCard, "h-full")}>
      <CardHeader className={profileCardHeader}>
        <h2 className="text-lg font-bold text-neutral-950">
          Personal information
        </h2>
        <p className="text-sm text-neutral-600">
          Keep your name, phone, email, and address accurate so coordinators and
          donors can reach you during urgent requests.
        </p>
      </CardHeader>
      <CardContent className={cn(profileCardBody, "grid gap-3 sm:grid-cols-2")}>
        {fields.map((field) => (
          <InfoFieldCard
            key={field.label}
            className={field.label === "Address" ? "sm:col-span-2" : undefined}
            {...field}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <Card className={cn(profileCard, "w-full animate-pulse")}>
      <CardContent className={profileCardBody}>
        <div className="flex gap-6">
          <div className="h-24 w-24 shrink-0 rounded-full bg-neutral-200" />
          <div className="grid flex-1 gap-2">
            <div className="h-8 w-48 rounded-md bg-neutral-200" />
            <div className="h-4 w-64 rounded-md bg-neutral-100" />
            <div className="h-4 w-40 rounded-md bg-neutral-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileContentSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className={cn(profileCard, "h-96 animate-pulse bg-neutral-50")} />
      <div className={cn(profileCard, "h-80 animate-pulse bg-neutral-50")} />
    </div>
  );
}
