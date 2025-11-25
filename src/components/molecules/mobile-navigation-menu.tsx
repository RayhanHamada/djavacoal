"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { ChevronDown, ChevronUp } from "lucide-react";

import { LanguageSwitch } from "@/components/molecules/language-switch";
import { cn } from "@/lib/utils";

/**
 * Checks if a submenu href matches the current URL (pathname + search params)
 */
function isSubmenuActive(
    href: string,
    pathname: string,
    searchParams: URLSearchParams
): boolean {
    try {
        const url = new URL(href, "http://dummy");
        const hrefPathname = url.pathname;
        const hrefSearchParams = url.searchParams;

        // Must match pathname
        if (hrefPathname !== pathname) return false;

        // Check if all search params from href match current params
        for (const [key, value] of hrefSearchParams.entries()) {
            if (searchParams.get(key) !== value) return false;
        }

        return true;
    } catch {
        return false;
    }
}

type Submenu = {
    label: string;
    href: string;
};

type MenuItem = {
    label: string;
    href?: string;
    highlight: boolean;
    submenus?: Submenu[];
};

type Props = {
    isOpen: boolean;
    onClose(): void;
    menuItems: MenuItem[];
};

export function MobileNavigationMenu({ isOpen, onClose, menuItems }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const toggleSubmenu = (label: string) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

    const handleLinkClick = () => {
        onClose();
        setExpandedMenu(null);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-90 bg-black/50 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                    "lg:hidden"
                )}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Slide-in Menu */}
            <div
                className={cn(
                    "fixed top-0 right-0 z-95 h-full w-80 max-w-[85vw]",
                    "bg-primary/95 shadow-2xl backdrop-blur-xl",
                    "transform transition-transform duration-300 ease-in-out",
                    "flex flex-col overflow-y-auto",
                    isOpen ? "translate-x-0" : "translate-x-full",
                    "lg:hidden"
                )}
            >
                {/* Menu Header */}
                <div className="border-secondary/30 border-b px-6 py-6">
                    <h2 className="text-xl font-semibold text-white">Menu</h2>
                </div>

                {/* Language Switch Footer */}
                <div className="border-secondary/30 border-t px-4 pt-10">
                    <LanguageSwitch variant="mobile" />
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 pb-6">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.label}>
                                {item.href && !item.submenus ? (
                                    // Simple link
                                    <Link
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className={cn(
                                            "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                                            item.highlight
                                                ? "bg-secondary text-white"
                                                : "text-white hover:bg-white/10"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    // Menu with submenus
                                    <div>
                                        <button
                                            onClick={() =>
                                                toggleSubmenu(item.label)
                                            }
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-white transition-colors",
                                                item.highlight
                                                    ? "bg-secondary text-white"
                                                    : "hover:bg-white/10"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                            {expandedMenu === item.label ? (
                                                <ChevronUp size={20} />
                                            ) : (
                                                <ChevronDown size={20} />
                                            )}
                                        </button>
                                        {/* Submenus */}
                                        <div
                                            className={cn(
                                                "overflow-hidden transition-all duration-300",
                                                expandedMenu === item.label
                                                    ? "max-h-[500px] opacity-100"
                                                    : "max-h-0 opacity-0"
                                            )}
                                        >
                                            <ul className="border-secondary/30 mt-2 ml-4 space-y-1 border-l-2 pl-4">
                                                {item.submenus?.map(
                                                    (submenu) => {
                                                        const isActive =
                                                            isSubmenuActive(
                                                                submenu.href,
                                                                pathname,
                                                                searchParams
                                                            );
                                                        return (
                                                            <li
                                                                key={
                                                                    submenu.label
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        submenu.href
                                                                    }
                                                                    onClick={
                                                                        handleLinkClick
                                                                    }
                                                                    className={cn(
                                                                        "block rounded px-3 py-2 text-sm transition-colors",
                                                                        isActive
                                                                            ? "text-secondary font-semibold"
                                                                            : "hover:text-secondary text-white/90"
                                                                    )}
                                                                >
                                                                    {
                                                                        submenu.label
                                                                    }
                                                                </Link>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}
