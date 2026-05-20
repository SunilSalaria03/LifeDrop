"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Droplet,
  HeartPulse,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { RequestBloodModal } from "@/features/donors/components/RequestBloodModal";
import { useDonorDetails } from "@/features/donors/hooks/useDonorDetails";
import { userStorage } from "@/lib/auth/user-storage";
import {
  formatDonorDate,
  formatDonorPhone,
  getDonorName,
  getInitials,
} from "@/components/landing/landing.helpers";
import { DetailItemProps, DonorProfileHeaderProps } from "./donor-detail-page.types";
import { HeroSection } from "../../../components/landing/HeroSection";
function DetailItem({
  icon: Icon,
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="group flex min-w-0 items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm shadow-neutral-950/5 transition hover:border-red-100 hover:bg-red-50/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700 transition group-hover:bg-red-700 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-normal text-neutral-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-bold text-neutral-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function DonorProfileHeader({ donor }: DonorProfileHeaderProps) {
  const donorName = getDonorName(donor.name);
  const location = [donor.city, donor.district, donor.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm shadow-neutral-950/5">
      <div className="h-1.5 bg-[linear-gradient(90deg,#dc2626,#fb7185,#fee2e2)]" />
      <CardContent className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6 lg:p-8">
        <Avatar className="h-24 w-24 border-4 border-white bg-red-50 shadow-sm shadow-neutral-950/10 ring-4 ring-red-50">
          {donor.profileImage ? (
            <AvatarImage alt={donorName} src={donor.profileImage} />
          ) : null}
          <AvatarFallback className="text-2xl text-red-700">
            {getInitials(donor.name)}
          </AvatarFallback>
        </Avatar>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="break-words text-3xl font-black tracking-normal text-neutral-950 sm:text-4xl">
                {donorName}
              </h1>
              {donor.isVerified ? (
                <ShieldCheck
                  aria-label="Verified donor"
                  className="h-6 w-6 text-red-600"
                />
              ) : null}
            </div>
            <p className="flex items-start gap-2 text-sm font-semibold text-neutral-600 sm:text-base">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <span className="break-words">
                {location || "Location not provided"}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-red-50 px-4 py-2 text-base font-bold text-red-700 ring-1 ring-red-100">
              {donor.bloodGroup}
            </Badge>
            <Badge
              className={
                donor.isAvailable
                  ? "gap-1.5 rounded-full bg-green-50 px-4 py-2 font-bold text-green-700 ring-1 ring-green-100"
                  : "gap-1.5 rounded-full bg-neutral-100 px-4 py-2 font-bold text-neutral-600 ring-1 ring-neutral-200"
              }
            >
              <CheckCircle2 className="h-4 w-4" />
              {donor.isAvailable ? "Available" : "Not Available"}
            </Badge>
            {donor.isVerified ? (
              <Badge className="gap-1.5 rounded-full bg-red-50 px-4 py-2 font-bold text-red-700 ring-1 ring-red-100">
                <ShieldCheck className="h-4 w-4" />
                Verified
              </Badge>
            ) : null}
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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
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
      <div className="bg-slate-900 pt-16 text-neutral-950 sm:pt-18">
      <HeroSection />
      </div>
      <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_48%,#fff7f7_100%)] px-4 pb-10 pt-28 text-neutral-950 sm:px-6 sm:pb-12 sm:pt-32 lg:px-8">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-red-50 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-96 h-72 w-72 rounded-full bg-red-50/80 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-6">
          <Button asChild className="w-fit rounded-full border-red-100 bg-white px-5 font-bold shadow-sm hover:bg-red-50" variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </Button>

          {donorQuery.isLoading ? (
            <Card className="animate-pulse rounded-3xl border border-red-100 bg-white shadow-sm shadow-neutral-950/5">
              <CardContent className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:p-6 lg:p-8">
                <div className="h-24 w-24 rounded-full bg-neutral-200" />
                <div className="grid gap-3">
                  <div className="h-8 w-64 max-w-full rounded-full bg-neutral-200" />
                  <div className="h-5 w-80 max-w-full rounded-full bg-neutral-100" />
                  <div className="flex gap-2">
                    <div className="h-9 w-16 rounded-full bg-red-100" />
                    <div className="h-9 w-28 rounded-full bg-green-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : donorQuery.error ? (
            <Card className="rounded-3xl border border-red-100 bg-red-50 shadow-sm">
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-800">
                  Donor profile unavailable
                </h1>
                <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-red-700">
                  {donorQuery.error.message}
                </p>
              </CardContent>
            </Card>
          ) : donor ? (
            <>
              <DonorProfileHeader donor={donor} />

              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <Card className="rounded-3xl border border-red-100 bg-white shadow-sm shadow-neutral-950/5">
                  <CardHeader className="p-5 sm:p-6">
                    <h2 className="text-xl font-black text-neutral-950">
                      Donor Details
                    </h2>
                  </CardHeader>
                  <CardContent className="grid gap-3 p-5 pt-0 sm:grid-cols-2 sm:p-6 sm:pt-0">
                    <DetailItem
                      icon={HeartPulse}
                      label="Blood group"
                      value={donor.bloodGroup}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="Location"
                      value={[donor.city, donor.state]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <DetailItem icon={MapPin} label="City" value={donor.city} />
                    <DetailItem
                      icon={MapPin}
                      label="State"
                      value={donor.state}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="District"
                      value={donor.district ?? "Not provided"}
                    />
                    {donor.distanceKm !== undefined ? (
                      <DetailItem
                        icon={Navigation}
                        label="Distance"
                        value={`${donor.distanceKm} km away`}
                      />
                    ) : null}
                    <DetailItem
                      icon={CalendarCheck}
                      label="Last donation"
                      value={formatDonorDate(donor.lastDonationDate)}
                    />
                    <DetailItem
                      icon={CalendarClock}
                      label="Next eligible"
                      value={formatDonorDate(donor.nextEligibleDate)}
                    />
                    <DetailItem
                      icon={HeartPulse}
                      label="Total donations"
                      value={`${donor.totalDonations ?? 0}`}
                    />
                    <DetailItem
                      icon={Users}
                      label="Member since"
                      value={formatDonorDate(donor.createdAt)}
                    />
                    <DetailItem
                      icon={Phone}
                      label="Contact"
                      value={formatDonorPhone(donor.phone , donor.showMobile)}
                    />
                  </CardContent>
                </Card>

                <Card className="h-fit overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm shadow-neutral-950/5">
                  <div className="h-1.5 bg-[linear-gradient(90deg,#dc2626,#fb7185)]" />
                  <CardHeader className="p-5 sm:p-6">
                    <h2 className="text-xl font-black text-neutral-950">
                      Request Support
                    </h2>
                  </CardHeader>
                  <CardContent className="grid gap-4 p-5 pt-0 sm:p-6 sm:pt-0">
                    <p className="rounded-2xl border border-red-100 bg-red-50/70 p-4 text-sm font-semibold leading-6 text-red-800">
                      Contact details are shared only after request approval.
                    </p>
                    {!isOwnDonorProfile ? (
                      <Button
                        className="h-12 w-full rounded-full bg-red-700 text-white hover:bg-red-800"
                        disabled={!donor.isAvailable}
                        onClick={handleRequestBlood}
                        type="button"
                      >
                        <Droplet className="h-4 w-4" />
                        Request Blood
                      </Button>
                    ) : null}
                    <Button
                      asChild
                      className="h-12 w-full rounded-full border-red-100 bg-white font-bold hover:bg-red-50"
                      variant="outline"
                    >
                      <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Search
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
