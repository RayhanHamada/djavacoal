"use client";

import { useState, useMemo } from "react";
import { Stack, Group, Button, Paper, Title, Text, Box } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { DataTable } from "@/components/datatable/table";
import { SearchAdminInput } from "@/features/admin-auth/components/atoms";
import {
  InviteAdminModal,
  RemoveAdminConfirmation,
} from "@/features/admin-auth/components/molecules";
import { createAdminColumns } from "@/features/admin-auth/components/columns";
import { InviteAdminFormSchema } from "@/features/admin-auth/lib/form-schema";
import type { AdminListItem } from "@/features/admin-auth/lib/types";
import type { z } from "zod/v4";

type InviteAdminFormValues = z.infer<typeof InviteAdminFormSchema>;

type AdminListTableProps = {
  admins: AdminListItem[];
  isLoading?: boolean;
  onInvite: (values: InviteAdminFormValues) => void | Promise<void>;
  onRemove: (adminId: string) => void | Promise<void>;
  isInviting?: boolean;
  isRemoving?: boolean;
};

export function AdminListTable({
  admins,
  isLoading,
  onInvite,
  onRemove,
  isInviting,
  isRemoving,
}: AdminListTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteModalOpened, setInviteModalOpened] = useState(false);
  const [removeConfirmOpened, setRemoveConfirmOpened] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminListItem | null>(
    null
  );

  // Filter admins based on search query
  const filteredAdmins = useMemo(
    function () {
      if (!searchQuery.trim()) return admins;

      const query = searchQuery.toLowerCase();
      return admins.filter(
        (admin) =>
          admin.email.toLowerCase().includes(query) ||
          admin.name.toLowerCase().includes(query)
      );
    },
    [admins, searchQuery]
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

  const columns = useMemo(function () {
    return createAdminColumns({ onRemove: handleRemoveClick });
  }, []);

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
            onChange={setSearchQuery}
            disabled={isLoading}
          />

          {/* Table */}
          <Box>
            {filteredAdmins.length === 0 && searchQuery ? (
              <Text ta="center" py="xl" c="dimmed">
                No admins found matching &quot;{searchQuery}&quot;
              </Text>
            ) : filteredAdmins.length === 0 ? (
              <Text ta="center" py="xl" c="dimmed">
                No admins registered yet. Invite your first admin!
              </Text>
            ) : (
              <DataTable
                data={filteredAdmins}
                columns={columns}
                pageSize={10}
              />
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
