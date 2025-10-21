"use client";

import { useState } from "react";

import { MultiSelect } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { TagsIcon } from "lucide-react";

import { rpc } from "@/lib/rpc";

interface NewsTagsSelectProps {
    /** Selected tag names */
    value: string[];
    /** Callback when tags change */
    onChange: (tags: string[]) => void;
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Label */
    label?: string;
    /** Placeholder */
    placeholder?: string;
    /** Required field */
    required?: boolean;
}

/**
 * NewsTagsSelect component for selecting and creating tags
 * Allows autocomplete from existing tags and creating new ones by typing and pressing Enter
 */
export function NewsTagsSelect({
    value,
    onChange,
    disabled = false,
    error,
    label = "Tags",
    placeholder = "Select or create tags (press Enter to create new)",
    required = false,
}: NewsTagsSelectProps) {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch] = useDebouncedValue(searchValue, 300);

    // Fetch existing tags with search
    const { data } = useQuery(
        rpc.dashboardNews.listTags.queryOptions({
            staleTime: 5 * 60 * 1000, // 5 minutes
            input: {
                search: debouncedSearch || undefined,
            },
        })
    );

    const existingTags = data?.items || [];

    // Convert existing tags to MultiSelect data format
    const tagOptions = existingTags.map((tag) => tag.name);

    // Add search value if it doesn't exist
    const allOptions =
        searchValue && !tagOptions.includes(searchValue)
            ? [...tagOptions, searchValue]
            : tagOptions;

    return (
        <MultiSelect
            label={label}
            leftSection={<TagsIcon size={16} />}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            data={allOptions}
            searchable
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            disabled={disabled}
            error={error}
            required={required}
            maxDropdownHeight={200}
            clearable
            hidePickedOptions
            onKeyDown={(event) => {
                // Allow creating new tags by pressing Enter
                if (
                    event.key === "Enter" &&
                    searchValue &&
                    !value.includes(searchValue)
                ) {
                    onChange([...value, searchValue]);
                    setSearchValue("");
                    event.preventDefault();
                }
            }}
        />
    );
}
