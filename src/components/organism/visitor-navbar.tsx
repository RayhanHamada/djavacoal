"use client";

import { PropsWithChildren, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { HamburgerButton } from "@/components/atoms";
import { MobileNavigationMenu, NavigationMenus } from "@/components/molecules";
import { LanguageSwitch } from "@/components/molecules/language-switch";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren;

// Menu items configuration for mobile menu
const MENU_ITEMS = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "About Company",
        submenus: [
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
        ],
    },
    {
        label: "Our Products",
        submenus: [
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
        ],
    },
    {
        label: "Production Info",
        submenus: [
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
        ],
    },
    {
        label: "News & Articles",
        href: "/news",
    },
    {
        label: "Contact",
        href: "/contact-us",
    },
];

export default function VisitorNavbar(_: Props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="border-b-secondary bg-primary/90 fixed z-100 flex min-h-24 w-full items-center justify-between backdrop-blur-xl">
                <Link
                    href="/"
                    className="px-6 text-lg font-semibold lg:ml-[50px]"
                >
                    <Image
                        className="h-auto w-34"
                        src="/svgs/logo.svg"
                        alt="Logo"
                        width={100}
                        height={80}
                    />
                </Link>
                {/* Desktop Navigation */}
                <div className={cn("hidden h-auto self-stretch", "lg:block")}>
                    <NavigationMenus />
                </div>
                {/* Desktop Language Switch */}
                <div
                    className={cn(
                        "hidden px-6 py-4",
                        "lg:block",
                        "lg:mr-[50px]"
                    )}
                >
                    <LanguageSwitch />
                </div>
                {/* Mobile Hamburger Button */}
                <div className={cn("px-6", "lg:hidden")}>
                    <HamburgerButton
                        isOpen={isMobileMenuOpen}
                        onClick={toggleMobileMenu}
                    />
                </div>
                {/* Garis bawah oranye */}
                <div className="bg-secondary absolute bottom-0 left-0 h-0.5 w-full"></div>
            </nav>

            {/* Mobile Navigation Menu */}
            <MobileNavigationMenu
                isOpen={isMobileMenuOpen}
                onClose={closeMobileMenu}
                menuItems={MENU_ITEMS}
            />
        </>
    );
}
