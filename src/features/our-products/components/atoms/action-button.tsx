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
            className={`flex w-full items-center justify-center gap-4 rounded-md ${bgColor} px-8 py-5 text-base font-bold text-white transition-opacity hover:opacity-90 md:px-20 lg:w-auto`}
        >
            <span>{label}</span>
            <Image src={icon} alt={label} width={24} height={24} />
        </button>
    );
}
