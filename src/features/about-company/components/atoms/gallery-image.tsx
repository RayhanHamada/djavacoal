"use client";

import Image from "next/image";

type Props = {
    src: string;
    alt: string;
    onClick?: () => void; // ✅ event agar bisa open modal
};

export default function GalleryImage({ src, alt, onClick }: Props) {
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
