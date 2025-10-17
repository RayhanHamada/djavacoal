"use client";

import { PasswordInput, Button, Stack, Text } from "@mantine/core";

import { useResetPassword } from "@/features/admin-auth/hooks";

type Props = {
    onSuccess?: () => void;
};

/**
 * Reset Password Form Component
 * Allows users to set a new password using the reset token
 */
export function ResetPasswordForm({ onSuccess }: Props) {
    const { form, handleSubmit, isLoading } = useResetPassword({ onSuccess });

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    Enter your new password below.
                </Text>

                <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    required
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                    disabled={isLoading}
                />

                <PasswordInput
                    label="Confirm Password"
                    placeholder="Re-enter new password"
                    required
                    key={form.key("confirmPassword")}
                    {...form.getInputProps("confirmPassword")}
                    disabled={isLoading}
                />

                <Button type="submit" fullWidth loading={isLoading} mt="md">
                    Reset Password
                </Button>
            </Stack>
        </form>
    );
}
