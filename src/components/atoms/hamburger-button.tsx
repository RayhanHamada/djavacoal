"use client";

import { cn } from "@/lib/utils";

type Props = {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
};

export function HamburgerButton({ isOpen, onClick, className }: Props) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex h-10 w-10 flex-col items-center justify-center gap-1.5",
                "rounded-md transition-colors hover:bg-white/10",
                "focus:ring-secondary focus:ring-2 focus:outline-none",
                className
            )}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
        >
            <span
                className={cn(
                    "block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out",
                    isOpen && "translate-y-2 rotate-45"
                )}
            />
            <span
                className={cn(
                    "block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out",
                    isOpen && "opacity-0"
                )}
            />
            <span
                className={cn(
                    "block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out",
                    isOpen && "-translate-y-2 -rotate-45"
                )}
            />
        </button>
    );
}
