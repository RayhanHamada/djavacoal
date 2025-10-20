"use client";

import { Suspense } from "react";

import Link from "next/link";

import {
    Box,
    Button,
    Container,
    Group,
    Loader,
    Pagination,
    Paper,
    Stack,
    Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";

import { NewsFilters, NewsListTable, useNewsFilters } from "..";
import { rpc } from "@/lib/rpc";

const ITEMS_PER_PAGE = 20;

/**
 * NewsListContent - The main content with data fetching
 */
function NewsListContent() {
    const [filters] = useNewsFilters();
    const [page, setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    );
    // Fetch news list
    const { data, isLoading, error } = useQuery(
        rpc.dashboardNews.listNews.queryOptions({
            input: {
                page,
                limit: ITEMS_PER_PAGE,
                titleSearch: filters.title || undefined,
                tags: filters.tags,
                status: filters.status,
                dateFrom: filters.dateFrom ?? undefined,
                dateTo: filters.dateTo ?? undefined,
            },
        })
    );

    const hasActiveFilters =
        filters.title !== "" ||
        filters.tags.length > 0 ||
        filters.status !== "all" ||
        filters.dateFrom !== null ||
        filters.dateTo !== null;

    const handleResetFilters = () => {
        // Reset all filters to default
        window.history.pushState({}, "", window.location.pathname);
        setPage(1);
    };

    if (error) {
        return (
            <Container>
                <Paper p="xl" withBorder>
                    <Title order={3} c="red">
                        Error loading news
                    </Title>
                    <Box mt="md">
                        {error instanceof Error
                            ? error.message
                            : "An error occurred"}
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                {/* Header */}
                <Group justify="space-between" align="center">
                    <Title order={2}>News Management</Title>
                    <Button
                        href="/dashboard/news/create"
                        component={Link}
                        leftSection={<IconPlus size={18} />}
                    >
                        Create News
                    </Button>
                </Group>

                {/* Filters */}
                <Paper p="md" withBorder>
                    <NewsFilters
                        hasActiveFilters={hasActiveFilters}
                        onResetFilters={handleResetFilters}
                    />
                </Paper>

                {/* Table */}
                <Paper withBorder>
                    {isLoading ? (
                        <Box p="xl" style={{ textAlign: "center" }}>
                            <Loader size="lg" />
                        </Box>
                    ) : (
                        <NewsListTable
                            items={data?.items || []}
                            isLoading={isLoading}
                        />
                    )}
                </Paper>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <Group justify="center">
                        <Pagination
                            total={data.totalPages}
                            value={page}
                            onChange={setPage}
                            size="lg"
                        />
                    </Group>
                )}
            </Stack>
        </Container>
    );
}

/**
 * NewsListPage - Main news list page component
 */
export function NewsListPage() {
    return (
        <Suspense
            fallback={
                <Container>
                    <Box p="xl" style={{ textAlign: "center" }}>
                        <Loader size="lg" />
                    </Box>
                </Container>
            }
        >
            <NewsListContent />
        </Suspense>
    );
}
