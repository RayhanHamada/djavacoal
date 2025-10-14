"use client";

import { usePasswordSetup } from "@/features/admin-auth/hooks";
import { validateSetPasswordForm } from "@/features/admin-auth/lib/form-schema";
import { PasswordInput, Button, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  onPasswordSet?: () => void;
};

export function SetPasswordForm({ onPasswordSet }: Props) {
  const { handleSetPassword, isLoading } = usePasswordSetup(onPasswordSet);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: validateSetPasswordForm,
  });

  const handleSubmit = form.onSubmit(async function ({ password }) {
    await handleSetPassword({ password });
  });

  // Calculate password strength
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password)) strength += 12.5;
    if (/[A-Z]/.test(password)) strength += 12.5;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 25) return "red";
    if (strength < 50) return "orange";
    if (strength < 75) return "yellow";
    return "green";
  };

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const passwordValue = form.getValues().password || "";
  const passwordStrength = getPasswordStrength(passwordValue);
  const strengthColor = getPasswordStrengthColor(passwordStrength);
  const strengthLabel = getPasswordStrengthLabel(passwordStrength);

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Please set a password for your account to continue. Your password must
          be at least 8 characters long and contain at least one uppercase
          letter, one lowercase letter, and one number.
        </Text>

        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          required
          key={form.key("password")}
          {...form.getInputProps("password")}
          disabled={isLoading}
        />

        {passwordValue.length > 0 && (
          <div>
            <Text size="xs" fw={500} mb={4}>
              Password Strength: {strengthLabel}
            </Text>
            <div
              style={{
                height: 4,
                width: "100%",
                backgroundColor: "var(--mantine-color-gray-2)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${passwordStrength}%`,
                  backgroundColor: `var(--mantine-color-${strengthColor}-6)`,
                  transition: "width 0.3s ease, background-color 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          required
          key={form.key("confirmPassword")}
          {...form.getInputProps("confirmPassword")}
          disabled={isLoading}
        />

        <Button type="submit" fullWidth mt="md" loading={isLoading}>
          Set Password
        </Button>
      </Stack>
    </form>
  );
}
