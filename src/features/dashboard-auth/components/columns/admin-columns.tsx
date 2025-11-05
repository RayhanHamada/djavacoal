"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";

import { RoleBadge } from "@/features/dashboard-auth/components/atoms";
import { AdminListItem } from "@/features/dashboard-auth/lib/types";

type Props = {
    onRemove: (admin: AdminListItem) => void;
    currentUserRole: string | null | undefined;
};

export function createAdminColumns({
    onRemove,
    currentUserRole,
}: Props): ColumnDef<AdminListItem>[] {
    const isAdmin = currentUserRole === "admin";
    return [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "email",
            accessorFn: (row) => row.email,
            header: "Email",
            cell: ({ row }) => row.original.email,
        },
        {
            accessorKey: "name",
            accessorFn: (row) => row.name,
            header: "Name",
            cell: ({ row }) => row.original.name,
        },
        {
            accessorKey: "role",
            accessorFn: (row) => row.role,
            header: "Role",
            cell: ({ row }) => <RoleBadge role={row.original.role} />,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Menu position="bottom-end" withArrow>
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                            <IconDots size={18} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Actions</Menu.Label>
                        {/* Only admins can remove other admins */}
                        {isAdmin && (
                            <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={16} />}
                                onClick={() => onRemove(row.original)}
                            >
                                Remove Admin
                            </Menu.Item>
                        )}
                        {!isAdmin && (
                            <Menu.Item disabled color="gray">
                                No actions available
                            </Menu.Item>
                        )}
                    </Menu.Dropdown>
                </Menu>
            ),
        },
    ];
}
