import type { Product } from "../../lib/types";

import Image from "next/image";
import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProductCardProps extends Omit<Product, "id"> {
    className?: string;
    title: string;
    highlight: string;
    description: string;
}

/**
 * ProductCard component for displaying product information
 * Used in product grids and showcase sections
 */
export function ProductCard({
    title,
    highlight,
    description,
    image,
    href,
    className,
}: ProductCardProps) {
    return (
        <article
            className={cn(
                "bg-gradient-radial group relative overflow-hidden rounded-[20px] border border-[#4F4F4F] from-[#151515] to-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] md:p-8",
                className
            )}
        >
            {/* Product Image */}
            <div className="relative mb-6 flex h-[200px] items-center justify-center overflow-hidden rounded-[15px] bg-[#1D1D1D] md:h-[250px]">
                <Image
                    src={image}
                    alt={`${highlight} ${title}`}
                    width={300}
                    height={300}
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Product Info */}
            <div className="space-y-3">
                <div>
                    <h3 className="font-['Josefin_Sans'] text-[20px] font-bold text-white uppercase md:text-[24px]">
                        <span className="text-[#EFA12D]">{highlight}</span>{" "}
                        {title}
                    </h3>
                </div>

                <p className="font-['Open_Sans'] text-[14px] leading-relaxed text-[#C6C6C6] md:text-[15px]">
                    {description}
                </p>

                {/* CTA Link */}
                <Link
                    href={href}
                    className="mt-4 inline-flex items-center gap-2 font-['Open_Sans'] text-[14px] font-semibold text-[#EFA12D] uppercase transition-all hover:gap-3 md:text-[15px]"
                >
                    Detail Products
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </article>
    );
}
