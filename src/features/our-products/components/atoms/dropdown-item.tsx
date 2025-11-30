"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

const dropdownItemBaseStyles =
    "block w-full px-4 py-2 text-left text-sm rtl:text-right";

const dropdownItemActiveStyles = "text-[#EFA12D] underline underline-offset-4";

const dropdownItemInactiveStyles = "text-white hover:text-[#EFA12D]";

interface DropdownItemButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

/**
 * Button-style dropdown item for mobile sidebar.
 * Used for dynamic product selection.
 */
export function DropdownItemButton({
    label,
    isActive,
    onClick,
}: DropdownItemButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                dropdownItemBaseStyles,
                isActive ? dropdownItemActiveStyles : dropdownItemInactiveStyles
            )}
        >
            {label}
        </button>
    );
}

interface DropdownItemLinkProps {
    href: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}

/**
 * Link-style dropdown item for mobile sidebar.
 * Used for static page navigation.
 */
export function DropdownItemLink({
    href,
    label,
    isActive,
    onClick,
}: DropdownItemLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                dropdownItemBaseStyles,
                isActive ? dropdownItemActiveStyles : dropdownItemInactiveStyles
            )}
        >
            {label}
        </Link>
    );
}
