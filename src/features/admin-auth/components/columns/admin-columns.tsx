"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminListItem } from "@/features/admin-auth/lib/types";
import { ActionIcon, Menu } from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons-react";

type Props = {
  onRemove: (admin: AdminListItem) => void;
};

export function createAdminColumns({
  onRemove,
}: Props): ColumnDef<AdminListItem>[] {
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
            {/* TODO: Add more actions here in the future (e.g., Edit, Reset Password, etc.) */}
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={() => onRemove(row.original)}
            >
              Remove Admin
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
}
