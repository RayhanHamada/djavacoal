"use client";

import Link from "next/link";

import { TextInput, Button, Stack, Text, Anchor } from "@mantine/core";

import { useForgotPassword } from "@/features/admin-auth/hooks";

type Props = {
    onSuccess?: () => void;
};

/**
 * Forgot Password Form Component
 * Allows users to request a password reset email
 */
export function ForgotPasswordForm({ onSuccess }: Props) {
    const { form, handleSubmit, isLoading } = useForgotPassword({ onSuccess });

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    Enter your email address and we&apos;ll send you
                    instructions to reset your password.
                </Text>

                <TextInput
                    label="Email"
                    placeholder="your@email.com"
                    required
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                    disabled={isLoading}
                />

                <Button type="submit" fullWidth loading={isLoading} mt="md">
                    Send Reset Instructions
                </Button>

                <Text size="sm" ta="center" mt="md">
                    Remember your password?{" "}
                    <Anchor component={Link} href="/auth/login" size="sm">
                        Back to login
                    </Anchor>
                </Text>
            </Stack>
        </form>
    );
}
