'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { toIndianNationalNumber } from '@/lib/phone/india-phone';

type IndiaPhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
};

export const IndiaPhoneInput = React.forwardRef<HTMLInputElement, IndiaPhoneInputProps>(
  ({ className, disabled, onChange, placeholder = '9876543210', value, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex h-12 w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-300 bg-white text-sm outline-none transition-colors focus-within:border-red-700',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <span className="flex shrink-0 items-center gap-2 border-r border-neutral-200 bg-neutral-50 px-3 font-semibold text-neutral-800">
          <span aria-hidden="true">🇮🇳</span>
          <span>+91</span>
        </span>
        <input
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed"
          disabled={disabled}
          inputMode="numeric"
          maxLength={10}
          onChange={(event) => onChange(toIndianNationalNumber(event.target.value))}
          pattern="\d{10}"
          placeholder={placeholder}
          ref={ref}
          type="tel"
          value={value}
          {...props}
        />
      </div>
    );
  },
);

IndiaPhoneInput.displayName = 'IndiaPhoneInput';
