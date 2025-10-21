/* eslint-disable @next/next/no-img-element */
"use client";

import { COCONUT_SHELL_PRODUCT } from "../../lib";
import {
    ProductDescriptionCard,
    ProductHeader,
    ProductImageGallery,
    ProductShapes,
    ProductSpecifications,
} from "../molecules";
import ProductDescription from "../molecules/product-description";

export function ProductPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 pt-20 pb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-center text-4xl font-bold lg:text-5xl">
                        Products
                    </h1>
                </div>
            </div>

            {/* Video Gallery Section */}
            <ProductDescription />

            {/* Product Section */}
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Left Column - Images */}
                    <ProductImageGallery
                        images={COCONUT_SHELL_PRODUCT.images}
                    />

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        <ProductHeader
                            productName="Charcoal Briquette"
                            highlightedName="Coconut Shell"
                        />

                        <ProductDescriptionCard
                            description={COCONUT_SHELL_PRODUCT.description}
                        />

                        {/* Specifications */}
                        <div className="rounded-lg bg-gray-800/50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-[#EFA12D]">
                                Specification & Lab. Test:
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <img
                                    src="/api/placeholder/300/400"
                                    alt="Diamond Grade Specification"
                                    className="w-full rounded-lg"
                                />
                                <img
                                    src="/api/placeholder/300/400"
                                    alt="Certificate of Analysis"
                                    className="w-full rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shape & Size Section */}
                <div className="mt-12">
                    <ProductShapes shapes={COCONUT_SHELL_PRODUCT.shapes} />
                </div>

                {/* Detail Information */}
                <div className="mt-12">
                    <ProductSpecifications
                        specifications={COCONUT_SHELL_PRODUCT.specifications}
                    />
                </div>
            </div>
        </div>
    );
}
