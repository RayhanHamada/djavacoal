"use client";

import { TextInput, PasswordInput, Button, Stack, Text } from "@mantine/core";
import { useLogin } from "@/features/admin-auth/hooks/use-login";

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
        <Button type="submit" fullWidth loading={isLoading} mt="md">
          Sign in
        </Button>
      </Stack>
    </form>
  );
};
