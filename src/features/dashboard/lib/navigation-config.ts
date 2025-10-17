import type { NavigationItem } from "./types";

import {
    IconHome,
    IconArticle,
    IconUser,
    IconLayoutDashboard,
    IconBrandProducthunt,
    IconPlus,
    IconList,
} from "@tabler/icons-react";

export const navigationConfig: NavigationItem[] = [
    {
        label: "Dashboard",
        icon: IconHome,
        href: "/dashboard",
        description: "Back to Dashboard Home",
    },
    {
        label: "Products",
        icon: IconBrandProducthunt,
        description: "Product management",
        children: [
            {
                label: "Manage Products",
                icon: IconList,
                href: "/dashboard/products",
            },
            {
                label: "Create Product",
                icon: IconPlus,
                href: "/dashboard/products/create",
            },
        ],
    },
    {
        label: "Articles",
        icon: IconArticle,
        description: "Content management",
        children: [
            {
                label: "Manage Article",
                icon: IconList,
                href: "/dashboard/articles",
            },
            {
                label: "Create Article",
                icon: IconPlus,
                href: "/dashboard/articles/create",
            },
        ],
    },
    {
        label: "Admin",
        icon: IconUser,
        description: "Administrative panels",
        children: [
            { label: "Users", icon: IconUser, href: "/dashboard/admins" },
        ],
    },
    {
        label: "Page Settings",
        icon: IconLayoutDashboard,
        description: "Page configurations",
        href: "/dashboard/settings",
    },
];
