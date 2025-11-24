"use client";

import { Box, Text, Title } from "@mantine/core";

interface SectionHeaderProps {
    title: string;
    description?: string;
}

/**
 * SectionHeader - Atom component for section headers
 * Displays a title and optional description with consistent styling
 */
export function SectionHeader({ title, description }: SectionHeaderProps) {
    return (
        <Box>
            <Title order={2} size="h3" mb={description ? "xs" : 0}>
                {title}
            </Title>
            {description && (
                <Text size="sm" c="dimmed">
                    {description}
                </Text>
            )}
        </Box>
    );
}
