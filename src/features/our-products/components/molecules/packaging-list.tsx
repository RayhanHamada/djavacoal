"use client";

import { useTranslations } from "next-intl";

import { PackagingCard } from "../atoms";
import { cn } from "@/lib/utils";

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
    const t = useTranslations("OurProducts");
    return (
        <div className="flex flex-col gap-5 self-stretch lg:gap-5">
            <h3 className="text-[20px] leading-[1.36] font-bold text-white lg:text-xl">
                {t("sections.packaging")}
            </h3>
            <div
                className={cn(
                    `scrollbar-hide flex flex-row gap-5 overflow-x-auto md:flex-row lg:gap-5`,
                    "min-[1300px]:grid-cols-3! sm:grid sm:grid-cols-2"
                )}
            >
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
