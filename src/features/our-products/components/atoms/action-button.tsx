"use client";

import Image from "next/image";

type ActionButtonProps = {
    label: string;
    icon: string;
    variant?: "primary" | "success";
    onClick?: () => void;
};

export function ActionButton({
    label,
    icon,
    variant = "primary",
    onClick,
}: ActionButtonProps) {
    const bgColor = variant === "primary" ? "bg-[#D28006]" : "bg-[#168738]";

    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center justify-center gap-2 rounded-md ${bgColor} px-4 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:gap-4 sm:px-8 sm:py-5 sm:text-base md:px-20 lg:w-auto`}
        >
            <span className="truncate">{label}</span>
            <Image
                src={icon}
                alt={label}
                width={20}
                height={20}
                className="shrink-0 sm:h-6 sm:w-6"
            />
        </button>
    );
}
