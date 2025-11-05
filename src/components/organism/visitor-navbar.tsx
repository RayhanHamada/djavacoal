"use client";

import { PropsWithChildren, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { HamburgerButton } from "@/components/atoms";
import { MobileNavigationMenu, NavigationMenus } from "@/components/molecules";
import { LanguageSwitch } from "@/components/molecules/language-switch";
import { useMenuItems } from "@/hooks";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren;

export default function VisitorNavbar(_: Props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuItems = useMenuItems();

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
                menuItems={menuItems}
            />
        </>
    );
}
