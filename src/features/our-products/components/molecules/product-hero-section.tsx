"use client";

import type { MediaItem } from "../../lib/types";

import { useLocale } from "next-intl";

import { ActionButton } from "../atoms";
import { MediaGalleryHorizontal } from "../molecules";
import { LOCALES } from "@/configs";

type ProductHeroSectionProps = {
    productName: string;
    medias: MediaItem[];
    catalogueUrl?: string;
    askMoreUrl?: string;
};

export function ProductHeroSection({
    productName,
    medias,
    catalogueUrl,
    askMoreUrl,
}: ProductHeroSectionProps) {
    const locale = useLocale();
    const parts = productName.split(" ");

    const highlightedName = (
        locale === LOCALES.AR
            ? parts.slice(0)
            : parts.length > 2
              ? parts.slice(0, 2)
              : parts.slice(0, 1)
    ).join(" ");

    const remainingName =
        locale === LOCALES.AR
            ? ""
            : parts.length > 1
              ? " " + parts.slice(2).join(" ")
              : "";
    return (
        <div className="flex w-full min-w-[372px] flex-col gap-10">
            {/* Mobile/Tablet: Vertical Layout | Desktop: Horizontal Layout */}
            <div className="flex w-full flex-col gap-10 lg:flex-row lg:gap-10">
                {/* Right Side: Content (Desktop) / Bottom (Mobile) */}
                <div className="mt-10 flex w-full flex-col gap-10 lg:mt-0 lg:flex-1">
                    {/* Product Name */}
                    <h2 className="text-secondary max-w-full text-left text-[32px] leading-none font-bold whitespace-normal md:text-[46px]">
                        {highlightedName}{" "}
                        <span className="text-white">{remainingName}</span>
                    </h2>

                    {/* Product Media Gallery - Mobile/Tablet only */}
                    <div className="flex h-auto w-full max-w-full justify-center overflow-hidden lg:hidden">
                        <MediaGalleryHorizontal medias={medias} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-full max-w-full flex-row flex-wrap gap-3 sm:gap-5">
                        <ActionButton
                            href={catalogueUrl || "#"}
                            label="Catalogue"
                            icon="/images/icon-download.svg"
                            variant="primary"
                        />
                        <ActionButton
                            href={askMoreUrl || "#"}
                            label="Ask More"
                            icon="/images/icon-whatsapp.svg"
                            variant="success"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
