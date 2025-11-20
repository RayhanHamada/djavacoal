"use client";

import type { SortBy, SortOrder } from "./use-gallery-state";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "ahooks";

import { rpc } from "@/lib/rpc";

/**
 * Manages photo data fetching with search, pagination, and sorting
 */
export function useGalleryData({
    search,
    page,
    sortBy,
    sortOrder,
    limit = 20,
}: {
    search: string;
    page: number;
    sortBy: SortBy;
    sortOrder: SortOrder;
    limit?: number;
}) {
    const queryClient = useQueryClient();

    // Debounced search
    const debouncedSearch = useDebounce(search, { wait: 500 });

    // Reset page when search changes
    const effectiveSearch = debouncedSearch;

    // Fetch photos
    const photosQuery = useQuery(
        rpc.gallery.listPhotos.queryOptions({
            input: {
                search: effectiveSearch,
                page,
                limit,
                sortBy,
                sortOrder,
            },
        })
    );

    const photos = photosQuery.data?.photos ?? [];
    const total = photosQuery.data?.total ?? 0;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    const handleRefresh = () => {
        queryClient.invalidateQueries({
            queryKey: rpc.gallery.listPhotos.key(),
        });
    };

    return {
        photosQuery,
        photos,
        total,
        totalPages,
        handleRefresh,
    };
}
