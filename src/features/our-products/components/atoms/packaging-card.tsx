"use client";

import Image from "next/image";

type PackagingCardProps = {
    title: string;
    description: string;
    image: string;
};

export function PackagingCard({
    title,
    description,
    image,
}: PackagingCardProps) {
    return (
        <div className="flex flex-col gap-5 lg:gap-[20px]">
            {/* Image */}
            <div className="flex items-center justify-center overflow-hidden rounded-[10px] border border-[#414141] bg-gradient-to-b from-[#323232] to-[#323232]">
                <Image
                    src={image}
                    alt={title}
                    width={330}
                    height={372}
                    className="h-auto w-full object-contain"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-[10px]">
                <h4 className="text-[20px] leading-[1.36] font-bold text-white">
                    {title}
                </h4>
                <p className="text-[16px] leading-[1.36] font-normal text-[#C6C6C6]">
                    {description}
                </p>
            </div>
        </div>
    );
}
