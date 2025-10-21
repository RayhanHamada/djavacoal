"use client";
import React from "react";

import VideoGallerySection from "@/features/our-products/components/atoms/image-carousel";

export default function ProductDescription() {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <VideoGallerySection />
            </div>
        </div>
    );
}
