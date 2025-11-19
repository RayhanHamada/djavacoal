"use client";
import "react-photo-view/dist/react-photo-view.css";

import { useState } from "react";

import Image from "next/image";

import { PhotoProvider, PhotoView } from "react-photo-view";

import {
    ProductHeroSection,
    ProductDetailTable,
    ShapesList,
    PackagingList,
    OurProductsSidebar,
    MediaGallery,
    DjavacoalBrandPage,
} from "../molecules";
import { useProducts } from "@/features/our-products/hooks";

export function ProductPage() {
    const {
        products,
        selectedProduct,
        selectedProductId,
        isLoadingProducts,
        isLoadingDetail,
        hasProducts,
        handleProductSelect,
    } = useProducts();

    const [isBrandSelected, setIsBrandSelected] = useState(false);

    const handleBrandSelect = () => {
        setIsBrandSelected(true);
    };

    const handleProductSelectWrapper = (productId: number) => {
        setIsBrandSelected(false);
        handleProductSelect(productId);
    };

    if (isLoadingProducts) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-white">Loading products...</div>
            </div>
        );
    }

    if (!hasProducts) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-white">No products found.</div>
            </div>
        );
    }

    const handleDownloadCatalogue = () => {
        console.log("Download catalogue");
    };

    const handleAskMore = () => {
        window.open("https://wa.me/6282122859318", "_blank");
    };

    return (
        <PhotoProvider>
            <div className="flex flex-col gap-10 py-0 lg:gap-0 lg:px-0">
                {/* Mobile Dropdown - sticky at top for mobile/tablet only */}
                <div className="sticky top-24 z-50 lg:hidden">
                    <OurProductsSidebar
                        products={products}
                        selectedProductId={
                            isBrandSelected ? undefined : selectedProductId
                        }
                        onProductSelect={handleProductSelectWrapper}
                        isBrandSelected={isBrandSelected}
                        onBrandSelect={handleBrandSelect}
                    />
                </div>

                <section className="mx-auto max-w-7xl px-5 py-0 pb-10 md:px-10 md:py-16 lg:mx-0 lg:mr-10 lg:max-w-none lg:px-0 lg:py-0">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
                        {/* === LEFT SIDEBAR (Desktop Only) === */}
                        <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
                            <div className="bg-[#222222] pt-16 pb-[100vh]">
                                <OurProductsSidebar
                                    products={products}
                                    selectedProductId={
                                        isBrandSelected
                                            ? undefined
                                            : selectedProductId
                                    }
                                    onProductSelect={handleProductSelectWrapper}
                                    isBrandSelected={isBrandSelected}
                                    onBrandSelect={handleBrandSelect}
                                />
                            </div>
                        </div>

                        <div className="my-0 space-y-12 rounded-xl py-0 pb-10 lg:my-16 lg:bg-[#222222] lg:px-10 lg:py-10 lg:pb-10">
                            {isBrandSelected ? (
                                <DjavacoalBrandPage />
                            ) : isLoadingDetail ? (
                                <div className="flex min-h-[400px] items-center justify-center">
                                    <div className="text-white">
                                        Loading product details...
                                    </div>
                                </div>
                            ) : selectedProduct ? (
                                <div className="flex flex-col gap-10">
                                    <div className="flex gap-x-10">
                                        <div className="hidden max-w-[420px] lg:block lg:flex-1">
                                            <MediaGallery
                                                medias={selectedProduct.medias}
                                            />
                                        </div>
                                        <div className="min-w-[372px] flex-1 lg:max-w-full">
                                            <ProductHeroSection
                                                productName={
                                                    selectedProduct.name
                                                }
                                                medias={selectedProduct.medias}
                                                onDownloadCatalogue={
                                                    handleDownloadCatalogue
                                                }
                                                onAskMore={handleAskMore}
                                            />

                                            {/* Divider */}
                                            <div className="my-6 h-px w-full bg-[#393939]" />

                                            {/* Description Section */}
                                            <div className="flex flex-col gap-3">
                                                <h3 className="text-xl font-bold text-white">
                                                    Description:
                                                </h3>
                                                <p
                                                    className="text-justify text-base leading-[23px] text-[#B3B3B3]"
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedProduct.description,
                                                    }}
                                                ></p>
                                            </div>

                                            {/* Divider */}
                                            <div className="my-6 h-px w-full bg-[#393939]" />

                                            {/* Specifications Section */}
                                            {selectedProduct.specifications
                                                .length > 0 && (
                                                <>
                                                    <div className="flex flex-col gap-5">
                                                        <h3 className="text-xl font-bold text-white">
                                                            Specification & Lab.
                                                            Test:
                                                        </h3>

                                                        <div className="justify-left flex flex-wrap items-center gap-5 md:flex-row md:gap-5 lg:gap-10 [1800px]:flex-nowrap [2330px]:max-w-[600px]">
                                                            {selectedProduct.specifications.map(
                                                                (spec) => (
                                                                    <PhotoView
                                                                        key={
                                                                            spec.id
                                                                        }
                                                                        src={
                                                                            spec.image_url
                                                                        }
                                                                    >
                                                                        <Image
                                                                            src={
                                                                                spec.image_url
                                                                            }
                                                                            alt={`Specification ${spec.id}`}
                                                                            width={
                                                                                744
                                                                            }
                                                                            height={
                                                                                1054
                                                                            }
                                                                            className="h-auto w-full max-w-full md:w-auto lg:max-w-[400px]"
                                                                        />
                                                                    </PhotoView>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Divider */}
                                                    <div className="my-6 h-px w-full bg-[#393939]" />
                                                </>
                                            )}

                                            {/* Shapes/Variants Section */}
                                            {selectedProduct.variants
                                                .length && (
                                                <>
                                                    <ShapesList
                                                        shapes={
                                                            selectedProduct.variants
                                                        }
                                                    />

                                                    {/* Divider */}
                                                    <div className="my-6 h-px w-full bg-[#393939]" />
                                                </>
                                            )}

                                            {/* Packaging Options Section */}
                                            {selectedProduct.packaging_options
                                                .length && (
                                                <>
                                                    <PackagingList
                                                        packagingOptions={
                                                            selectedProduct.packaging_options
                                                        }
                                                    />

                                                    {/* Divider */}
                                                    <div className="my-6 h-px w-full bg-[#393939]" />
                                                </>
                                            )}

                                            {/* Detail Information Section */}
                                            <div className="flex min-w-[372px] flex-col gap-5">
                                                <h3 className="text-xl font-bold text-white">
                                                    Detail Information:
                                                </h3>
                                                <ProductDetailTable
                                                    rows={[
                                                        {
                                                            label: "MOQ:",
                                                            value:
                                                                selectedProduct.moq ||
                                                                "Contact us",
                                                        },
                                                        {
                                                            label: "Packaging:",
                                                            value:
                                                                selectedProduct.packaging_options
                                                                    .map(
                                                                        (p) =>
                                                                            p.type
                                                                    )
                                                                    .join(
                                                                        " / "
                                                                    ) ||
                                                                "Contact us",
                                                        },
                                                        {
                                                            label: "Payment Terms:",
                                                            value: "Telegraphic Transfer (T/T)",
                                                        },
                                                        {
                                                            label: "Shipment Terms:",
                                                            value: "Freight on Board (FOB)",
                                                        },
                                                        {
                                                            label: "Production Capacity:",
                                                            value:
                                                                selectedProduct.production_capacity ||
                                                                "Contact us",
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[400px] items-center justify-center">
                                    <div className="text-white">
                                        Product not found.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </PhotoProvider>
    );
}
