"use client";

import { Modal, Stack, Text, Group, Button } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { AdminListItem } from "@/features/admin-auth/lib/types";

type Props = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  admin: AdminListItem | null;
  isLoading?: boolean;
};

export function RemoveAdminConfirmation({
  opened,
  onClose,
  onConfirm,
  admin,
  isLoading,
}: Props) {
  async function handleConfirm() {
    await onConfirm();
  }

  return (
    <Modal
      opened={opened}
      onClose={isLoading ? () => {} : onClose}
      title="Remove Admin"
      centered
      closeOnClickOutside={!isLoading}
      closeOnEscape={!isLoading}
    >
      <Stack gap="md">
        <Group gap="sm" align="flex-start">
          <IconAlertTriangle size={24} color="var(--mantine-color-red-6)" />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              Are you sure you want to remove this admin?
            </Text>
            {admin && (
              <Stack gap={4}>
                <Text size="sm" c="dimmed">
                  <strong>Name:</strong> {admin.name}
                </Text>
                <Text size="sm" c="dimmed">
                  <strong>Email:</strong> {admin.email}
                </Text>
              </Stack>
            )}
            <Text size="sm" c="red">
              This action cannot be undone.
            </Text>
          </Stack>
        </Group>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirm} loading={isLoading}>
            Remove Admin
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
