"use client";

import {
    Group,
    Box,
    Title,
    Text,
    ActionIcon,
    useMantineColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

import { DashboardLogo } from "@/features/dashboard/components/atoms";

export function DashboardHeader() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme({
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
                {colorScheme === "dark" ? (
                    <IconSun size={20} />
                ) : (
                    <IconMoon size={20} />
                )}
            </ActionIcon>
        </Group>
    );
}
