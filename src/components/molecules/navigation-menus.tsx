"use client";

import { NavigationMenuButton } from "@/components/atoms";

const MOCK_PRODUCTS = [
    {
        label: "Coal",
        href: "/products/coal",
    },
    {
        label: "Hardwood Charcoal",
        href: "/products/hardwood-charcoal",
    },
    {
        label: "Coconut Shell Charcoal",
        href: "/products/coconut-shell-charcoal",
    },
    {
        label: "Bamboo Charcoal",
        href: "/products/bamboo-charcoal",
    },
];

export function NavigationMenus() {
    return (
        <div className="flex h-full items-center gap-x-4 self-stretch">
            <NavigationMenuButton key="home" label="Home" href="/" />
            <NavigationMenuButton
                key="about"
                label="About Company"
                submenus={[
                    {
                        label: "CV. Djavacoal Indonesia",
                        href: "/about#cv-djavacoal-indonesia",
                    },
                    {
                        label: "Djavacoal's Team",
                        href: "/about#djavacoals-team",
                    },
                    {
                        label: "What We Do ?",
                        href: "/about#what-we-do",
                    },
                    {
                        label: "Legal & Certificate",
                        href: "/about#legal-certificate",
                    },
                    {
                        label: "Factory",
                        href: "/about#factory",
                    },
                    {
                        label: "Our Gallery",
                        href: "/about#our-gallery",
                    },
                ]}
            />
            <NavigationMenuButton
                key="our-products"
                label="Our Products"
                submenus={MOCK_PRODUCTS}
            />
            <NavigationMenuButton
                key="production-info"
                label="Production Info"
                submenus={[
                    {
                        label: "Production Process",
                        href: "/production-info#production-process",
                    },
                    {
                        label: "Shipment Terms",
                        href: "/production-info#shipment-terms",
                    },
                    {
                        label: "MOQ & Payment Terms",
                        href: "/production-info#moq-payment-terms",
                    },
                    {
                        label: "FAQ",
                        href: "/production-info#faq",
                    },
                ]}
            />
            <NavigationMenuButton
                key="news-and-articles"
                label="News & Articles"
                href="/news"
            />
            <NavigationMenuButton
                key="contact"
                label="Contact"
                href="/contact-us"
            />
        </div>
    );
}
