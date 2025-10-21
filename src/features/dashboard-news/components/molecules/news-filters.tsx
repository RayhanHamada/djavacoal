"use client";

import React from "react";

import {
    Box,
    Button,
    Drawer,
    Flex,
    Group,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
    IconAlphabetLatin,
    IconCalendar,
    IconFilter,
    IconGlobe,
    IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import {
    parseAsArrayOf,
    parseAsIsoDate,
    parseAsString,
    parseAsStringEnum,
    useQueryStates,
} from "nuqs";

import { NewsTagsSelect } from "../atoms";

type StatusFilter = "all" | "draft" | "published" | "unpublished";

/**
 * News filters state management using nuqs
 */
export function useNewsFilters() {
    // no default dates — filters are optional

    return useQueryStates(
        {
            title: parseAsString.withDefault(""),
            tags: parseAsArrayOf(parseAsString).withDefault([]),
            status: parseAsStringEnum<StatusFilter>([
                "all",
                "draft",
                "published",
                "unpublished",
            ]).withDefault("all"),
            // Published date filters (only meaningful for published/unpublished)
            publishedFrom: parseAsIsoDate,
            publishedTo: parseAsIsoDate,
            // Created date filters (only meaningful for all/draft)
            createdFrom: parseAsIsoDate,
            createdTo: parseAsIsoDate,
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

    // When status changes, clear the date filters that are not relevant
    const handleStatusChange = (value: StatusFilter) => {
        // If switching to published/unpublished, clear created filters
        if (value === "published" || value === "unpublished") {
            setFilters({
                status: value,
                createdFrom: null,
                createdTo: null,
            });
            return;
        }

        // If switching to draft or all, clear published filters
        setFilters({
            status: value,
            publishedFrom: null,
            publishedTo: null,
        });
    };

    const filterContent = (
        <Stack gap="md">
            {/* Title Search */}
            <TextInput
                leftSection={<IconAlphabetLatin size={16} />}
                label="Search by Title"
                placeholder="Search in English titles..."
                value={filters.title}
                onChange={(e) =>
                    setFilters({ title: e.currentTarget.value || null })
                }
            />

            <Flex direction="row" gap="md">
                {/* Status */}
                <Select
                    leftSection={<IconGlobe size={16} />}
                    w="100%"
                    label="Publication Status"
                    value={filters.status}
                    onChange={(value) =>
                        handleStatusChange((value as StatusFilter) || "all")
                    }
                    data={[
                        { value: "all", label: "All" },
                        { value: "draft", label: "Draft" },
                        { value: "published", label: "Published" },
                        { value: "unpublished", label: "Unpublished" },
                    ]}
                />

                {/* Tags */}
                <Box w="100%">
                    <NewsTagsSelect
                        label="Filter by Tags"
                        value={filters.tags}
                        onChange={(tags) =>
                            setFilters({ tags: tags.length > 0 ? tags : null })
                        }
                        placeholder="Select tags to filter"
                    />
                </Box>
            </Flex>

            {/* Date Range - show either published or created filters depending on status */}
            {filters.status === "published" ||
            filters.status === "unpublished" ? (
                <Flex direction="row" justify="space-between " gap="md">
                    <DatePickerInput
                        leftSection={<IconCalendar size={18} stroke={1.5} />}
                        w="100%"
                        valueFormat="DD MMMM YYYY"
                        label="Published From"
                        placeholder="Select date"
                        value={filters.publishedFrom}
                        onChange={(d) => {
                            setFilters({
                                publishedFrom: d ? dayjs(d).toDate() : null,
                            });
                        }}
                        clearable
                    />
                    <DatePickerInput
                        leftSection={<IconCalendar size={18} stroke={1.5} />}
                        w="100%"
                        excludeDate={(d) =>
                            filters.publishedFrom
                                ? dayjs(d).isBefore(filters.publishedFrom)
                                : false
                        }
                        valueFormat="DD MMMM YYYY"
                        label="Published To"
                        placeholder="Select date"
                        value={filters.publishedTo}
                        onChange={(d) => {
                            setFilters({
                                publishedTo: d ? dayjs(d).toDate() : null,
                            });
                        }}
                        clearable
                    />
                </Flex>
            ) : (
                <Flex direction="row" justify="space-between " gap="md">
                    <DatePickerInput
                        leftSection={<IconCalendar size={18} stroke={1.5} />}
                        w="100%"
                        valueFormat="DD MMMM YYYY"
                        label="Created From"
                        placeholder="Select date"
                        value={filters.createdFrom}
                        onChange={(d) => {
                            setFilters({
                                createdFrom: d ? dayjs(d).toDate() : null,
                            });
                        }}
                        clearable
                    />
                    <DatePickerInput
                        leftSection={<IconCalendar size={18} stroke={1.5} />}
                        w="100%"
                        excludeDate={(d) =>
                            filters.createdFrom
                                ? dayjs(d).isBefore(filters.createdFrom)
                                : false
                        }
                        valueFormat="DD MMMM YYYY"
                        label="Created To"
                        placeholder="Select date"
                        value={filters.createdTo}
                        onChange={(d) => {
                            setFilters({
                                createdTo: d ? dayjs(d).toDate() : null,
                            });
                        }}
                        clearable
                    />
                </Flex>
            )}

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
