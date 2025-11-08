"use client";

import { useRouter } from "next/navigation";

import { ArrowIcon } from "./arrow-icon";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    className?: string;
    label?: string;
}

export function BackButton({ className, label = "Back" }: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={cn(
                "group hover:text-primary flex items-center gap-2 text-white transition-colors",
                className
            )}
        >
            <ArrowIcon direction="left" className="h-3.5 w-4" />
            <span className="font-inter text-base leading-[1.21em] font-normal">
                {label}
            </span>
        </button>
    );
}
