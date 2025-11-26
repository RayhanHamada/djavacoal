"use client";
import "react-photo-view/dist/react-photo-view.css";

import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";
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
import { LOCALES } from "@/configs";
import { useProducts } from "@/features/our-products/hooks";
import { cn } from "@/lib/utils";

export function ProductPage() {
    const locale = useLocale();
    const t = useTranslations("OurProducts");

    const {
        products,
        selectedProduct,
        selectedProductId,
        isLoadingProducts,
        isLoadingDetail,
        hasProducts,
        isBrandSelected,
        handleProductSelect,
        handleBrandSelect,
    } = useProducts();

    if (isLoadingProducts) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-white">{t("loading.products")}</div>
            </div>
        );
    }

    if (!hasProducts) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-white">{t("noProducts")}</div>
            </div>
        );
    }

    return (
        <PhotoProvider>
            <div className="flex flex-col gap-10 gap-y-0 py-0 lg:gap-0 lg:px-0">
                {/* Mobile Dropdown - sticky at top for mobile/tablet only */}
                <div className="sticky top-24 z-50 lg:hidden">
                    <OurProductsSidebar
                        products={products}
                        selectedProductId={
                            isBrandSelected ? undefined : selectedProductId
                        }
                        onProductSelect={handleProductSelect}
                        isBrandSelected={isBrandSelected}
                        onBrandSelect={handleBrandSelect}
                    />
                </div>

                <section
                    className={cn(
                        "mx-auto max-w-7xl px-5 py-0 pb-10 md:px-10 md:py-16 lg:mx-0 lg:max-w-none lg:px-0 lg:py-0",
                        locale === LOCALES.AR ? "lg:ml-10" : "lg:mr-10"
                    )}
                >
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
                                    onProductSelect={handleProductSelect}
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
                                        {t("loading.details")}
                                    </div>
                                </div>
                            ) : selectedProduct ? (
                                <div className="flex flex-col gap-10">
                                    <div className="flex gap-x-10">
                                        <div className="hidden max-w-[365px] min-w-[200px] flex-1 lg:block">
                                            <MediaGallery
                                                medias={selectedProduct.medias}
                                            />
                                        </div>
                                        <div className="min-w-[350px] flex-3 lg:max-w-full">
                                            <ProductHeroSection
                                                productName={
                                                    selectedProduct.name
                                                }
                                                medias={selectedProduct.medias}
                                                catalogueUrl={
                                                    selectedProduct.catalogue_url ??
                                                    undefined
                                                }
                                                askMoreUrl={`https://wa.me/${selectedProduct.whatsapp_number}`}
                                            />

                                            {/* Divider */}
                                            <div className="my-6 h-px w-full bg-[#393939]" />

                                            {/* Description Section */}
                                            <div className="flex flex-col gap-3">
                                                <h3 className="text-xl font-bold text-white">
                                                    {t("sections.description")}
                                                </h3>
                                                <p
                                                    className="text-justify text-base leading-[23px] wrap-break-word text-[#B3B3B3]"
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
                                                            {t(
                                                                "sections.specification"
                                                            )}
                                                        </h3>

                                                        <div
                                                            className={cn(
                                                                "grid grid-cols-2 gap-1 max-[1280px]:grid-cols-1 sm:gap-4 md:grid-cols-2"
                                                            )}
                                                        >
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
                                                                            alt={t(
                                                                                "altText.specification",
                                                                                {
                                                                                    id: spec.id,
                                                                                }
                                                                            )}
                                                                            width={
                                                                                744
                                                                            }
                                                                            height={
                                                                                1054
                                                                            }
                                                                            className="max-w-full"
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
                                            <div className="flex flex-col gap-5">
                                                <h3 className="text-xl font-bold text-white">
                                                    {t("sections.detailInfo")}
                                                </h3>
                                                <ProductDetailTable
                                                    rows={[
                                                        {
                                                            label: t(
                                                                "detailTable.moq"
                                                            ),
                                                            value:
                                                                selectedProduct.moq ||
                                                                t(
                                                                    "detailTable.contactUs"
                                                                ),
                                                        },
                                                        {
                                                            label: t(
                                                                "detailTable.packaging"
                                                            ),
                                                            value:
                                                                selectedProduct.packaging_options
                                                                    .map(
                                                                        (p) =>
                                                                            p.type
                                                                    )
                                                                    .join(
                                                                        " / "
                                                                    ) ||
                                                                t(
                                                                    "detailTable.contactUs"
                                                                ),
                                                        },
                                                        {
                                                            label: t(
                                                                "detailTable.paymentTerms"
                                                            ),
                                                            value: t(
                                                                "detailTable.paymentValue"
                                                            ),
                                                        },
                                                        {
                                                            label: t(
                                                                "detailTable.shipmentTerms"
                                                            ),
                                                            value: t(
                                                                "detailTable.shipmentValue"
                                                            ),
                                                        },
                                                        {
                                                            label: t(
                                                                "detailTable.productionCapacity"
                                                            ),
                                                            value:
                                                                selectedProduct.production_capacity ||
                                                                t(
                                                                    "detailTable.contactUs"
                                                                ),
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
                                        {t("productNotFound")}
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
