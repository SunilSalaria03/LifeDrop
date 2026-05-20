import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatDonorDate,
  formatDonorPhone,
  getDonorName,
  getInitials,
} from "./landing.helpers";
import { DonorCardProps } from "./landing.types";
function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="group/row flex min-w-0 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 shadow-sm shadow-neutral-950/5 transition hover:border-red-100 hover:bg-red-50/30">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700 transition group-hover/row:bg-red-700 group-hover/row:text-white">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-black uppercase tracking-normal text-neutral-500">
          {label}
        </span>
        <span className="block truncate text-sm font-semibold text-neutral-900">
          {value}
        </span>
      </span>
    </div>
  );
}

export function DonorCard({
  donor,
  hideRequestButton = false,
  onRequest,
}: DonorCardProps) {
  const donorName = getDonorName(donor.name);
  const location = [donor.city, donor.district, donor.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="group overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm shadow-neutral-950/5 transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-md hover:shadow-red-950/10">
      <CardContent className="grid gap-0 p-0">
        <div className="relative overflow-hidden border-b border-red-50 bg-[linear-gradient(135deg,#fff7f7_0%,#ffffff_65%)] p-5">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white bg-red-50 shadow-sm shadow-neutral-950/10 ring-4 ring-red-50">
                {donor.profileImage ? (
                  <AvatarImage alt={donorName} src={donor.profileImage} />
                ) : null}
                <AvatarFallback className="bg-red-50 text-lg text-red-700">
                  {getInitials(donor.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="truncate text-xl font-black text-neutral-950">
                    {donorName}
                  </h3>
                  {donor.isVerified ? (
                    <ShieldCheck
                      aria-label="Verified donor"
                      className="h-5 w-5 shrink-0 text-red-600"
                    />
                  ) : null}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-600">
                  <MapPin className="h-4 w-4 shrink-0 text-red-600" />
                  <span className="truncate">
                    {location || "Location not provided"}
                  </span>
                </p>
              </div>
            </div>

            <Badge className="w-fit shrink-0 rounded-2xl bg-red-700 px-4 py-2 text-lg font-black text-white shadow-sm shadow-red-950/10">
              {donor.bloodGroup}
            </Badge>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                donor.isAvailable
                  ? "gap-1.5 rounded-full bg-green-50 px-3.5 py-1.5 font-bold text-green-700 ring-1 ring-green-100"
                  : "gap-1.5 rounded-full bg-neutral-100 px-3.5 py-1.5 font-bold text-neutral-600 ring-1 ring-neutral-200"
              }
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {donor.isAvailable ? "Available now" : "Not available"}
            </Badge>
            {donor.isVerified ? (
              <Badge className="gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 font-bold text-blue-700 ring-1 ring-blue-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified donor
              </Badge>
            ) : null}
          </div>

          <div className="grid gap-2.5 rounded-3xl border border-red-100 bg-red-50/25 p-3.5">
            {donor.distanceKm !== undefined ? (
              <DetailRow
                icon={Navigation}
                label="Distance"
                value={`${donor.distanceKm} km away`}
              />
            ) : null}
              <DetailRow
                icon={CalendarCheck}
                label="Last donation"
                value={formatDonorDate(donor.lastDonationDate)}
              />
            {donor.phone ? (
              <DetailRow
                icon={Phone}
                label="Contact"
                value={formatDonorPhone(donor.phone, donor.showMobile)}
              />
            ) : null}
            {donor.totalDonations !== undefined ? (
              <DetailRow
                icon={HeartPulse}
                label="Total donations"
                value={`${donor.totalDonations}`}
              />
            ) : null}
            {donor.totalDonations === undefined ? (
              <DetailRow
                icon={HeartPulse}
                label="Total donations"
                value="Not provided"
              />
            ) : null}
          </div>

          <div className={hideRequestButton ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
            {!hideRequestButton ? (
              <Button
                className="h-12 rounded-full bg-red-700 text-base font-bold text-white shadow-sm shadow-red-950/10 transition hover:bg-red-800"
                disabled={!donor.isAvailable}
                onClick={() => onRequest?.(donor)}
                type="button"
              >
                <HeartHandshake className="h-4 w-4" />
                Request
              </Button>
            ) : null}
            <Button
              asChild
              className="h-12 rounded-full border-red-100 bg-white text-base font-bold text-red-700 shadow-sm shadow-neutral-950/5 transition hover:bg-red-50"
              variant="outline"
            >
              <Link
                aria-label={`View ${donorName} donor profile`}
                href={`/donors/${donor.id}`}
              >
                <UserRound className="h-4 w-4" />
                View Profile
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
