import {
    IconArticle,
    IconBrandProducthunt,
    IconPackage,
    IconUsers,
} from "@tabler/icons-react";

/**
 * Dashboard statistics configuration
 * Defines the cards displayed on the main dashboard page
 */
export const DASHBOARD_STATS_CONFIG = [
    {
        label: "Articles",
        icon: IconArticle,
        color: "grape",
        href: "/dashboard/news",
    },
    {
        label: "Products",
        icon: IconBrandProducthunt,
        color: "teal",
        href: "/dashboard/products",
    },
    {
        label: "Packaging Options",
        icon: IconPackage,
        color: "orange",
        href: "/dashboard/products/packaging-options",
    },
    {
        label: "Team Members",
        icon: IconUsers,
        color: "blue",
        href: "/dashboard/page-settings/team-members",
    },
] as const;
