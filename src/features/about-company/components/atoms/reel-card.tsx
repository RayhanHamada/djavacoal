"use client";

import Image from "next/image";

import { LOGO_IMAGE } from "../../lib/constants";

interface ReelCardProps {
    videoId: string;
    index: number;
    onClick: () => void;
}

export default function ReelCard({ videoId, index, onClick }: ReelCardProps) {
    const getThumbnail = (id: string) =>
        `https://img.youtube.com/vi/${id}/sddefault.jpg`;

    return (
        <button
            onClick={onClick}
            className="group relative aspect-9/16 w-[320px] shrink-0 snap-start overflow-hidden bg-black transition hover:scale-[1.03]"
            aria-label={`Play reel ${index + 1}`}
        >
            {/* Hover Video Preview */}
            <iframe
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1`}
                title={`Reel ${index + 1}`}
            />

            {/* Thumbnail */}
            <Image
                src={getThumbnail(videoId)}
                alt={`Reel ${index + 1}`}
                fill
                className="object-cover transition duration-300 group-hover:opacity-0"
            />

            {/* Logo Watermark */}
            <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 opacity-70">
                <Image
                    src={LOGO_IMAGE}
                    alt="Logo"
                    width={70}
                    height={70}
                    className="drop-shadow-lg"
                />
            </div>

            {/* Play Button Icon */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#202020]/50 shadow-lg">
                    <svg
                        width="20"
                        height="20"
                        fill="white"
                        className="translate-x-0.5"
                    >
                        <path d="M5 4v16l12-8z" />
                    </svg>
                </div>
            </div>
        </button>
    );
}
