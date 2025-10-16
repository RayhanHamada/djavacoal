"use client";

import { Modal, Stack, Text, Title } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { SetPasswordForm } from "./set-password-form";
import { client } from "@/features/admin-auth/lib/better-auth-client";
import { useState } from "react";

export function SetPasswordModal() {
  const { refetch } = client.useSession();
  const [modalClosed, setModalClosed] = useState(false);

  const handlePasswordSet = async () => {
    // Refetch session to update the modal state
    refetch();
    setModalClosed(true);
  };

  // Modal is opened if not closed yet
  const opened = !modalClosed;

  return (
    <Modal
      opened={opened}
      onClose={() => {}} // Empty function to prevent closing
      title={
        <Stack gap="xs">
          <Title order={3}>Set Your Password</Title>
        </Stack>
      }
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      size="md"
    >
      <Stack gap="md">
        <Stack gap="sm" align="center">
          <IconLock size={48} color="var(--mantine-color-blue-6)" />
          <Text size="sm" ta="center" c="dimmed">
            For security purposes, you need to set a password before accessing
            the dashboard.
          </Text>
        </Stack>

        <SetPasswordForm onPasswordSet={handlePasswordSet} />
      </Stack>
    </Modal>
  );
}
