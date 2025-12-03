"use client";

import "react-photo-view/dist/react-photo-view.css";

import Image from "next/image";

import { useTranslations } from "next-intl";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { Divider, EmptyState, LoadingState, SectionHeading } from "../atoms";
import {
    ProductHeroSection,
    ProductDetailTable,
    ShapesList,
    PackagingList,
} from "../molecules";
import { MediaGallery } from "../molecules/media-gallery";
import { useProductDetailAPI } from "@/features/public-api/hooks";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Specification {
    id: number;
    image_url: string;
}

interface PackagingOption {
    type: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

interface ProductContentProps {
    slug: string;
}

/**
 * Product content organism - displays product details.
 * Fetches product data based on the provided slug.
 */
export function ProductContent({ slug }: ProductContentProps) {
    const t = useTranslations("OurProducts");
    const { data, isLoading, error } = useProductDetailAPI(slug);

    const selectedProduct = data?.data;

    if (isLoading) {
        return <LoadingState message={t("loading.details")} />;
    }

    if (error || !selectedProduct) {
        return <EmptyState message={t("productNotFound")} />;
    }

    const whatsappLink = `https://wa.me/${selectedProduct.whatsapp_number ?? ""}`;

    return (
        <PhotoProvider>
            <div className="flex flex-col gap-10">
                <div className="flex gap-x-10">
                    {/* Desktop Media Gallery */}
                    <div className="hidden max-w-[365px] min-w-[200px] flex-1 lg:block">
                        <MediaGallery medias={selectedProduct.medias} />
                    </div>

                    {/* Product Details Column */}
                    <div className="min-w-[350px] flex-3 lg:max-w-full">
                        <ProductHeroSection
                            productName={selectedProduct.name}
                            medias={selectedProduct.medias}
                            catalogueUrl={
                                selectedProduct.catalogue_url ?? undefined
                            }
                            askMoreUrl={whatsappLink}
                        />

                        <Divider />

                        <DescriptionSection
                            description={selectedProduct.description}
                        />

                        <Divider />

                        {selectedProduct.specifications.length > 0 && (
                            <>
                                <SpecificationsSection
                                    specifications={
                                        selectedProduct.specifications
                                    }
                                />
                                <Divider />
                            </>
                        )}

                        {selectedProduct.variants.length > 0 && (
                            <>
                                <ShapesList shapes={selectedProduct.variants} />
                                <Divider />
                            </>
                        )}

                        {selectedProduct.packaging_options.length > 0 && (
                            <>
                                <PackagingList
                                    packagingOptions={
                                        selectedProduct.packaging_options
                                    }
                                />
                                <Divider />
                            </>
                        )}

                        <DetailInfoSection
                            moq={selectedProduct.moq}
                            productionCapacity={
                                selectedProduct.production_capacity
                            }
                            packagingOptions={selectedProduct.packaging_options}
                        />
                    </div>
                </div>
            </div>
        </PhotoProvider>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────────────────────

interface DescriptionSectionProps {
    description: string;
}

function DescriptionSection({ description }: DescriptionSectionProps) {
    const t = useTranslations("OurProducts");

    return (
        <div className="flex flex-col gap-3">
            <SectionHeading>{t("sections.description")}</SectionHeading>
            <p
                className="text-justify text-base leading-[23px] wrap-break-word text-[#B3B3B3]"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        </div>
    );
}

interface SpecificationsSectionProps {
    specifications: Specification[];
}

function SpecificationsSection({ specifications }: SpecificationsSectionProps) {
    const t = useTranslations("OurProducts");

    return (
        <div className="flex flex-col gap-5">
            <SectionHeading>{t("sections.specification")}</SectionHeading>
            <div
                className={cn(
                    "grid grid-cols-2 gap-1 max-[1280px]:grid-cols-1 sm:gap-4 md:grid-cols-2"
                )}
            >
                {specifications.map((spec) => (
                    <PhotoView key={spec.id} src={spec.image_url}>
                        <Image
                            src={spec.image_url}
                            alt={t("altText.specification", { id: spec.id })}
                            width={744}
                            height={1054}
                            className="max-w-full"
                        />
                    </PhotoView>
                ))}
            </div>
        </div>
    );
}

interface DetailInfoSectionProps {
    moq: string | null;
    productionCapacity: string;
    packagingOptions: PackagingOption[];
}

function DetailInfoSection({
    moq,
    productionCapacity,
    packagingOptions,
}: DetailInfoSectionProps) {
    const t = useTranslations("OurProducts");

    const rows = [
        {
            label: t("detailTable.moq"),
            value: moq || t("detailTable.contactUs"),
        },
        {
            label: t("detailTable.packaging"),
            value:
                packagingOptions.map((p) => p.type).join(" / ") ||
                t("detailTable.contactUs"),
        },
        {
            label: t("detailTable.paymentTerms"),
            value: t("detailTable.paymentValue"),
        },
        {
            label: t("detailTable.shipmentTerms"),
            value: t("detailTable.shipmentValue"),
        },
        {
            label: t("detailTable.productionCapacity"),
            value: productionCapacity || t("detailTable.contactUs"),
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            <SectionHeading>{t("sections.detailInfo")}</SectionHeading>
            <ProductDetailTable rows={rows} />
        </div>
    );
}
