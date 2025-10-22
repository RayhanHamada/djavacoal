import { LucideIcon } from "lucide-react";

interface FeatureIconProps {
    icon: LucideIcon;
    size?: "sm" | "md" | "lg";
}

export function FeatureIcon({ icon: Icon, size = "md" }: FeatureIconProps) {
    const sizeClasses = {
        sm: "h-12 w-12",
        md: "h-16 w-16",
        lg: "h-20 w-20",
    };

    const iconSizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
    };

    return (
        <div
            className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-[#EFA12D]/20`}
        >
            <Icon className={`${iconSizeClasses[size]} text-[#EFA12D]`} />
        </div>
    );
}
