"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "ahooks";

import { rpc } from "@/lib/rpc";

/**
 * Hook to manage page metadata data fetching with search and pagination
 */
export function usePageMetadataData({
    search,
    page,
    limit = 20,
}: {
    search: string;
    page: number;
    limit?: number;
}) {
    const queryClient = useQueryClient();

    // Debounced search
    const debouncedSearch = useDebounce(search, { wait: 500 });

    // Fetch page metadata
    const pageMetadataQuery = useQuery(
        rpc.pageSettings.listPageMetadata.queryOptions({
            input: {
                search: debouncedSearch,
                page,
                limit,
            },
        })
    );

    const items = pageMetadataQuery.data?.items ?? [];
    const total = pageMetadataQuery.data?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    const handleRefresh = () => {
        queryClient.invalidateQueries({
            queryKey: rpc.pageSettings.listPageMetadata.key(),
        });
    };

    return {
        pageMetadataQuery,
        items,
        total,
        totalPages,
        handleRefresh,
    };
}
