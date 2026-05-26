"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GenderAvatar } from "@/components/ui/gender-avatar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BannerBreadcrumbStrip } from "@/components/layout/BannerBreadcrumbStrip";
import { breadcrumbDonorDetail } from "@/components/layout/breadcrumb.presets";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { RequestBloodModal } from "@/features/donors/components/RequestBloodModal";
import { useDonorDetails } from "@/features/donors/hooks/useDonorDetails";
import { userStorage } from "@/lib/auth/user-storage";
import { getLastDonorSearchBackHref } from "@/lib/donor-search/donor-search-session";
import {
  formatDonorDate,
  formatDonorPhone,
  getDonorName,
  getInitials,
} from "@/components/landing/landing.helpers";
import { InfoFieldCard } from "@/app/profile/ProfilePageSections";
import {
  profileCard,
  profileCardBody,
  profileCardHeader,
  profileInsetPanel,
} from "@/app/profile/profile-card.styles";
import { DonorProfileHeaderProps } from "./donor-detail-page.types";
import { HeroSection } from "../../../components/landing/HeroSection";

function DonorProfileHeader({
  donor,
  isOwnDonorProfile,
  onRequestBlood,
}: DonorProfileHeaderProps & {
  isOwnDonorProfile: boolean;
  onRequestBlood: () => void;
}) {
  const donorName = getDonorName(donor.name);
  const location = [donor.city, donor.district, donor.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className={profileCard}>
      <CardContent className={profileCardBody}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <GenderAvatar
            alt={donorName}
            avatarUrl={donor.avatarUrl}
            className="h-20 w-20 shrink-0 border border-neutral-200 bg-red-50 shadow-sm sm:h-24 sm:w-24"
            fallback={getInitials(donor.name)}
            fallbackClassName="text-xl font-bold text-red-700 sm:text-2xl"
            gender={donor.gender}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                    {donorName}
                  </h1>
                  {donor.isVerified ? (
                    <ShieldCheck
                      aria-label="Verified donor"
                      className="h-5 w-5 shrink-0 text-red-700"
                    />
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-neutral-600 sm:text-base">
                  Blood donor
                  <span className="text-neutral-300"> · </span>
                  <span className="font-medium text-red-700">
                    {donor.bloodGroup}
                  </span>
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

              {!isOwnDonorProfile ? (
                <div className="flex shrink-0">
                  <Button
                    className="h-10 px-4"
                    disabled={!donor.isAvailable}
                    onClick={onRequestBlood}
                    type="button"
                  >
                    <HeartHandshake className="h-4 w-4" />
                    Request blood
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="rounded-md border border-red-200 bg-red-50 font-medium text-red-800">
                {donor.bloodGroup}
              </Badge>
              <Badge
                className={
                  donor.isAvailable
                    ? "gap-1 rounded-md border border-green-200 bg-green-50 font-medium text-green-800"
                    : "rounded-md border border-neutral-200 bg-neutral-50 font-medium text-neutral-600"
                }
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {donor.isAvailable ? "Available" : "Not available"}
              </Badge>
              {donor.isVerified ? (
                <Badge className="gap-1 rounded-md border border-green-200 bg-green-50 font-medium text-green-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified donor
                </Badge>
              ) : null}
              {donor.distanceKm !== undefined ? (
                <Badge className="rounded-md border border-neutral-200 bg-neutral-50 font-medium text-neutral-700">
                  {donor.distanceKm} km away
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DonorDetailPage() {
  const params = useParams<{ id: string }>();
  const donorId = params.id;
  const { meQuery } = useAuth();
  const donorQuery = useDonorDetails(donorId);
  const donor = donorQuery.data;
  const donorName = donor ? getDonorName(donor.name) : undefined;
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [backToSearchHref, setBackToSearchHref] = useState("/");

  useEffect(() => {
    setBackToSearchHref(getLastDonorSearchBackHref());
  }, []);

  const isOwnDonorProfile = Boolean(
    donor?.userId && meQuery.data?.id && donor.userId === meQuery.data.id,
  );

  const handleRequestBlood = () => {
    if (!meQuery.data && !userStorage.getUser()) {
      window.dispatchEvent(new CustomEvent("lifedrop:open-auth-modal"));
      return;
    }

    setIsRequestModalOpen(true);
  };

  return (
    <>
      <Header />
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbDonorDetail(donorName)} />
        <HeroSection />
      </div>
      <main className="min-h-screen bg-neutral-50 px-4 pb-12 pt-10 text-neutral-950 sm:px-6 sm:pt-12 lg:px-8">
        <div className="relative mx-auto grid w-full max-w-7xl gap-6">
          {donorQuery.isLoading ? (
            <Card className={`${profileCard} animate-pulse`}>
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
          ) : donorQuery.error ? (
            <Card className={profileCard}>
              <CardContent className={`${profileCardBody} text-center`}>
                <h1 className="text-xl font-bold text-neutral-950">
                  Donor profile unavailable
                </h1>
                <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-600">
                  {donorQuery.error.message}
                </p>
              </CardContent>
            </Card>
          ) : donor ? (
            <>
              <DonorProfileHeader
                donor={donor}
                isOwnDonorProfile={isOwnDonorProfile}
                onRequestBlood={handleRequestBlood}
              />

              <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <Card className={profileCard}>
                  <CardHeader className={profileCardHeader}>
                    <h2 className="text-lg font-bold text-neutral-950">
                      About this donor
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Review blood group, location, donation history, and
                      availability before you send a request.
                    </p>
                  </CardHeader>
                  <CardContent
                    className={`${profileCardBody} grid gap-3 sm:grid-cols-2`}
                  >
                    <InfoFieldCard
                      icon={HeartPulse}
                      label="Blood group"
                      value={donor.bloodGroup}
                    />
                    <InfoFieldCard
                      icon={CalendarClock}
                      label="Phone"
                      value={formatDonorPhone(donor.phone, donor.showMobile)}
                    />
                    <InfoFieldCard
                      icon={CalendarCheck}
                      label="Last donation"
                      value={formatDonorDate(donor.lastDonationDate)}
                    />
                    <InfoFieldCard
                      icon={Users}
                      label="Member since"
                      value={formatDonorDate(donor.createdAt)}
                    />
                    <InfoFieldCard
                      icon={MapPin}
                      label="Location"
                      value={[donor.city, donor.state]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    {donor.district ? (
                      <InfoFieldCard
                        icon={MapPin}
                        label="District"
                        value={donor.district}
                      />
                    ) : null}

                    <div className="sm:col-span-2">
                      <InfoFieldCard
                        icon={CalendarClock}
                        label="Address"
                        value={donor.addressLine ?? donor.addressText}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${profileCard} h-fit`}>
                  <CardHeader className={profileCardHeader}>
                    <h2 className="text-lg font-bold text-neutral-950">
                      Request blood
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Alert this donor when you need blood. They can respond if
                      they are available and eligible.
                    </p>
                  </CardHeader>
                  <CardContent className={`${profileCardBody} grid gap-4 pt-0`}>
                    <p
                      className={`${profileInsetPanel} text-sm leading-6 text-neutral-700`}
                    >
                      Your contact details are shared with the donor only after
                      you submit the request and they choose to respond.
                    </p>
                    <InfoFieldCard
                      icon={Phone}
                      label="Contact number"
                      value={formatDonorPhone(donor.phone, donor.showMobile)}
                    />
                    {!isOwnDonorProfile ? (
                      <Button
                        className="h-11 w-full"
                        disabled={!donor.isAvailable}
                        onClick={handleRequestBlood}
                        type="button"
                      >
                        <HeartHandshake className="h-4 w-4" />
                        Request blood
                      </Button>
                    ) : null}
                    <Button asChild className="h-11 w-full border-neutral-200">
                      <Link href={backToSearchHref}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to search
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <RequestBloodModal
                donor={donor}
                onOpenChange={setIsRequestModalOpen}
                onSuccess={() => setIsRequestModalOpen(false)}
                open={isRequestModalOpen}
              />
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
