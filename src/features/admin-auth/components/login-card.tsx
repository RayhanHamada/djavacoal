"use client";

import { Paper, Title, Container, type PaperProps } from "@mantine/core";
import { LoginForm } from "./login-form";

export type Props = {
  title?: string;
  paperProps?: PaperProps;
  onSuccess?(): void;
};

export const LoginCard = ({
  title = "Djavacoal Admin",
  paperProps,
  onSuccess,
}: Props) => {
  return (
    <Container size="xl" w={420}>
      <Title ta="center" className="mb-4">
        {title}
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" {...paperProps}>
        <LoginForm onSuccess={onSuccess} />
      </Paper>
    </Container>
  );
};
