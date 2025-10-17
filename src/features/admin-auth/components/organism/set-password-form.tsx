"use client";

import { useMemo } from "react";

import { PasswordInput, Button, Stack, Text, Progress } from "@mantine/core";
import { useForm } from "@mantine/form";

import { usePasswordSetup } from "@/features/admin-auth/hooks";
import { validateSetPasswordForm } from "@/features/admin-auth/lib/form-schema";

type Props = {
    onPasswordSet?: () => void;
};

export function SetPasswordForm({ onPasswordSet }: Props) {
    const { handleSetPassword, isLoading } = usePasswordSetup(onPasswordSet);

    const form = useForm({
        mode: "controlled",
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: validateSetPasswordForm,
    });

    const handleSubmit = form.onSubmit(async function ({ password }) {
        await handleSetPassword({ password });
    });

    const passwordValue = form.values.password;

    const strength = useMemo(() => {
        let strength = 0;
        if (passwordValue.length >= 8) strength += 25;
        if (passwordValue.length >= 12) strength += 25;
        if (/[a-z]/.test(passwordValue)) strength += 12.5;
        if (/[A-Z]/.test(passwordValue)) strength += 12.5;
        if (/\d/.test(passwordValue)) strength += 12.5;
        if (/[^a-zA-Z\d]/.test(passwordValue)) strength += 12.5;
        return Math.min(strength, 100);
    }, [passwordValue]);

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
                <Text size="sm" c="dimmed">
                    Please set a password for your account to continue. Your
                    password must be
                    <b>
                        at least 8 characters long and contain at least one
                        uppercase letter, one lowercase letter, and one number
                    </b>
                    .
                </Text>

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
                            mb="xs"
                        />
                    </div>
                </div>

                <Button type="submit" fullWidth mt="md" loading={isLoading}>
                    Set Password
                </Button>
            </Stack>
        </form>
    );
}
