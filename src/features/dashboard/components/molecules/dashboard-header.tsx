"use client";

import {
    Group,
    Box,
    Title,
    Text,
    ActionIcon,
    useMantineColorScheme,
} from "@mantine/core";

import {
    DashboardLogo,
    ThemeIcon,
} from "@/features/dashboard/components/atoms";

export function DashboardHeader() {
    const { toggleColorScheme } = useMantineColorScheme({
        keepTransitions: true,
    });

    return (
        <Group h="100%" px="md" justify="space-between">
            <Group gap="xs">
                <DashboardLogo />
                <Box>
                    <Title order={4} fw={600}>
                        Djavacoal Admin
                    </Title>
                    <Text size="xs" c="dimmed">
                        Content Management System
                    </Text>
                </Box>
            </Group>
            <ActionIcon
                onClick={toggleColorScheme}
                variant="default"
                size="lg"
                aria-label="Toggle color scheme"
            >
                <ThemeIcon />
            </ActionIcon>
        </Group>
    );
}
