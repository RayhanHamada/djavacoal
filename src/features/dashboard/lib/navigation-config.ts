import type { NavigationItem } from "./types";

import {
    IconHome,
    IconArticle,
    IconUser,
    IconLayoutDashboard,
    IconBrandProducthunt,
    IconPlus,
    IconList,
    IconPhoto,
    IconPackage,
} from "@tabler/icons-react";

export const navigationConfig: NavigationItem[] = [
    {
        label: "Dashboard",
        icon: IconHome,
        href: "/dashboard",
        description: "Back to Dashboard Home",
    },
    {
        label: "Gallery",
        icon: IconPhoto,
        href: "/dashboard/gallery",
        description: "Photo Gallery Management",
    },
    {
        label: "News and Articles",
        icon: IconArticle,
        description: "News Content management",
        href: "/dashboard/news",
    },
    {
        label: "Products",
        icon: IconBrandProducthunt,
        description: "Product management",
        children: [
            {
                label: "Manage Packaging Options",
                icon: IconPackage,
                href: "/dashboard/products/packaging-options",
            },
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
        label: "Admin",
        icon: IconUser,
        description: "Administrative panels",
        href: "/dashboard/admins",
    },
    {
        label: "Page Settings",
        icon: IconLayoutDashboard,
        description: "Page configurations",
        href: "/dashboard/settings",
    },
];
