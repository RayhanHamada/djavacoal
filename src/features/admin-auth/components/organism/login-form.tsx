"use client";

import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Group,
} from "@mantine/core";
import { useLogin } from "@/features/admin-auth/hooks/use-login";
import Link from "next/link";

type Props = {
  onSuccess?: () => void;
};

export const LoginForm = ({ onSuccess }: Props) => {
  const { form, handleSubmit, isLoading } = useLogin({ onSuccess });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          key={form.key("email")}
          {...form.getInputProps("email")}
          disabled={isLoading}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          key={form.key("password")}
          {...form.getInputProps("password")}
          disabled={isLoading}
        />
        <Group justify="flex-end">
          <Anchor component={Link} href="/auth/forgot-password" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button type="submit" fullWidth loading={isLoading}>
          Sign in
        </Button>
      </Stack>
    </form>
  );
};
