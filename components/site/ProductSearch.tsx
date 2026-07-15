"use client";

import { SearchInput } from "@/components/ui/form";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function ProductSearch({ value, onChange }: Props) {
  return (
    <SearchInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClear={() => onChange("")}
      placeholder="Search product..."
      size="md"
    />
  );
}
