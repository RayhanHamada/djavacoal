"use client";

import Link from "next/link";

import { IoMdArrowDropright } from "react-icons/io";

import { cn } from "@/lib/utils";

const navItemBaseStyles = cn(
    "my-2 flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium transition-all duration-200 rtl:text-right"
);

const navItemActiveStyles = cn("bg-[#9D7B19] font-semibold text-white");

const navItemInactiveStyles = cn(
    "hover:bg-secondary bg-[#222222] text-gray-300 hover:font-bold hover:text-white"
);

const navItemWrapperStyles = cn(
    "relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#2a2a2a]/60 after:content-[''] last:after:hidden rtl:after:right-0 rtl:after:left-auto"
);

interface SidebarNavButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

/**
 * Button-style navigation item for desktop sidebar.
 * Used for dynamic product selection.
 */
export function SidebarNavButton({
    label,
    isActive,
    onClick,
}: SidebarNavButtonProps) {
    return (
        <div className={navItemWrapperStyles}>
            <button
                onClick={onClick}
                className={cn(
                    navItemBaseStyles,
                    isActive ? navItemActiveStyles : navItemInactiveStyles
                )}
            >
                <span>{label}</span>
                <IoMdArrowDropright
                    size={12}
                    className={isActive ? "text-white" : "text-gray-400"}
                />
            </button>
        </div>
    );
}

interface SidebarNavLinkProps {
    href: string;
    label: string;
    isActive: boolean;
}

/**
 * Link-style navigation item for desktop sidebar.
 * Used for static page navigation.
 */
export function SidebarNavLink({ href, label, isActive }: SidebarNavLinkProps) {
    return (
        <div className={navItemWrapperStyles}>
            <Link
                href={href}
                className={cn(
                    navItemBaseStyles,
                    isActive ? navItemActiveStyles : navItemInactiveStyles
                )}
            >
                <span>{label}</span>
                <IoMdArrowDropright
                    size={12}
                    className={isActive ? "text-white" : "text-gray-400"}
                />
            </Link>
        </div>
    );
}
