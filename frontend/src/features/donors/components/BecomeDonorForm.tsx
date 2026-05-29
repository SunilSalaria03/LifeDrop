"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { City, State } from "country-state-city";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
} from "lucide-react";
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
  toGenderOrUndefined,
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

const parseIsoDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const subtractYears = (date: Date, years: number) =>
  new Date(date.getFullYear() - years, date.getMonth(), date.getDate());

const subtractDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return startOfDay(result);
};

const formatManualDateInput = (value: string): string => {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    return "";
  }
  const day = `${parsed.getDate()}`.padStart(2, "0");
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseManualDateInput = (input: string): Date | null => {
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
};

type DatePickerFieldProps = {
  ariaLabel: string;
  hasError: boolean;
  maxDate?: Date;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function DatePickerField({
  ariaLabel,
  hasError,
  maxDate,
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
  const todayIsoValue = toDateInputValue(new Date());
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
    const parsedSelectedDate = parseIsoDate(value);
    if (parsedSelectedDate) {
      setCurrentMonth(
        new Date(parsedSelectedDate.getFullYear(), parsedSelectedDate.getMonth(), 1),
      );
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
    onChange(toDateInputValue(pickedDate));
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

    onChange(toDateInputValue(parsed));
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
              const isoValue = toDateInputValue(dayDate);
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
                onChange(toDateInputValue(targetDate));
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

export function BecomeDonorForm({ user }: BecomeDonorFormProps) {
  const router = useRouter();
  const { createDonorProfileMutation } = useDonorProfile();
  const { showToast } = useToast();
  const states = useMemo(() => State.getStatesOfCountry("IN"), []);
  const maxBirthDate = useMemo(() => subtractYears(startOfDay(new Date()), 18), []);
  const maxLastDonationDate = useMemo(
    () => subtractDays(startOfDay(new Date()), 90),
    [],
  );
 
  const initialBirthDate =
    formatDateInputValue(user.birthDate) || toDateInputValue(maxBirthDate);
  const initialLastDonationDate =
    formatDateInputValue(user.lastDonationDate) || toDateInputValue(maxLastDonationDate);

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
      showMobile: user.showMobile ?? true,
      showEmail: user.showEmail ?? false,
      smsAlert: user.smsAlert ?? true,
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
          gender: toGenderOrUndefined(values.gender) ?? "other",
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
          showEmail: values.showEmail,
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
            <FieldError active={showValidationFeedback} message={getFieldError("birthDate")} />
           
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="lastDonationDate">
              Last donation date
            </FieldLabel>
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
            <FieldLabel>Show email</FieldLabel>
            <Select
              onValueChange={(value) =>
                void formik.setFieldValue("showEmail", value === "true", false)
              }
              value={booleanSelectValue(formik.values.showEmail)}
            >
              <SelectTrigger aria-label="Show email" className="h-12 rounded-2xl bg-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Show email</SelectItem>
                <SelectItem value="false">Hide email</SelectItem>
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
              className={cn(
                "h-12 rounded-2xl bg-white",
                getFieldError("addressLine") && "border-red-500 focus:border-red-500",
              )}
              id="addressLine"
              name="addressLine"
              onChange={formik.handleChange}
              placeholder="House, street, landmark"
              value={formik.values.addressLine}
            />
            <FieldError
              active={showValidationFeedback}
              message={getFieldError("addressLine")}
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
