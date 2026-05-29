"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { City, State } from "country-state-city";
import { useFormik } from "formik";
import { CalendarDays, ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { IndiaPhoneInput } from "@/components/forms/IndiaPhoneInput";
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
import { BannerBreadcrumbStrip } from "@/components/layout/BannerBreadcrumbStrip";
import { breadcrumbProfile } from "@/components/layout/breadcrumb.presets";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthUser } from "@/features/auth/types/auth.types";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { updateProfileFormSchema } from "@/features/profile/validations/profile.validation";
import { bloodGroups } from "@/lib/constants/locations";
import { getApiErrorMessage } from "@/lib/api/error-message";
import {
  toIndianE164,
  toIndianNationalNumber,
} from "@/lib/phone/india-phone";
import { useToast } from "@/components/ui/toast";
import {
  booleanSelectValue,
  findStateCode,
  formatDateInputValue,
  toGenderOrUndefined,
} from "@/features/profile/profile.helpers";
import { HeroSection } from "../../components/landing/HeroSection";
import {
  profileCard,
  profileCardBody,
  profileCardHeader,
  profileInsetPanel,
} from "./profile-card.styles";
import { 
  PersonalInformationCard,
  ProfileContentSkeleton,
  ProfileHeaderCard,
  ProfileHeaderSkeleton,
} from "./ProfilePageSections";
import { cn } from "@/lib/utils";

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-black uppercase tracking-normal text-neutral-500">
      {children}
    </span>
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

function parseIsoDate(value: string): Date | null {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function subtractYears(date: Date, years: number): Date {
  return new Date(date.getFullYear() - years, date.getMonth(), date.getDate());
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return startOfDay(result);
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string): string {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    return "";
  }
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatManualDateInput(value: string): string {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    return "";
  }
  const day = `${parsed.getDate()}`.padStart(2, "0");
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseManualDateInput(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const ddMmYyyy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddMmYyyy) {
    const day = Number(ddMmYyyy[1]);
    const month = Number(ddMmYyyy[2]);
    const year = Number(ddMmYyyy[3]);
    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }
    return null;
  }

  return parseIsoDate(trimmed);
}

