"use client";

import Link from "next/link";

import {
    TextInput,
    PasswordInput,
    Button,
    Stack,
    Anchor,
    Group,
} from "@mantine/core";

import { useLogin } from "@/features/dashboard-auth/hooks/use-login";

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
                    <Anchor
                        component={Link}
                        href="/auth/forgot-password"
                        size="sm"
                    >
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
