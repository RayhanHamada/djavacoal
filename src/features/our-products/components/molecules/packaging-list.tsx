"use client";

import { PackagingCard } from "../atoms";

export type PackagingOption = {
    id: number;
    slug: string;
    type: string;
    description: string;
    image_url: string;
};

type PackagingListProps = {
    packagingOptions: PackagingOption[];
};

export function PackagingList({ packagingOptions }: PackagingListProps) {
    return (
        <div className="flex flex-col gap-5 self-stretch lg:gap-5">
            <h3 className="text-[20px] leading-[1.36] font-bold text-white lg:text-xl">
                Packaging Option:
            </h3>
            <div className="scrollbar-hide flex flex-row gap-5 overflow-x-auto md:flex-row lg:gap-5">
                {packagingOptions.map((option) => (
                    <PackagingCard
                        key={option.id}
                        title={option.type}
                        description={option.description}
                        image={option.image_url}
                    />
                ))}
            </div>
        </div>
    );
}
