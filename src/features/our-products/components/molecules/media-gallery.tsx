"use client";
import { useState } from "react";

import Image from "next/image";

import { Play } from "lucide-react";

import { ImageModal, YouTubeModal } from "../atoms";

interface MediaItem {
    id: number;
    type: "image" | "youtube";
    image_url?: string;
    youtube_url?: string;
    custom_thumbnail_url?: string;
}

interface MediaGalleryProps {
    medias: MediaItem[];
}

/**
 * MediaGallery component displays product media (images and YouTube videos)
 * - For images: Shows image, opens in modal on click
 * - For YouTube videos: Shows thumbnail (custom or default), opens video modal on click
 */
export function MediaGallery({ medias }: MediaGalleryProps) {
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
    const [selectedYoutubeUrl, setSelectedYoutubeUrl] = useState<string>("");

    if (!medias || medias.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-lg bg-gray-800">
                <p className="text-gray-400">No media available</p>
            </div>
        );
    }

    const handleImageClick = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
        setImageModalOpen(true);
    };

    const handleYoutubeClick = (youtubeUrl: string) => {
        setSelectedYoutubeUrl(youtubeUrl);
        setYoutubeModalOpen(true);
    };

    // Helper function to get YouTube thumbnail URL
    const getYouTubeThumbnail = (youtubeUrl: string): string => {
        try {
            const url = new URL(youtubeUrl);
            let videoId = "";

            if (url.hostname.includes("youtube.com")) {
                videoId = url.searchParams.get("v") || "";
            } else if (url.hostname.includes("youtu.be")) {
                videoId = url.pathname.slice(1);
            }

            return videoId
                ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                : "/images/placeholder.png";
        } catch {
            return "/images/placeholder.png";
        }
    };

    return (
        <div className="mx-auto flex w-full min-w-[110px] flex-col space-y-4 sm:max-w-sm sm:space-y-5 xl:space-y-6 2xl:space-y-8">
            {medias.map((media) => {
                if (media.type === "image" && media.image_url) {
                    return (
                        <div
                            key={media.id}
                            className="group relative flex aspect-square cursor-pointer overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-[#EFA12D] sm:rounded-xl"
                            onClick={() => handleImageClick(media.image_url!)}
                        >
                            <Image
                                src={media.image_url}
                                alt={`Product media ${media.id}`}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/20" />
                        </div>
                    );
                }

                if (media.type === "youtube" && media.youtube_url) {
                    const thumbnailUrl =
                        media.custom_thumbnail_url ||
                        getYouTubeThumbnail(media.youtube_url);

                    return (
                        <div
                            key={media.id}
                            className="group relative flex aspect-square cursor-pointer overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-[#EFA12D] sm:rounded-xl"
                            onClick={() =>
                                handleYoutubeClick(media.youtube_url!)
                            }
                        >
                            <Image
                                src={thumbnailUrl}
                                alt={`Video thumbnail ${media.id}`}
                                fill
                                className="object-cover"
                            />

                            {/* Djavacoal Logo Watermark */}
                            <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 justify-center sm:top-4 md:top-6">
                                <Image
                                    src="/images/logo.png"
                                    alt="Djavacoal Logo"
                                    width={150}
                                    height={60}
                                    className="h-auto w-20 object-contain opacity-90 sm:w-24 md:w-32 lg:w-36"
                                />
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFA12D] backdrop-blur-sm transition-transform group-hover:scale-110 sm:h-14 sm:w-14 md:h-16 md:w-16">
                                    <Play className="ml-0.5 h-6 w-6 fill-white text-white sm:h-7 sm:w-7 md:ml-1 md:h-8 md:w-8" />
                                </div>
                            </div>
                        </div>
                    );
                }

                return null;
            })}

            {/* Modals */}
            <ImageModal
                isOpen={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                imageUrl={selectedImageUrl}
            />

            <YouTubeModal
                isOpen={youtubeModalOpen}
                onClose={() => setYoutubeModalOpen(false)}
                youtubeUrl={selectedYoutubeUrl}
            />
        </div>
    );
}
