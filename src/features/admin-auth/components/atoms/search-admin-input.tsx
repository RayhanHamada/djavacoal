"use client";

import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

type SearchAdminInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function SearchAdminInput({
  value,
  onChange,
  disabled,
}: SearchAdminInputProps) {
  return (
    <TextInput
      placeholder="Type email or name to search user !"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      leftSection={<IconSearch size={16} />}
      disabled={disabled}
      styles={{
        root: {
          flexGrow: 1,
        },
      }}
    />
  );
}
