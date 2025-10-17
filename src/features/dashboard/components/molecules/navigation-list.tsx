"use client";

import type { NavigationItem } from "@/features/dashboard/lib/types";

import { ScrollArea, Stack } from "@mantine/core";

import { NavigationItemComponent } from "@/features/dashboard/components/atoms";

type Props = {
    items: NavigationItem[];
};

export function NavigationList({ items }: Props) {
    return (
        <ScrollArea style={{ flex: 1 }}>
            <Stack gap="xs" p="sm">
                {items.map((item) => (
                    <NavigationItemComponent key={item.label} item={item} />
                ))}
            </Stack>
        </ScrollArea>
    );
}
