import type { Feature } from "../../lib/types";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface FeatureCardProps extends Feature {
    description?: string;
    className?: string;
}

/**
 * FeatureCard component for displaying product features or benefits
 * Used in feature grids or why-choose-us sections
 */
export function FeatureCard({
    icon,
    title,
    description,
    className,
}: FeatureCardProps) {
    return (
        <div
            className={cn(
                "bg-gradient-radial group flex flex-col items-center gap-4 rounded-lg border border-[#414141] from-[#151515] to-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] md:p-8",
                className
            )}
        >
            <div className="relative h-[177.5px] w-full">
                <Image
                    src={icon}
                    alt={title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <h3 className="text-center font-['Josefin_Sans'] text-base leading-none font-bold text-[#EFA12D] uppercase md:text-xl lg:leading-tight">
                {title}
            </h3>

            {description && (
                <p className="text-center font-['Open_Sans'] text-[13px] text-[#C6C6C6] md:text-[14px]">
                    {description}
                </p>
            )}
        </div>
    );
}
