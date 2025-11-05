"use client";

import { ActionButton, VideoGallerySectionMd } from "../atoms";

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
    return (
        <div className="flex w-full flex-col gap-10">
            {/* Divider */}
            {/* <div className="hidden h-[1px] w-full bg-[#393939]" /> */}

            {/* Mobile/Tablet: Vertical Layout | Desktop: Horizontal Layout */}
            <div className="flex w-full flex-col gap-10 lg:flex-row lg:gap-10">
                {/* Right Side: Content (Desktop) / Bottom (Mobile) */}
                <div className="mt-10 flex w-full flex-col gap-10 lg:mt-0 lg:flex-1">
                    {/* Product Name */}
                    <h2 className="max-w-full text-left text-[32px] leading-none font-bold whitespace-normal text-white md:text-[46px]">
                        {productName}
                    </h2>

                    {/* Left Side: Product Image (Desktop) / Top (Mobile) */}
                    <div className="flex justify-center lg:hidden lg:w-[365px]">
                        <VideoGallerySectionMd />
                        {/* <Image
                            src={productImage}
                            alt={productName}
                            width={365}
                            height={365}
                            className="h-auto w-full max-w-[365px]"
                        /> */}
                    </div>

                    {/* Action Buttons */}
                    <div className="max-w-auto flex flex-row gap-5">
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
