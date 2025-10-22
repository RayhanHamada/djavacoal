"use client";

import Image from "next/image";

import { ActionButton } from "../atoms";

type ProductHeroSectionProps = {
    productName: string;
    productImage: string;
    onDownloadCatalogue: () => void;
    onAskMore: () => void;
};

export function ProductHeroSection({
    productName,
    productImage,
    onDownloadCatalogue,
    onAskMore,
}: ProductHeroSectionProps) {
    return (
        <div className="flex flex-col gap-10">
            {/* Divider */}
            <div className="h-[1px] w-full bg-[#393939]" />

            {/* Product Name */}
            <h2 className="text-left text-[32px] leading-none font-bold text-white md:text-[46px]">
                {productName}
            </h2>

            {/* Product Image */}
            <div className="flex justify-center">
                <Image
                    src={productImage}
                    alt={productName}
                    width={1180}
                    height={542}
                    className="h-auto w-full max-w-[1180px]"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-5 md:flex-row md:gap-5">
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
    );
}
