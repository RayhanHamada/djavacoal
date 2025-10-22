"use client";

import { useState } from "react";

import Image from "next/image";

import {
    ProductCategoryDropdown,
    ProductHeroSection,
    ProductDetailTable,
    ShapesList,
} from "../molecules";

const PRODUCT_CATEGORIES = [
    "Coconut Shell Charcoal Briquette",
    "Barbeque Charcoal Briquette",
    "Sawdust Charcoal",
    "Natural Wood Charcoal",
    "Djavacoal's Brand",
];

const PRODUCT_DATA = {
    "Coconut Shell Charcoal Briquette": {
        name: "Coconut Shell Charcoal Briquette",
        image: "/images/product-main-image.svg",
        description:
            "Coconut Shell Charcoal Briquette is an eco-friendly, sustainable fuel made from the natural byproduct of coconut shells. Known for its high calorific value, long burn time, and low ash content, it is ideal for grilling, barbecues, shisha, and industrial applications. This charcoal briquette burns cleanly without emitting harmful chemicals, making it a healthier alternative to traditional wood charcoal. Additionally, it's produced using a renewable resource, contributing to environmental conservation while delivering efficient and consistent heat, making it a popular choice for both domestic and commercial uses globally, especially in the shisha market.",
        specifications: [
            { image: "/images/product-spec-1.png" },
            { image: "/images/product-spec-2.png" },
        ],
        shapes: [
            {
                name: "CUBE",
                image: "/images/shape-cube.png",
                sizes: [
                    "22x22x22 - (96 pcs/kg)",
                    "25x25x25 - (72 pcs/kg)",
                    "26x26x26 - (64 pcs/kg)",
                    "27x27x27 - (54 pcs/kg)",
                    "28x28x28 - (50 pcs/kg)",
                ],
            },
            {
                name: "Flat",
                image: "/images/shape-flat.png",
                sizes: [
                    "25x25x17 -  (108 pcs/kg)",
                    "25x25x15 - (120 pcs/kg)",
                    "20x20x20 - (192 pcs/kg)",
                ],
            },
            {
                name: "Hexa",
                image: "/images/shape-hexa.png",
                sizes: [
                    "18x50 -  (72 pcs/kg)",
                    "20x35 - (96 pcs/kg)",
                    "20x50 - (64 pcs/kg)",
                ],
            },
            {
                name: "Stick",
                image: "/images/shape-stick.png",
                sizes: [
                    "18x50 -  (72 pcs/kg)",
                    "20x35 - (96 pcs/kg)",
                    "20x50 - (64 pcs/kg)",
                ],
            },
        ],
        details: [
            { label: "MOQ:", value: '20" Container (18 Tons)' },
            { label: "Packaging:", value: "Full / Bulk / Bulk Loose" },
            { label: "Payment Terms:", value: "Telegraphic Transfer (T/T)" },
            { label: "Shipment Terms:", value: "Freight on Board (FOB)" },
            { label: "Production Capacity:", value: "250 Tons/Month" },
        ],
    },
};

export function ProductPage() {
    const [selectedCategory, setSelectedCategory] = useState(
        PRODUCT_CATEGORIES[0]
    );

    const currentProduct =
        PRODUCT_DATA[selectedCategory as keyof typeof PRODUCT_DATA] ||
        PRODUCT_DATA["Coconut Shell Charcoal Briquette"];

    const handleDownloadCatalogue = () => {
        console.log("Download catalogue");
    };

    const handleAskMore = () => {
        window.open("https://wa.me/6282122859318", "_blank");
    };

    return (
        <div className="flex flex-col gap-10 px-5 py-0 md:gap-10 md:px-10 lg:gap-0 lg:px-10 lg:py-10">
            {/* Filter Dropdown (Mobile/Tablet) */}
            <div className="lg:hidden">
                <ProductCategoryDropdown
                    categories={PRODUCT_CATEGORIES}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
            </div>

            {/* Product Content */}
            <div className="flex flex-col gap-10">
                <ProductHeroSection
                    productName={currentProduct.name}
                    productImage={currentProduct.image}
                    onDownloadCatalogue={handleDownloadCatalogue}
                    onAskMore={handleAskMore}
                />

                {/* Divider */}
                <div className="h-[1px] w-full bg-[#393939]" />

                {/* Description Section */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-white">
                        Description:
                    </h3>
                    <p className="text-justify text-base leading-[23px] text-[#B3B3B3]">
                        {currentProduct.description}
                    </p>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-[#393939]" />

                {/* Specifications Section */}
                <div className="flex flex-col gap-5">
                    <h3 className="text-xl font-bold text-white">
                        Specification & Lab. Test:
                    </h3>
                    <div className="flex flex-col gap-5 md:flex-row md:gap-5">
                        {currentProduct.specifications.map((spec, idx) => (
                            <Image
                                key={idx}
                                src={spec.image}
                                alt={`Specification ${idx + 1}`}
                                width={744}
                                height={1054}
                                className="h-auto w-full"
                            />
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-[#393939]" />

                {/* Shapes Section */}
                <ShapesList shapes={currentProduct.shapes} />

                {/* Divider */}
                <div className="h-[1px] w-full bg-[#393939]" />

                {/* Detail Information Section */}
                <div className="flex flex-col gap-5">
                    <h3 className="text-xl font-bold text-white">
                        Detail Information:
                    </h3>
                    <ProductDetailTable rows={currentProduct.details} />
                </div>
            </div>
        </div>
    );
}
