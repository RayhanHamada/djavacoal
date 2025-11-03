"use client";

import { useMemo } from "react";

import { Button, PasswordInput, Progress, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useChangePassword } from "@/features/dashboard-auth/hooks";
import {
    validateChangePasswordForm,
    type ChangePasswordFormValues,
} from "@/features/dashboard-auth/lib/form-schema";

/**
 * Form component for changing user's password
 * Requires current password verification and validates new password strength
 */
export function ChangePasswordForm() {
    const { changePassword, isChanging } = useChangePassword();

    const form = useForm<ChangePasswordFormValues>({
        mode: "controlled",
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validate: validateChangePasswordForm,
    });

    const handleSubmit = form.onSubmit(
        async ({ currentPassword, newPassword, confirmPassword }) => {
            await changePassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            // Reset form on success
            form.reset();
        }
    );

    const newPasswordValue = form.values.newPassword;

    // Calculate password strength
    const strength = useMemo(() => {
        let strength = 0;
        if (newPasswordValue.length >= 8) strength += 25;
        if (newPasswordValue.length >= 12) strength += 25;
        if (/[a-z]/.test(newPasswordValue)) strength += 12.5;
        if (/[A-Z]/.test(newPasswordValue)) strength += 12.5;
        if (/\d/.test(newPasswordValue)) strength += 12.5;
        if (/[^a-zA-Z\d]/.test(newPasswordValue)) strength += 12.5;
        return Math.min(strength, 100);
    }, [newPasswordValue]);

    const strengthColor = useMemo(() => {
        if (strength < 25) return "red";
        if (strength < 50) return "orange";
        if (strength < 75) return "yellow";
        return "green";
    }, [strength]);

    const strengthLabel = useMemo(() => {
        if (strength <= 25) return "Weak";
        if (strength <= 50) return "Fair";
        if (strength <= 75) return "Good";
        return "Strong";
    }, [strength]);

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <PasswordInput
                    label="Current Password"
                    placeholder="Enter your current password"
                    description="Required for verification"
                    required
                    key={form.key("currentPassword")}
                    {...form.getInputProps("currentPassword")}
                    disabled={isChanging}
                />

                <PasswordInput
                    label="New Password"
                    placeholder="Create a strong password"
                    description="At least 8 characters with uppercase, lowercase, and number"
                    required
                    key={form.key("newPassword")}
                    {...form.getInputProps("newPassword")}
                    disabled={isChanging}
                />

                <PasswordInput
                    label="Confirm New Password"
                    placeholder="Re-enter your new password"
                    required
                    key={form.key("confirmPassword")}
                    {...form.getInputProps("confirmPassword")}
                    disabled={isChanging}
                />

                {newPasswordValue && (
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
                            <Progress
                                color={strengthColor}
                                value={strength}
                                size={5}
                            />
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    loading={isChanging}
                    disabled={isChanging}
                >
                    Change Password
                </Button>
            </Stack>
        </form>
    );
}
