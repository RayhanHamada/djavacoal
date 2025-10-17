"use client";

import { useOnboarding } from "@/features/admin-auth/hooks";
import { validateOnboardingForm } from "@/features/admin-auth/lib/form-schema";
import { TextInput, PasswordInput, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

export function OnboardingForm() {
  const { handleSetupFirstUser, isLoading } = useOnboarding();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: validateOnboardingForm,
  });

  const handleSubmit = form.onSubmit(async function ({
    name,
    email,
    password,
  }) {
    await handleSetupFirstUser({ email, name, password });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="your@email.com"
          type="email"
          required
          key={form.key("email")}
          {...form.getInputProps("email")}
          disabled={isLoading}
        />

        <TextInput
          label="Name"
          placeholder="John Doe"
          type="text"
          required
          key={form.key("name")}
          {...form.getInputProps("name")}
          disabled={isLoading}
        />

        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          required
          key={form.key("password")}
          {...form.getInputProps("password")}
          disabled={isLoading}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          required
          key={form.key("confirmPassword")}
          {...form.getInputProps("confirmPassword")}
          disabled={isLoading}
        />

        <Button type="submit" fullWidth mt="md" loading={isLoading}>
          Setup Your Account
        </Button>
      </Stack>
    </form>
  );
}
