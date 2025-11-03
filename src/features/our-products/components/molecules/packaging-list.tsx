"use client";

import { PackagingCard } from "../atoms";

export type PackagingOption = {
    title: string;
    description: string;
    image: string;
};

type PackagingListProps = {
    packagingOptions: PackagingOption[];
};

export function PackagingList({ packagingOptions }: PackagingListProps) {
    return (
        <div className="flex flex-col gap-5 self-stretch lg:gap-[20px]">
            <h3 className="text-[20px] leading-[1.36] font-bold text-white lg:text-xl">
                Packaging Option:
            </h3>
            <div className="flex flex-col gap-5 md:flex-row md:gap-5 lg:flex-row lg:gap-[20px]">
                {packagingOptions.map((option, idx) => (
                    <PackagingCard key={idx} {...option} />
                ))}
            </div>
        </div>
    );
}
