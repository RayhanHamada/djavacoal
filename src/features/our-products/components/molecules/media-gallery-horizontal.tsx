"use client";
import type { MediaItem } from "../../lib/types";

import { useRef, useState } from "react";

import Image from "next/image";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

import { getYouTubeThumbnailUrl } from "../../lib/utils";
import { ImageModal, YouTubeModal } from "../atoms";
import { cn } from "@/lib/utils";

interface MediaGalleryHorizontalProps {
    medias: MediaItem[];
}

/**
 * MediaGalleryHorizontal - Horizontal slider layout for mobile/tablet
 * Used in ProductHeroSection for responsive display
 *
 * Features:
 * - Main large media displayed prominently on top
 * - Horizontal scrollable thumbnail strip below for additional media
 * - Supports both images and YouTube videos with appropriate overlays
 */
export function MediaGalleryHorizontal({
    medias,
}: MediaGalleryHorizontalProps) {
    const t = useTranslations("OurProducts");
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
    const [selectedYoutubeUrl, setSelectedYoutubeUrl] = useState<string>("");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!medias || medias.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-lg bg-gray-800">
                <p className="text-gray-400">{t("noMediaAvailable")}</p>
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

    const renderMediaItem = (media: MediaItem, isMainItem: boolean = false) => {
        const sizeClasses = cn(
            isMainItem
                ? "aspect-square w-full"
                : "aspect-square min-h-40 min-w-40 shrink-0 sm:min-h-[180px] sm:min-w-[180px]"
        );

        if (media.type === "image" && media.image_url) {
            return (
                <div
                    key={media.id}
                    className={`group relative cursor-pointer overflow-hidden rounded-lg sm:rounded-xl ${sizeClasses}`}
                    onClick={() => handleImageClick(media.image_url!)}
                >
                    {/* Djavacoal Logo Watermark */}
                    <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 justify-center sm:top-4 md:top-6">
                        <Image
                            src="/images/logo.png"
                            alt={t("altText.djavacoalLogo")}
                            width={150}
                            height={60}
                            className="h-auto w-20 object-contain opacity-90 sm:w-24 md:w-32 lg:w-36"
                        />
                    </div>
                    <Image
                        src={media.image_url}
                        alt={t("altText.productMedia", {
                            id: media.id,
                        })}
                        fill
                        className="border border-[#FFFFFF25] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff30_100%)] object-cover shadow-[0_0_30px_#00000040]"
                    />
                    {/* Hover overlay for images */}
                    <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/20" />
                </div>
            );
        }

        if (media.type === "youtube" && media.youtube_url) {
            const thumbnailUrl =
                media.custom_thumbnail_url ||
                getYouTubeThumbnailUrl(media.youtube_url);

            return (
                <div
                    key={media.id}
                    className={`group relative cursor-pointer overflow-hidden rounded-lg sm:rounded-xl ${sizeClasses}`}
                    onClick={() => handleYoutubeClick(media.youtube_url!)}
                >
                    <Image
                        src={thumbnailUrl}
                        alt={t("altText.videoThumbnail", {
                            id: media.id,
                        })}
                        fill
                        className="bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff40_100%)] object-cover"
                    />

                    {/* Djavacoal Logo Watermark */}
                    <div
                        className={`absolute ${isMainItem ? "top-3 sm:top-4 md:top-6" : "top-3 sm:top-4"} left-1/2 z-10 flex -translate-x-1/2 justify-center`}
                    >
                        <Image
                            src="/images/logo.png"
                            alt={t("altText.djavacoalLogo")}
                            width={150}
                            height={60}
                            className={`h-auto object-contain opacity-90 ${isMainItem ? "w-20 sm:w-24 md:w-32" : "w-16 sm:w-20"}`}
                        />
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div
                            className={`flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110 ${isMainItem ? "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16" : "h-10 w-10 sm:h-12 sm:w-12"}`}
                        >
                            <Play
                                className={`fill-white text-white ${isMainItem ? "ml-0.5 h-6 w-6 sm:h-7 sm:w-7 md:ml-1 md:h-8 md:w-8" : "ml-0.5 h-5 w-5 sm:h-6 sm:w-6"}`}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    const mainMedia = medias[0];
    const thumbnailMedias = medias.slice(1);

    return (
        <div className="flex w-full justify-center">
            <div className="flex w-full max-w-2xl flex-col items-center px-0">
                {/* Main Large Media */}
                <div className="mb-4 w-full max-w-md md:max-w-lg">
                    {renderMediaItem(mainMedia, true)}
                </div>

                {/* Thumbnail Slider */}
                {thumbnailMedias.length > 0 && (
                    <div className="relative w-full">
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {thumbnailMedias.map((media) =>
                                renderMediaItem(media, false)
                            )}
                        </div>
                    </div>
                )}
            </div>

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
