import { useState } from "react";

import { useRouter } from "next/navigation";

import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

export function usePackagingOptionsList() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebouncedValue(search, 300);
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading } = useQuery(
        rpc.dashboardProduct.listPackagingOptions.queryOptions({
            input: {
                search: debouncedSearch,
                page,
                limit: 20,
            },
        })
    );

    const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;
    const deleteOption = data?.packagingOptions.find(
        (opt) => opt.id === deleteId
    );

    const handleEdit = (id: number) => {
        router.push(`/dashboard/products/packaging-options/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const closeDeleteModal = () => {
        setDeleteId(null);
    };

    return {
        search,
        setSearch,
        page,
        setPage,
        deleteId,
        setDeleteId,
        data,
        isLoading,
        totalPages,
        deleteOption,
        handleEdit,
        handleDelete,
        closeDeleteModal,
    };
}
