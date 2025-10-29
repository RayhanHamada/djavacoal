"use client";

import { useCallback, useMemo } from "react";

import {
    ActionIcon,
    Box,
    Button,
    Group,
    Pagination,
    Table,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    createPageMetadataTableColumns,
    PageMetadataItem,
} from "../lib/page-metadata-table-columns";

interface PageMetadataTableProps {
    /** Page metadata items to display */
    items: PageMetadataItem[];
    /** Whether data is loading */
    isLoading?: boolean;
    /** Current page number */
    page: number;
    /** Total number of pages */
    totalPages: number;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
    /** Search value */
    search: string;
    /** Callback when search changes */
    onSearchChange: (value: string) => void;
    /** Callback to refresh data */
    onRefresh: () => void;
    /** Whether data is refetching */
    isRefetching?: boolean;
    /** Callback to create new page metadata */
    onCreate: () => void;
    /** Callback to edit page metadata */
    onEdit: (id: number) => void;
    /** Callback to delete page metadata */
    onDelete: (id: number) => void;
}

/**
 * PageMetadataTable component for displaying page metadata in a table
 * Uses TanStack Table with Mantine UI components
 */
export function PageMetadataTable({
    items,
    isLoading = false,
    page,
    totalPages,
    onPageChange,
    search,
    onSearchChange,
    onRefresh,
    isRefetching = false,
    onCreate,
    onEdit,
    onDelete,
}: PageMetadataTableProps) {
    // Memoize columns to prevent recreation on every render
    const columns = useMemo(
        () => createPageMetadataTableColumns(onEdit, onDelete),
        [onEdit, onDelete]
    );

    // Initialize TanStack Table
    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        // Search is already handled by onChange
    }, []);

    // Empty state
    if (items.length === 0 && !isLoading) {
        return (
            <Box>
                {/* Controls */}
                <Group justify="space-between" mb="md">
                    <form onSubmit={handleSearchSubmit}>
                        <TextInput
                            placeholder="Search by path..."
                            value={search}
                            onChange={(e) =>
                                onSearchChange(e.currentTarget.value)
                            }
                            leftSection={<IconSearch size={16} />}
                            w={384}
                        />
                    </form>

                    <Group gap="md">
                        <Tooltip label="Refresh">
                            <ActionIcon
                                variant="subtle"
                                onClick={onRefresh}
                                loading={isRefetching}
                            >
                                <IconRefresh size={16} />
                            </ActionIcon>
                        </Tooltip>

                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={onCreate}
                        >
                            Create
                        </Button>
                    </Group>
                </Group>

                {/* Empty state */}
                <Box p="xl" style={{ textAlign: "center" }}>
                    <Text size="lg" c="dimmed">
                        {search
                            ? "No page metadata found"
                            : "No page metadata yet"}
                    </Text>
                    {!search && (
                        <Button onClick={onCreate} mt="md">
                            Create Page Metadata
                        </Button>
                    )}
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            {/* Controls */}
            <Group justify="space-between" mb="md">
                <form onSubmit={handleSearchSubmit}>
                    <TextInput
                        placeholder="Search by path..."
                        value={search}
                        onChange={(e) => onSearchChange(e.currentTarget.value)}
                        leftSection={<IconSearch size={16} />}
                        w={384}
                    />
                </form>

                <Group gap="md">
                    <Tooltip label="Refresh">
                        <ActionIcon
                            variant="subtle"
                            onClick={onRefresh}
                            loading={isRefetching}
                        >
                            <IconRefresh size={16} />
                        </ActionIcon>
                    </Tooltip>

                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={onCreate}
                    >
                        Create
                    </Button>
                </Group>
            </Group>

            {/* Table */}
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
                                                  header.column.columnDef
                                                      .header,
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

            {/* Pagination */}
            {totalPages > 1 && (
                <Group justify="center" mt="md">
                    <Pagination
                        value={page}
                        onChange={onPageChange}
                        total={totalPages}
                    />
                </Group>
            )}
        </Box>
    );
}
