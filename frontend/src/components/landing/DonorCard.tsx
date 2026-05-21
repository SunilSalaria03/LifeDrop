import Link from "next/link";
import {
  CalendarCheck,
  HeartHandshake,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatDonorDate,
  formatDonorPhone,
  getDonorName,
  getInitials,
} from "./landing.helpers";
import { DonorCardProps } from "./landing.types";

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="truncate text-right font-medium text-neutral-900">{value}</dd>
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

  const details: { label: string; value: string }[] = [];

  if (donor.distanceKm !== undefined) {
    details.push({
      label: "Distance",
      value: `${donor.distanceKm} km`,
    });
  }

  details.push({
    label: "Last donation",
    value: formatDonorDate(donor.lastDonationDate),
  });

  if (donor.phone) {
    details.push({
      label: "Contact",
      value: formatDonorPhone(donor.phone, donor.showMobile),
    });
  }

  details.push({
    label: "Total donations",
    value:
      donor.totalDonations !== undefined
        ? String(donor.totalDonations)
        : "Not provided",
  });

  return (
    <Card className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4 border-b border-neutral-100 pb-4">
          <Avatar className="h-14 w-14 shrink-0 border border-neutral-200 bg-neutral-50">
            {donor.profileImage ? (
              <AvatarImage alt={donorName} src={donor.profileImage} />
            ) : null}
            <AvatarFallback className="bg-neutral-100 text-base font-semibold text-neutral-700">
              {getInitials(donor.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="truncate text-lg font-semibold text-neutral-950">
                    {donorName}
                  </h3>
                  {donor.isVerified ? (
                    <ShieldCheck
                      aria-label="Verified donor"
                      className="h-4 w-4 shrink-0 text-red-600"
                    />
                  ) : null}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-600">
                  <MapPin
                    className="h-3.5 w-3.5 shrink-0 text-neutral-400"
                    aria-hidden
                  />
                  <span className="truncate">
                    {location || "Location not provided"}
                  </span>
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-red-700 px-2.5 py-1 text-sm font-semibold tabular-nums text-white">
                {donor.bloodGroup}
              </span>
            </div>

            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-neutral-500">
              <span
                className={cn(
                  donor.isAvailable ? "text-green-700" : "text-neutral-500",
                )}
              >
                {donor.isAvailable ? "Available now" : "Not available"}
              </span>
              {donor.isVerified ? (
                <>
                  <span aria-hidden className="text-neutral-300">
                    ·
                  </span>
                  <span>Verified</span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <dl className="divide-y divide-neutral-100 py-1">
          {details.map((item) => (
            <DetailItem key={item.label} label={item.label} value={item.value} />
          ))}
        </dl>

        <div
          className={cn(
            "mt-auto grid gap-2 pt-5",
            hideRequestButton ? "grid-cols-1" : "sm:grid-cols-2",
          )}
        >
          {!hideRequestButton ? (
            <Button
              className="h-10 rounded-lg bg-red-700 text-sm font-semibold text-white hover:bg-red-800"
              disabled={!donor.isAvailable}
              onClick={() => onRequest?.(donor)}
              type="button"
            >
              <HeartHandshake className="h-4 w-4" />
              Request blood
            </Button>
          ) : null}
          <Button
            asChild
            className="h-10 rounded-lg border-neutral-200 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            variant="outline"
          >
            <Link
              aria-label={`View ${donorName} donor profile`}
              href={`/donors/${donor.id}`}
            >
              <UserRound className="h-4 w-4" />
              View profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
