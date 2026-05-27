import Link from "next/link";
import { HeartHandshake, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GenderAvatar } from "@/components/ui/gender-avatar";
import { cn } from "@/lib/utils";
import { formatDonorPhone, getDonorName, getInitials } from "./landing.helpers";
import { DonorCardProps } from "./landing.types";
import { calculateAgeFromDob } from "../../features/profile/profile.helpers";

function DetailItem({ label, value }: { label: string; value: string }) {
  console.log("value", value);
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
    <dt className="text-neutral-500">{label}</dt>
    <dd
      className={`truncate text-right font-medium ${
        value !== "N/A" ? "text-neutral-900" : "text-neutral-500"
      }`}
    >
      {value !== "N/A" ? value : "N/A"}
    </dd>
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

  const details: { label: string; value: string }[] = [
    {
      label: "Phone",
      value: formatDonorPhone(donor.phone, donor.showMobile),
    },
    {
      label: "Email",
      value: donor.email ?? "N/A",
    },
    {
      label: "Age",
      value: calculateAgeFromDob(donor.birthDate),
    },
    {
      label: "Gender",
      value: donor.gender !== undefined ? `${donor.gender}` : "N/A",
    },
    {
      label: "Distance",
      value: donor.distanceKm !== undefined ? `${donor.distanceKm} km` : "N/A",
    },
  ];

  return (
    <Card className="overflow-hidden rounded-2xl border-neutral-200 shadow-sm transition hover:border-neutral-300 hover:shadow-md">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4 border-b border-neutral-200 pb-4">
          <GenderAvatar
            alt={donorName}
            avatarUrl={donor.avatarUrl}
            className="h-14 w-14 shrink-0 border border-neutral-200 bg-neutral-50"
            fallback={getInitials(donor.name)}
            fallbackClassName="bg-neutral-100 text-base font-semibold text-neutral-700"
            gender={donor.gender}
          />

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
                  <span className="truncate">{location || "Location N/A"}</span>
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-red-700 px-2.5 py-1 text-sm font-semibold tabular-nums text-white">
                {donor.bloodGroup}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium",
                  donor.isAvailable
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-neutral-200 bg-neutral-50 text-neutral-600",
                )}
              >
                {donor.isAvailable ? "Available now" : "Not available"}
              </Badge>
              {donor.isVerified ? (
                <Badge className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                  Verified
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <dl className="divide-y divide-neutral-200 py-1">
          {details.map((item) => (
            <DetailItem
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </dl>

        <div
          className={cn(
            "mt-auto grid gap-2 pt-5",
            hideRequestButton ? "grid-cols-1" : "sm:grid-cols-2",
          )}
        >
          <Button
            asChild
            className="h-10 border-neutral-200 px-5 sm:h-11"
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
          {!hideRequestButton ? (
            <Button
              className="h-10 px-5 sm:h-11"
              disabled={!donor.isAvailable}
              onClick={() => onRequest?.(donor)}
              type="button"
            >
              <HeartHandshake className="h-4 w-4" />
              Request blood
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
