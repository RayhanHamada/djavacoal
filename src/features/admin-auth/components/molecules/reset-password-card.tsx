"use client";

import { Paper, Title, Container, type PaperProps } from "@mantine/core";
import { ResetPasswordForm } from "../organism/reset-password-form";

type Props = {
  title?: string;
  paperProps?: PaperProps;
  onSuccess?: () => void;
};

/**
 * Reset Password Card Component
 * Wraps the reset password form in a styled card container
 */
export function ResetPasswordCard({
  title = "Reset Password",
  paperProps,
  onSuccess,
}: Props) {
  return (
    <Container size="xl" w={420}>
      <Title ta="center" mb="md">
        {title}
      </Title>
      <Paper withBorder shadow="md" p={30} radius="md" {...paperProps}>
        <ResetPasswordForm onSuccess={onSuccess} />
      </Paper>
    </Container>
  );
}
