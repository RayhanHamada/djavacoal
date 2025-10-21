import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ProductButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[#EFA12D] hover:bg-[#D68F1F] text-white",
    secondary: "bg-green-600 hover:bg-green-700 text-white",
    outline:
        "border border-[#3a3a3a] bg-transparent hover:bg-[#2a2a2a] text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-8 py-5 text-lg",
};

export function ProductButton({
    variant = "primary",
    size = "md",
    icon,
    className,
    children,
    ...props
}: ProductButtonProps) {
    return (
        <button
            className={cn(
                "flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
}
