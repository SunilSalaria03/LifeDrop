'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bloodGroups } from '@/lib/constants/locations';

type BloodGroupDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BloodGroupDropdown({ value, onChange }: BloodGroupDropdownProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger aria-label="Blood group" className="h-14 rounded-2xl border-neutral-200 bg-white">
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
  );
}
