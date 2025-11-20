"use client";

import { Stack, Text, Title } from "@mantine/core";

type WelcomeHeaderProps = {
    userName?: string;
    subtitle?: string;
};

export function WelcomeHeader({
    userName = "User",
    subtitle = "Overview of your content",
}: WelcomeHeaderProps) {
    return (
        <Stack gap="xs">
            <Title order={1}>
                Welcome to Dashboard, <b>{userName}</b>
            </Title>
            <Text c="dimmed" size="lg">
                {subtitle}
            </Text>
        </Stack>
    );
}
