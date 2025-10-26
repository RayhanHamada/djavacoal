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

            {/* Mobile/Tablet: Vertical Layout | Desktop: Horizontal Layout */}
            <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
                {/* Left Side: Product Image (Desktop) / Top (Mobile) */}
                <div className="flex justify-center lg:w-[365px] lg:flex-shrink-0">
                    <Image
                        src={productImage}
                        alt={productName}
                        width={365}
                        height={365}
                        className="h-auto w-full max-w-[365px]"
                    />
                </div>

                {/* Right Side: Content (Desktop) / Bottom (Mobile) */}
                <div className="flex flex-col gap-10 lg:flex-1">
                    {/* Product Name */}
                    <h2 className="text-left text-[32px] leading-none font-bold text-white md:text-[46px]">
                        {productName}
                    </h2>

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
            </div>
        </div>
    );
}
