"use client";

import { Center, Loader, Stack, Text } from "@mantine/core";

import { UI_TEXT } from "@/features/dashboard-blog-settings/lib";

interface LoadingStateProps {
    message?: string;
}

/**
 * LoadingState - Atom component for displaying loading state
 * Shows a centered loader with optional custom message
 */
export function LoadingState({
    message = UI_TEXT.LOADING_MESSAGE,
}: LoadingStateProps) {
    return (
        <Center py="xl">
            <Stack align="center" gap="md">
                <Loader size="lg" />
                <Text size="sm" c="dimmed">
                    {message}
                </Text>
            </Stack>
        </Center>
    );
}
