"use client";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Play } from "lucide-react";

interface VideoThumbnailProps {
    videoSrc: string;
    thumbnailSrc: string;
    onOpenModal: () => void;
}

export function VideoThumbnail({
    videoSrc,
    thumbnailSrc,
    onOpenModal,
}: VideoThumbnailProps) {
    const [isHovering, setIsHovering] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isHovering) {
                videoRef.current
                    .play()
                    .catch((err) => console.log("Play prevented:", err));
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isHovering]);

    return (
        <div
            className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg bg-gray-900"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={onOpenModal}
        >
            {/* Thumbnail */}
            <Image
                src={thumbnailSrc}
                alt="Video thumbnail"
                width={620}
                height={320}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    isHovering ? "opacity-0" : "opacity-100"
                }`}
            />

            {/* Video Preview on Hover */}
            <video
                ref={videoRef}
                src={videoSrc}
                muted
                loop
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    isHovering ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Play Button Overlay */}
            <div
                className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
                    isHovering ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFA12D] transition-transform group-hover:scale-110">
                    <Play className="ml-1 h-8 w-8 fill-white text-white" />
                </div>
            </div>

            {/* Djavacoal Logo Overlay */}
            <div className="absolute top-4 left-4 text-white">
                <Image
                    src="/images/logo.png"
                    alt="Djavacoal Logo"
                    width={120}
                    height={60}
                    className="h-auto w-24 object-contain opacity-80"
                />
            </div>
        </div>
    );
}
