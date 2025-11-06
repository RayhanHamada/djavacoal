import type { IconSize } from "../../lib/types";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface FeatureIconProps {
    icon: LucideIcon;
    size?: IconSize;
    className?: string;
}

const SIZE_CONFIG: Record<IconSize, { container: string; icon: string }> = {
    sm: { container: "h-12 w-12", icon: "h-6 w-6" },
    md: { container: "h-16 w-16", icon: "h-8 w-8" },
    lg: { container: "h-20 w-20", icon: "h-10 w-10" },
};

/**
 * FeatureIcon component for displaying Lucide icons with consistent sizing
 * Used in statistics, features, and other icon-based displays
 */
export function FeatureIcon({
    icon: Icon,
    size = "md",
    className,
}: FeatureIconProps) {
    const config = SIZE_CONFIG[size];

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full bg-[#EFA12D]/20 transition-transform duration-300 group-hover:scale-110",
                config.container,
                className
            )}
        >
            <Icon className={cn("text-[#EFA12D]", config.icon)} />
        </div>
    );
}
