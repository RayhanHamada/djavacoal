"use client";

import type { GalleryType } from "../../lib/types";

import { FACTORY_GALLERY, PRODUCT_GALLERY } from "../../lib/constants";
import { FadeInView, GalleryImage } from "../atoms";

interface PhotoGalleryProps {
    galleryType: GalleryType;
    onImageClick: (index: number) => void;
}

export default function PhotoGallery({
    galleryType,
    onImageClick,
}: PhotoGalleryProps) {
    const images =
        galleryType === "factory" ? FACTORY_GALLERY : PRODUCT_GALLERY;

    return (
        <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-6 md:px-0 lg:grid-cols-4 lg:gap-8">
            {images.map((image, index) => (
                <FadeInView key={image.src} delay={index * 0.05}>
                    <GalleryImage
                        image={image}
                        onClick={() => onImageClick(index)}
                    />
                </FadeInView>
            ))}
        </div>
    );
}
