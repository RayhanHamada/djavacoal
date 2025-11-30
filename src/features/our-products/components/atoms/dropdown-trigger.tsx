"use client";

import { IoChevronDown, IoChevronUp } from "react-icons/io5";

interface DropdownTriggerProps {
    label: string;
    isOpen: boolean;
    onClick: () => void;
}

/**
 * Dropdown trigger button for mobile sidebar.
 * Displays current selection and toggle chevron.
 */
export function DropdownTrigger({
    label,
    isOpen,
    onClick,
}: DropdownTriggerProps) {
    return (
        <button
            onClick={onClick}
            className="flex w-full items-center justify-between rounded-sm border border-[#3a3a3a] px-4 py-2 text-sm text-white"
        >
            <span className="truncate">{label}</span>
            {isOpen ? (
                <IoChevronUp className="text-[#EFA12D]" />
            ) : (
                <IoChevronDown className="text-[#EFA12D]" />
            )}
        </button>
    );
}
