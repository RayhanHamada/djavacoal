"use client";

import { useState } from "react";

export type SortBy = "name" | "updated_at";
export type SortOrder = "asc" | "desc";

/**
 * Manages gallery state (search, pagination, sorting, selection)
 */
export function useGalleryState() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortBy>("updated_at");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(
        new Set()
    );

    const togglePhotoSelection = (photoId: string) => {
        setSelectedPhotoIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(photoId)) {
                newSet.delete(photoId);
            } else {
                newSet.add(photoId);
            }
            return newSet;
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setSelectedPhotoIds(new Set());
    };

    const clearSelection = () => {
        setSelectedPhotoIds(new Set());
    };

    const handleSortByName = () => {
        if (sortBy === "name") {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy("name");
            setSortOrder("asc");
        }
    };

    const handleSortByDate = () => {
        if (sortBy === "updated_at") {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy("updated_at");
            setSortOrder("desc");
        }
    };

    return {
        search,
        setSearch,
        page,
        setPage,
        sortBy,
        sortOrder,
        selectedPhotoIds,
        togglePhotoSelection,
        handlePageChange,
        clearSelection,
        handleSortByName,
        handleSortByDate,
    };
}
