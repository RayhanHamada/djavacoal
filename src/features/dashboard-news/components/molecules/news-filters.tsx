"use client";

import {
    Box,
    Button,
    Drawer,
    Group,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconX } from "@tabler/icons-react";
import {
    parseAsArrayOf,
    parseAsIsoDateTime,
    parseAsString,
    parseAsStringEnum,
    useQueryStates,
} from "nuqs";

import { NewsTagsSelect } from "../atoms";

type StatusFilter = "all" | "published" | "unpublished";

/**
 * News filters state management using nuqs
 */
export function useNewsFilters() {
    return useQueryStates(
        {
            title: parseAsString.withDefault(""),
            tags: parseAsArrayOf(parseAsString).withDefault([]),
            status: parseAsStringEnum<StatusFilter>([
                "all",
                "published",
                "unpublished",
            ]).withDefault("all"),
            dateFrom: parseAsIsoDateTime,
            dateTo: parseAsIsoDateTime,
        },
        {
            history: "push",
        }
    );
}

interface NewsFiltersProps {
    /** Whether any filters are active */
    hasActiveFilters: boolean;
    /** Callback to reset all filters */
    onResetFilters: () => void;
}

/**
 * NewsFilters component for filtering news list
 * Uses drawer for mobile, inline for desktop
 */
export function NewsFilters({
    hasActiveFilters,
    onResetFilters,
}: NewsFiltersProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const [filters, setFilters] = useNewsFilters();

    const filterContent = (
        <Stack gap="md">
            {/* Title Search */}
            <TextInput
                label="Search by Title"
                placeholder="Search in English titles..."
                value={filters.title}
                onChange={(e) =>
                    setFilters({ title: e.currentTarget.value || null })
                }
                leftSection={<IconFilter size={16} />}
            />

            {/* Tags */}
            <NewsTagsSelect
                label="Filter by Tags"
                value={filters.tags}
                onChange={(tags) =>
                    setFilters({ tags: tags.length > 0 ? tags : null })
                }
                placeholder="Select tags to filter"
            />

            {/* Status */}
            <Select
                label="Publication Status"
                value={filters.status}
                onChange={(value) =>
                    setFilters({ status: (value as StatusFilter) || "all" })
                }
                data={[
                    { value: "all", label: "All" },
                    { value: "published", label: "Published" },
                    { value: "unpublished", label: "Unpublished" },
                ]}
            />

            {/* Date Range */}
            <DatePickerInput
                type="range"
                label="Publication Date Range"
                placeholder="Select date range"
                value={[
                    filters.dateFrom ? new Date(filters.dateFrom) : null,
                    filters.dateTo ? new Date(filters.dateTo) : null,
                ]}
                onChange={([from, to]) => {
                    setFilters({
                        dateFrom: from as any,
                        dateTo: to as any,
                    });
                }}
                clearable
            />

            {/* Reset Button */}
            {hasActiveFilters && (
                <Button
                    variant="subtle"
                    color="gray"
                    leftSection={<IconX size={16} />}
                    onClick={() => {
                        onResetFilters();
                        close();
                    }}
                    fullWidth
                >
                    Reset Filters
                </Button>
            )}
        </Stack>
    );

    return (
        <>
            {/* Mobile: Filter Button + Drawer */}
            <Group hiddenFrom="md">
                <Button
                    leftSection={<IconFilter size={16} />}
                    onClick={open}
                    variant={hasActiveFilters ? "filled" : "light"}
                >
                    Filters
                    {hasActiveFilters && " (Active)"}
                </Button>
            </Group>

            <Drawer
                opened={opened}
                onClose={close}
                title="Filter News"
                position="right"
                size="md"
            >
                {filterContent}
            </Drawer>

            {/* Desktop: Inline Filters */}
            <Box visibleFrom="md">{filterContent}</Box>
        </>
    );
}
