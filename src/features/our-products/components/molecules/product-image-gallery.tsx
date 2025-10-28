"use client";
import type { ProductImage } from "../../lib";

import { useState } from "react";

interface ProductImageGalleryProps {
    images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-4">
            <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-gray-800 p-8">
                <img
                    src={images[selectedImage].src}
                    alt={images[selectedImage].alt}
                    className="h-auto max-w-full"
                />
            </div>

            <div className="grid grid-cols-4 gap-4">
                {images.slice(1, 5).map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx + 1)}
                        className={`rounded-lg bg-gray-800 p-4 transition hover:ring-2 hover:ring-[#EFA12D] ${
                            selectedImage === idx + 1
                                ? "ring-2 ring-[#EFA12D]"
                                : ""
                        }`}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="h-auto w-full"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
