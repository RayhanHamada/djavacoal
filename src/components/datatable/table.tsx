import { useState, useEffect } from "react";

import { Table, Pagination, Group, Box, ActionIcon } from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    PaginationState,
} from "@tanstack/react-table";

interface Props<
    TData extends Record<string, unknown>,
    TCol extends ColumnDef<TData, any>,
> {
    data: TData[];
    columns: TCol[];
    pageSize?: number;
    currentPage?: number;
    onPaginationChange?: (page: number, pageSize: number) => void;
    totalPages?: number;
}

export function DataTable<
    TData extends Record<string, unknown>,
    TCol extends ColumnDef<TData, any>,
>({
    data,
    columns,
    pageSize = 10,
    currentPage = 1,
    onPaginationChange,
    totalPages,
}: Props<TData, TCol>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: currentPage - 1, // Convert 1-based to 0-based
        pageSize,
    });

    // Sync pagination state when currentPage changes externally
    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: currentPage - 1,
        }));
    }, [currentPage]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: (updater) => {
            setPagination(updater);
            if (onPaginationChange && typeof updater === "function") {
                const newState = updater(pagination);
                onPaginationChange(newState.pageIndex + 1, newState.pageSize);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: !!onPaginationChange,
        pageCount: totalPages,
    });

    return (
        <Box>
            <Table
                highlightOnHover
                withTableBorder
                withColumnBorders
                striped
                verticalSpacing="sm"
            >
                <Table.Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Table.Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Table.Th
                                    key={header.id}
                                    style={{
                                        cursor: header.column.getCanSort()
                                            ? "pointer"
                                            : "default",
                                        fontWeight: 600,
                                    }}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <Group gap="xs" wrap="nowrap">
                                        <Box size="sm" fw={600}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </Box>
                                        {header.column.getIsSorted() && (
                                            <ActionIcon
                                                variant="transparent"
                                                size="xs"
                                                color="gray"
                                            >
                                                {header.column.getIsSorted() ===
                                                "asc" ? (
                                                    <IconChevronUp size={16} />
                                                ) : (
                                                    <IconChevronDown
                                                        size={16}
                                                    />
                                                )}
                                            </ActionIcon>
                                        )}
                                    </Group>
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
                                    <Box size="sm">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Box>
                                </Table.Td>
                            ))}
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <Group justify="center" mt="xl">
                <Pagination
                    value={table.getState().pagination.pageIndex + 1}
                    onChange={(page) => table.setPageIndex(page - 1)}
                    total={totalPages || table.getPageCount()}
                    size="sm"
                />
            </Group>
        </Box>
    );
}
