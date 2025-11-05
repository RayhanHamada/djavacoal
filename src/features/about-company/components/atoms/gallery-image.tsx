"use client";

import type { GalleryImage as GalleryImageType } from "../../lib/types";

import Image from "next/image";

interface GalleryImageProps {
    image: GalleryImageType;
    onClick?: () => void;
}

export default function GalleryImage({
    image: { src, alt },
    onClick,
}: GalleryImageProps) {
    return (
        <button
            onClick={onClick}
            className="group block overflow-hidden rounded-md border border-[#333] transition hover:border-[#EFA12D]"
        >
            <Image
                src={src}
                alt={alt}
                width={500}
                height={500}
                className="h-auto w-full object-cover transition duration-300 group-hover:scale-[101%]"
            />
        </button>
    );
}
