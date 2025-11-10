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
        <div className="group flex max-w-[330px] shrink-0 flex-col gap-5 transition-all duration-300 md:w-full md:min-w-0 lg:gap-5">
            {/* Image */}
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[10px] border border-[#414141] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff40_100%)] from-[#323232] to-[#323232]">
                <Image
                    src={image}
                    alt={title}
                    width={330}
                    height={330}
                    className="h-auto w-full object-contain group-hover:scale-110"
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
