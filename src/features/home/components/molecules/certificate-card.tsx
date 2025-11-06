import type { Certificate } from "../../lib/types";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface CertificateCardProps extends Certificate {
    className?: string;
}

/**
 * CertificateCard component for displaying certificates or awards
 * Used in sections showcasing company certifications and achievements
 */
export function CertificateCard({
    image,
    title,
    subtitle,
    width,
    height,
    className,
}: CertificateCardProps) {
    return (
        <div
            className={cn(
                "bg-gradient-radial flex flex-col items-center justify-center gap-2 rounded-lg border border-[#4F4F4F] from-[#151515] to-white/10 p-4 transition-all duration-300 hover:border-[#EFA12D] md:p-6",
                className
            )}
        >
            <div className="relative flex items-center justify-center">
                <Image
                    src={image}
                    alt={title}
                    width={width}
                    height={height}
                    className="object-contain"
                />
            </div>

            <div className="flex flex-col items-center gap-0">
                <p className="text-center font-['Poppins'] text-[14px] leading-[1.5em] text-white md:text-[17px]">
                    {title}
                </p>
                {subtitle && (
                    <p className="text-center font-['Poppins'] text-[10px] leading-[1.5em] text-white md:text-[12px]">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
