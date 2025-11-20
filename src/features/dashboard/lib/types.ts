import type { MantineColor } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";

export type NavigationChild = {
    label: string;
    icon: Icon;
    href: string;
};

export type NavigationItem = {
    label: string;
    icon: Icon;
    href?: string;
    description?: string;
    children?: NavigationChild[];
};

export type DashboardStatCard = {
    label: string;
    count: number;
    icon: Icon;
    color: MantineColor;
    href: string;
    loading?: boolean;
};