type DatePickerFieldProps = {
  ariaLabel: string;
  hasError: boolean;
  maxDate?: Date;
  minDate?: Date;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function DatePickerField({
  ariaLabel,
  hasError,
  maxDate,
  minDate,
  name,
  onChange,
  placeholder,
  value,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = parseIsoDate(value);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate ?? new Date(),
  );
  const [inputValue, setInputValue] = useState(formatManualDateInput(value));
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const todayIsoValue = toIsoDate(new Date());
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100;
  const endYear = currentYear + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
    setInputValue(formatManualDateInput(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) {
        return;
      }
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const leadingEmptyDays = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const isDateSelectable = (date: Date) => {
    const normalized = startOfDay(date);
    if (minDate && normalized < startOfDay(minDate)) {
      return false;
    }
    if (maxDate && normalized > startOfDay(maxDate)) {
      return false;
    }
    return true;
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );
  };

  const selectDate = (day: number) => {
    const pickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    if (!isDateSelectable(pickedDate)) {
      return;
    }
    onChange(toIsoDate(pickedDate));
    setIsOpen(false);
  };

  const clearDate = () => {
    onChange("");
    setIsOpen(false);
  };

  const applyManualDateInput = () => {
    if (!inputValue.trim()) {
      onChange("");
      return;
    }

    const parsed = parseManualDateInput(inputValue);
    if (!parsed || !isDateSelectable(parsed)) {
      setInputValue(formatManualDateInput(value));
      return;
    }

    onChange(toIsoDate(parsed));
    setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Input
          aria-label={ariaLabel}
          className={cn(
            "h-12 rounded-2xl bg-white pl-4 pr-12 text-left focus-visible:border-red-700 focus-visible:ring-2 focus-visible:ring-red-100",
            hasError && "border-red-500 focus-visible:border-red-500",
          )}
          inputMode="numeric"
          name={name}
          onBlur={applyManualDateInput}
          onChange={(event) => setInputValue(event.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          value={inputValue}
        />
        <button
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={`${ariaLabel} calendar`}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100"
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
        >
          <CalendarDays className="h-5 w-5 shrink-0" />
        </button>
      </div>

      {isOpen ? (
        <div className="absolute z-30 mt-2 w-full min-w-[280px] rounded-2xl border border-neutral-200 bg-white p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
              onClick={() => changeMonth(-1)}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex flex-1 items-center gap-2">
              <select
                aria-label="Select month"
                className="h-9 w-full rounded-lg border border-neutral-300 bg-white px-2 text-sm text-neutral-900 outline-none focus:border-red-700"
                onChange={(event) =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      Number(event.target.value),
                      1,
                    ),
                  )
                }
                value={currentMonth.getMonth()}
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                aria-label="Select year"
                className="h-9 w-[104px] rounded-lg border border-neutral-300 bg-white px-2 text-sm text-neutral-900 outline-none focus:border-red-700"
                onChange={(event) =>
                  setCurrentMonth(
                    new Date(
                      Number(event.target.value),
                      currentMonth.getMonth(),
                      1,
                    ),
                  )
                }
                value={currentMonth.getFullYear()}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
              onClick={() => changeMonth(1)}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: leadingEmptyDays }).map((_, index) => (
              <span className="h-9 w-9" key={`empty-${index}`} />
            ))}
            {days.map((day) => {
              const dayDate = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day,
              );
              const isoValue = toIsoDate(dayDate);
              const isSelected = value === isoValue;
              const isToday = todayIsoValue === isoValue;
              const isDisabled = !isDateSelectable(dayDate);

              return (
                <button
                  className={cn(
                    "h-9 w-9 rounded-lg text-sm transition-colors",
                    !isDisabled && "hover:bg-red-50 hover:text-red-700",
                    isDisabled && "cursor-not-allowed text-neutral-300",
                    isToday && "ring-1 ring-red-300",
                    isSelected && "bg-red-700 text-white hover:bg-red-700 hover:text-white",
                  )}
                  disabled={isDisabled}
                  key={isoValue}
                  onClick={() => selectDate(day)}
                  type="button"
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between border-t border-neutral-100 pt-3">
            <button
              className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-800"
              onClick={clearDate}
              type="button"
            >
              Clear
            </button>
            <button
              className="text-xs font-medium text-red-700 transition-colors hover:text-red-800"
              onClick={() => {
                const targetDate = maxDate ? startOfDay(maxDate) : startOfDay(new Date());
                if (!isDateSelectable(targetDate)) {
                  return;
                }
                onChange(toIsoDate(targetDate));
                setCurrentMonth(
                  new Date(targetDate.getFullYear(), targetDate.getMonth(), 1),
                );
                setIsOpen(false);
              }}
              type="button"
            >
              {maxDate ? "Latest allowed" : "Today"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6">
      <ProfileHeaderSkeleton />
      <ProfileContentSkeleton />
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
  const today = startOfDay(new Date());
  const maxBirthDate = subtractYears(today, 18);
  const maxLastDonationDate = subtractDays(today, 90);

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
      showEmail: user.showEmail ?? false,
      smsAlert: user.smsAlert ?? false,
      pincode: user.pincode ?? "",
      state: user.state ?? "",
      stateCode: findStateCode(user.state),
      district: user.district ?? user.city ?? "",
      addressLine: user.addressLine ?? user.addressText ?? "",
      lat: user.location?.coordinates?.[1],
      lng: user.location?.coordinates?.[0],
    },
    validationSchema: updateProfileFormSchema,
    enableReinitialize: true,
    validateOnChange: true,
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
          addressLine: values.addressLine || undefined,
          addressText: values.addressLine || undefined,
          lat: values.lat,
          lng: values.lng,
          ...(isDonor
            ? {
                bloodGroup: values.bloodGroup || undefined,
                gender: toGenderOrUndefined(values.gender),
                birthDate: values.birthDate || undefined,
                weight: values.weight ? Number(values.weight) : undefined,
                lastDonationDate: values.lastDonationDate || undefined,
                showMobile: values.showMobile,
                showEmail: values.showEmail,
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
      lat: undefined,
      lng: undefined,
    }, true);
  };

  const handleDistrictChange = (districtName: string) => {
    const selectedDistrict = districts.find(
      (city) => city.name === districtName,
    );
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
        <h3 className="text-base font-bold text-neutral-950">
          Login Information
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2">
            <FieldLabel>Full name</FieldLabel>
            <Input
              aria-label="Full name"
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("name") && "border-red-500 focus:border-red-500",
              )}
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Full name"
              value={formik.values.name}
            />
            <FieldError active={showValidationFeedback} message={getFieldError("name")} />
          </label>
          <label className="grid gap-2">
            <FieldLabel>Email</FieldLabel>
            <Input
              aria-label="Email"
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("email") && "border-red-500 focus:border-red-500",
              )}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Email"
              type="email"
              value={formik.values.email}
            />
            <FieldError active={showValidationFeedback} message={getFieldError("email")} />
          </label>
          <label className="grid gap-2">
            <FieldLabel>Mobile number</FieldLabel>
            <IndiaPhoneInput
              aria-label="Mobile number"
              disabled
              name="phone"
              onBlur={formik.handleBlur}
              onChange={(phone) =>
                void formik.setFieldValue("phone", phone, false)
              }
              placeholder="Mobile number"
              value={formik.values.phone}
            />
          </label>
        </div>
      </section>

      {isDonor ? (
        <section className={cn(profileInsetPanel, "grid gap-4 sm:p-5")}>
          <h3 className="text-base font-bold text-neutral-950">
            Donor Information
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="grid gap-2">
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
              <FieldError
                active={showValidationFeedback}
                message={getFieldError("bloodGroup")}
              />
            </label>
            <label className="grid gap-2">
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
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FieldError active={showValidationFeedback} message={getFieldError("gender")} />
            </label>
            <label className="grid gap-2">
              <FieldLabel>Weight</FieldLabel>
              <Input
                aria-label="Weight"
                className={cn(
                  "h-12 rounded-2xl bg-white",
                  getFieldError("weight") && "border-red-500 focus:border-red-500",
                )}
                inputMode="numeric"
                min={1}
                name="weight"
                onChange={(event) =>
                  void formik.setFieldValue("weight", event.target.value, true)
                }
                placeholder="Weight"
                type="number"
                value={formik.values.weight}
              />
              <FieldError active={showValidationFeedback} message={getFieldError("weight")} />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2">
              <FieldLabel>Birth date</FieldLabel>
              <DatePickerField
                ariaLabel="Birth date"
                hasError={Boolean(getFieldError("birthDate"))}
                maxDate={maxBirthDate}
                name="birthDate"
                onChange={(nextValue) =>
                  void formik.setFieldValue("birthDate", nextValue, true)
                }
                placeholder="DD/MM/YYYY"
                value={formik.values.birthDate}
              />
              <FieldError
                active={showValidationFeedback}
                message={getFieldError("birthDate")}
              />
            </label>
            <label className="grid gap-2">
              <FieldLabel>Last donation date</FieldLabel>
              <DatePickerField
                ariaLabel="Last donation date"
                hasError={Boolean(getFieldError("lastDonationDate"))}
                maxDate={maxLastDonationDate}
                name="lastDonationDate"
                onChange={(nextValue) =>
                  void formik.setFieldValue("lastDonationDate", nextValue, true)
                }
                placeholder="DD/MM/YYYY"
                value={formik.values.lastDonationDate}
              />
              <FieldError
                active={showValidationFeedback}
                message={getFieldError("lastDonationDate")}
              />
            </label>
          </div>
        </section>
      ) : null}

      <section className={cn(profileInsetPanel, "grid gap-4 sm:p-5")}>
        <h3 className="text-base font-bold text-neutral-950">
          Contact Information
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isDonor ? (
            <label className="grid gap-2">
              <FieldLabel>Mobile visibility</FieldLabel>
              <Select
                onValueChange={(value) =>
                  void formik.setFieldValue(
                    "showMobile",
                    value === "true",
                    false,
                  )
                }
                value={booleanSelectValue(formik.values.showMobile)}
              >
                <SelectTrigger
                  aria-label="Mobile visibility"
                  className="h-12 rounded-2xl bg-white"
                >
                  <SelectValue placeholder="Show mobile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Show mobile</SelectItem>
                  <SelectItem value="false">Hide mobile</SelectItem>
                </SelectContent>
              </Select>
            </label>
          ) : null}
          {isDonor ? (
            <label className="grid gap-2">
              <FieldLabel>Email visibility</FieldLabel>
              <Select
                onValueChange={(value) =>
                  void formik.setFieldValue(
                    "showEmail",
                    value === "true",
                    false,
                  )
                }
                value={booleanSelectValue(formik.values.showEmail)}
              >
                <SelectTrigger
                  aria-label="Email visibility"
                  className="h-12 rounded-2xl bg-white"
                >
                  <SelectValue placeholder="Hide email" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Show email</SelectItem>
                  <SelectItem value="false">Hide email</SelectItem>
                </SelectContent>
              </Select>
            </label>
          ) : null}
          {isDonor ? (
            <label className="grid gap-2">
              <FieldLabel>SMS alerts</FieldLabel>
              <Select
                onValueChange={(value) =>
                  void formik.setFieldValue("smsAlert", value === "true", false)
                }
                value={booleanSelectValue(formik.values.smsAlert)}
              >
                <SelectTrigger
                  aria-label="SMS alert"
                  className="h-12 rounded-2xl bg-white"
                >
                  <SelectValue placeholder="SMS alert" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">SMS alerts on</SelectItem>
                  <SelectItem value="false">SMS alerts off</SelectItem>
                </SelectContent>
              </Select>
            </label>
          ) : null}
   
          <label className="grid gap-2 sm:col-span-2 lg:col-span-3">
            <FieldLabel>Address line</FieldLabel>
            <Input
              aria-label="Address line"
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("addressLine") && "border-red-500 focus:border-red-500",
              )}
              name="addressLine"
              onChange={formik.handleChange}
              placeholder="Address line"
              value={formik.values.addressLine}
            />
            <FieldError
              active={showValidationFeedback}
              message={getFieldError("addressLine")}
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-2">
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
            <FieldError
              active={showValidationFeedback}
              message={getFirstError(["stateCode", "state"])}
            />
          </label>

          <label className="grid gap-2">
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
                  getFieldError("district") && "border-red-500 focus:border-red-500",
                )}
              >
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
            <FieldError active={showValidationFeedback} message={getFieldError("district")} />
          </label>
          <label className="grid gap-2">
            <FieldLabel>Pin code</FieldLabel>
            <Input
              aria-label="Pin code"
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("pincode") && "border-red-500 focus:border-red-500",
              )}
              inputMode="numeric"
              maxLength={6}
              name="pincode"
              onChange={formik.handleChange}
              placeholder="Pin code"
              value={formik.values.pincode}
            />
            <FieldError active={showValidationFeedback} message={getFieldError("pincode")} />
          </label>
        </div>
      </section>

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
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          className="h-12 rounded-full bg-red-700 text-white hover:bg-red-800"
          disabled={updateProfileMutation.isPending}
          type="submit"
        >
          <Save className="h-4 w-4" />
          {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { meQuery } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const user = meQuery.data;
  const donor = user?.donorProfile ?? null;
  const isLoading = meQuery.isLoading;
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
      <div className="bg-slate-900 text-neutral-950">
        <BannerBreadcrumbStrip items={breadcrumbProfile} />
        <HeroSection />
      </div>
      <main className="min-h-screen bg-neutral-50 px-4 pb-12 pt-10 text-neutral-950 sm:px-6 sm:pt-12 lg:px-8">
        {isLoading || !user ? (
          <div className="mx-auto w-full max-w-7xl">
            <ProfileSkeleton />
          </div>
        ) : (
          <div className="relative mx-auto grid w-full max-w-7xl gap-6">
            <ProfileHeaderCard
              completionPercent={completionPercent}
              donor={donor}
              isEditingProfile={isEditingProfile}
              onToggleEdit={() =>
                setIsEditingProfile((current) => !current)
              }
              user={user}
            />

            {isEditingProfile ? (
              <Card className={profileCard}>
                <CardHeader className={profileCardHeader}>
                  <h2 className="text-lg font-bold text-neutral-950">
                    Update Profile
                  </h2>
                  <p className="text-sm text-neutral-600">
                    Keep your contact and location details accurate for faster
                    request handling.
                  </p>
                </CardHeader>
                <CardContent className={profileCardBody}>
                  <ProfileEditForm
                    onCancel={() => setIsEditingProfile(false)}
                    user={user}
                  />
                </CardContent>
              </Card>
            ) : null}

            <div className="grid gap-6">
              <PersonalInformationCard
                donor={donor}
                isDonor={isDonor}
                user={user}
              />
 
            </div>
          </div>
        )}
      </main>
      <Footer />
    </ProtectedRoute>
  );
}
