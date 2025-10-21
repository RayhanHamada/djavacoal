"use client";

import { useCallback, useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Box, Button, Table, Text } from "@mantine/core";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { createNewsTableColumns, NewsArticle } from "../lib/news-table-columns";

interface NewsListTableProps {
    /** News articles to display */
    items: NewsArticle[];
    /** Whether data is loading */
    isLoading?: boolean;
}

/**
 * NewsListTable component for displaying news articles in a table
 * Uses TanStack Table with Mantine UI components
 * Follows atomic design principles with reusable cell components
 */
export function NewsListTable({
    items,
    isLoading = false,
}: NewsListTableProps) {
    const router = useRouter();

    // Navigate to edit page
    const handleEdit = useCallback(
        (id: number) => {
            router.push(`/dashboard/news/${id}/edit`);
        },
        [router]
    );

    // Memoize columns to prevent recreation on every render
    const columns = useMemo(
        () => createNewsTableColumns(handleEdit),
        [handleEdit]
    );

    // Initialize TanStack Table
    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // Empty state
    if (items.length === 0 && !isLoading) {
        return (
            <Box p="xl" style={{ textAlign: "center" }}>
                <Text size="lg" c="dimmed">
                    No news articles found
                </Text>
                <Button component={Link} href="/dashboard/news/create" mt="md">
                    Create Your First Article
                </Button>
            </Box>
        );
    }

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover>
                <Table.Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Table.Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Table.Th
                                    key={header.id}
                                    style={{
                                        width: header.getSize(),
                                    }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </Table.Th>
                            ))}
                        </Table.Tr>
                    ))}
                </Table.Thead>
                <Table.Tbody>
                    {table.getRowModel().rows.map((row) => (
                        <Table.Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Table.Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </Table.Td>
                            ))}
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
