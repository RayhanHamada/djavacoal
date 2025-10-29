"use client";

import { useState } from "react";

/**
 * Hook to manage page metadata table state (pagination and search)
 */
export function usePageMetadataTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        // Reset to first page when search changes
        setPage(1);
    };

    return {
        page,
        search,
        handlePageChange,
        handleSearchChange,
    };
}
