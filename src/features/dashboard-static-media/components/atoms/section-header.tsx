"use client";

import { Divider, Text, Title } from "@mantine/core";

interface SectionHeaderProps {
    title: string;
    description?: string;
}

/**
 * SectionHeader - Atom component for section headers
 */
export function SectionHeader({ title, description }: SectionHeaderProps) {
    return (
        <>
            <div>
                <Title order={3} size="h4">
                    {title}
                </Title>
                {description && (
                    <Text size="sm" c="dimmed" mt={4}>
                        {description}
                    </Text>
                )}
            </div>
            <Divider my="md" />
        </>
    );
}
