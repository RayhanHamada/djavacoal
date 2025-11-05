"use client";

import type { AdminListItem } from "@/features/dashboard-auth/lib/types";
import type { z } from "zod/v4";

import { useState, useMemo } from "react";

import { Stack, Group, Button, Paper, Title, Text, Box } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { match, P } from "ts-pattern";

import { DataTable } from "@/components/datatable/table";
import { SearchAdminInput } from "@/features/dashboard-auth/components/atoms";
import { createAdminColumns } from "@/features/dashboard-auth/components/columns";
import {
    InviteAdminModal,
    RemoveAdminConfirmation,
} from "@/features/dashboard-auth/components/molecules";
import { client } from "@/features/dashboard-auth/lib/better-auth-client";
import { InviteAdminFormSchema } from "@/features/dashboard-auth/lib/form-schema";

type InviteAdminFormValues = z.infer<typeof InviteAdminFormSchema>;

type AdminListTableProps = {
    admins: AdminListItem[];
    total?: number;
    page?: number;
    pageSize?: number;
    isLoading?: boolean;
    isError?: boolean;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onPageChange?: (page: number) => void;
    onInvite: (values: InviteAdminFormValues) => void | Promise<void>;
    onRemove: (adminId: string) => void | Promise<void>;
    isInviting?: boolean;
    isRemoving?: boolean;
};

export function AdminListTable({
    admins,
    total = 0,
    page = 1,
    pageSize = 10,
    isLoading,
    isError,
    searchQuery,
    onSearchChange,
    onPageChange,
    onInvite,
    onRemove,
    isInviting,
    isRemoving,
}: AdminListTableProps) {
    const [inviteModalOpened, setInviteModalOpened] = useState(false);
    const [removeConfirmOpened, setRemoveConfirmOpened] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminListItem | null>(
        null
    );

    function handleRemoveClick(admin: AdminListItem) {
        setSelectedAdmin(admin);
        setRemoveConfirmOpened(true);
    }

    async function handleRemoveConfirm() {
        if (selectedAdmin) {
            await onRemove(selectedAdmin.id);
            setRemoveConfirmOpened(false);
            setSelectedAdmin(null);
        }
    }

    function handleRemoveCancel() {
        if (!isRemoving) {
            setRemoveConfirmOpened(false);
            setSelectedAdmin(null);
        }
    }

    async function handleInviteSubmit(values: InviteAdminFormValues) {
        await onInvite(values);
        setInviteModalOpened(false);
    }

    const { data: session } = client.useSession();
    const currentUserRole = session?.user?.role;

    const columns = useMemo(
        function () {
            return createAdminColumns({
                onRemove: handleRemoveClick,
                currentUserRole,
            });
        },
        [currentUserRole]
    );

    return (
        <>
            <Paper p="xl" shadow="sm" withBorder>
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between" align="flex-start">
                        <Box>
                            <Title order={2}>Admin Management</Title>
                            <Text size="sm" c="dimmed" mt={4}>
                                View and manage all registered administrators
                            </Text>
                        </Box>
                        <Button
                            leftSection={<IconPlus size={18} />}
                            onClick={() => setInviteModalOpened(true)}
                            disabled={isLoading}
                        >
                            Invite Admin
                        </Button>
                    </Group>

                    {/* Search */}
                    <SearchAdminInput
                        value={searchQuery}
                        onChange={onSearchChange}
                    />

                    {/* Table */}
                    <Box>
                        {match({ isLoading, isError, admins, searchQuery })
                            .with({ isLoading: true }, () => (
                                <Text ta="center" py="xl" c="dimmed">
                                    Loading admins...
                                </Text>
                            ))
                            .with({ isError: true }, () => (
                                <Text ta="center" py="xl" c="red">
                                    Failed to load admins. Please try again.
                                </Text>
                            ))
                            .with(
                                { admins: P.when((data) => data.length > 0) },
                                () => (
                                    <DataTable
                                        columns={columns}
                                        data={admins}
                                        pageSize={pageSize}
                                        currentPage={page}
                                        totalPages={Math.ceil(total / pageSize)}
                                        onPaginationChange={(newPage) =>
                                            onPageChange?.(newPage)
                                        }
                                    />
                                )
                            )
                            .otherwise(() =>
                                match(searchQuery.trim())
                                    .with(P.string.minLength(1), () => (
                                        <Text ta="center" py="xl" c="dimmed">
                                            No admins found matching &quot;
                                            {searchQuery}&quot;
                                        </Text>
                                    ))
                                    .otherwise(() => (
                                        <Text ta="center" py="xl" c="dimmed">
                                            No admins registered yet. Invite
                                            your first admin!
                                        </Text>
                                    ))
                            )}
                    </Box>
                </Stack>
            </Paper>

            {/* Invite Modal */}
            <InviteAdminModal
                opened={inviteModalOpened}
                onClose={() => setInviteModalOpened(false)}
                onInvite={handleInviteSubmit}
                isLoading={isInviting}
            />

            {/* Remove Confirmation */}
            <RemoveAdminConfirmation
                opened={removeConfirmOpened}
                onClose={handleRemoveCancel}
                onConfirm={handleRemoveConfirm}
                admin={selectedAdmin}
                isLoading={isRemoving}
            />
        </>
    );
}
