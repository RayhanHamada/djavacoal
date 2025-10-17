"use client";

import type { NavigationItem } from "@/features/dashboard/lib/types";

import { useState } from "react";

import { NavLink, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

type Props = {
    item: NavigationItem;
    defaultOpened?: boolean;
};

export function NavigationItemComponent({ item, defaultOpened = true }: Props) {
    const Icon = item.icon;
    const [opened, setOpened] = useState(defaultOpened);

    // If item has no children, render as a simple link
    if (!item.children || item.children.length === 0) {
        return (
            <NavLink
                label={item.label}
                description={item.description}
                leftSection={<Icon size={18} stroke={1.7} />}
                component="a"
                href={item.href}
            />
        );
    }

    // If item has children, render as collapsible
    return (
        <NavLink
            label={item.label}
            description={item.description}
            leftSection={<Icon size={18} stroke={1.7} />}
            childrenOffset={rem(14)}
            opened={opened}
            onChange={() => setOpened((prev) => !prev)}
        >
            {item.children?.map((child) => {
                const CIcon = child.icon;
                return (
                    <NavLink
                        key={child.label}
                        label={child.label}
                        component="a"
                        href={child.href}
                        leftSection={<CIcon size={16} stroke={1.6} />}
                        rightSection={
                            <IconChevronRight size={14} stroke={1.4} />
                        }
                    />
                );
            })}
        </NavLink>
    );
}
