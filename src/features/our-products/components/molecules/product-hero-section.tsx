"use client";

import { useLocale } from "next-intl";

import { ActionButton, VideoGallerySectionMd } from "../atoms";
import { LOCALES } from "@/configs";

type ProductHeroSectionProps = {
    productName: string;
    onDownloadCatalogue: () => void;
    onAskMore: () => void;
};

export function ProductHeroSection({
    productName,
    onDownloadCatalogue,
    onAskMore,
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
            {/* Divider */}
            {/* <div className="hidden h-[1px] w-full bg-[#393939]" /> */}

            {/* Mobile/Tablet: Vertical Layout | Desktop: Horizontal Layout */}
            <div className="flex w-full flex-col gap-10 lg:flex-row lg:gap-10">
                {/* Right Side: Content (Desktop) / Bottom (Mobile) */}
                <div className="mt-10 flex w-full flex-col gap-10 lg:mt-0 lg:flex-1">
                    {/* Product Name */}
                    <h2 className="text-secondary max-w-full text-left text-[32px] leading-none font-bold whitespace-normal md:text-[46px]">
                        {highlightedName}{" "}
                        <span className="text-white">{remainingName}</span>
                    </h2>

                    {/* Left Side: Product Image (Desktop) / Top (Mobile) */}
                    <div className="flex w-full max-w-full justify-center lg:hidden">
                        <VideoGallerySectionMd />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-full max-w-full flex-row flex-wrap gap-3 sm:gap-5">
                        <ActionButton
                            label="Catalogue"
                            icon="/images/icon-download.svg"
                            variant="primary"
                            onClick={onDownloadCatalogue}
                        />
                        <ActionButton
                            label="Ask More"
                            icon="/images/icon-whatsapp.svg"
                            variant="success"
                            onClick={onAskMore}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
