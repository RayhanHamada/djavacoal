import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

export function usePackagingOptions() {
    const { data: packagingData, isLoading } = useQuery(
        rpc.dashboardProduct.listPackagingOptions.queryOptions({
            input: {
                page: 1,
                limit: 100,
                search: "",
            },
        })
    );

    const packagingOptions = useMemo(() => {
        if (!packagingData) return [];
        return packagingData.packagingOptions.map((option) => ({
            value: String(option.id),
            label: option.en_name,
        }));
    }, [packagingData]);

    return { packagingOptions, isLoading };
}
