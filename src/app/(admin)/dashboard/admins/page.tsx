"use client";

import { AdminListTable } from "@/features/dashboard-auth/components/organism";
import {
    useAdminList,
    useInviteAdmin,
    useRemoveAdmin,
} from "@/features/dashboard-auth/hooks";
export default function AdminsPage() {
    const {
        admins,
        total,
        page,
        pageSize,
        isLoading,
        isError,
        searchQuery,
        setSearchQuery,
        setPage,
    } = useAdminList();
    const { inviteAdmin, isInviting } = useInviteAdmin();
    const { removeAdmin, isRemoving } = useRemoveAdmin();

    return (
        <AdminListTable
            admins={admins}
            total={total}
            page={page}
            pageSize={pageSize}
            isLoading={isLoading}
            isError={isError}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPageChange={setPage}
            onInvite={inviteAdmin}
            onRemove={removeAdmin}
            isInviting={isInviting}
            isRemoving={isRemoving}
        />
    );
}
