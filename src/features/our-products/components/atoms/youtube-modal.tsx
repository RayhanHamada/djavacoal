"use client";
import { X } from "lucide-react";

import { getYouTubeEmbedUrl } from "../../lib/utils";

interface YouTubeModalProps {
    isOpen: boolean;
    onClose: () => void;
    youtubeUrl: string;
}

/**
 * YouTubeModal component displays a YouTube video in a full-screen modal
 * Features:
 * - Full-screen responsive iframe player
 * - Autoplay enabled on open
 * - Click outside or X button to close
 * - Backdrop blur effect
 */
export function YouTubeModal({
    isOpen,
    onClose,
    youtubeUrl,
}: YouTubeModalProps) {
    if (!isOpen || !youtubeUrl) return null;

    const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

    if (!embedUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6 md:p-8"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-white transition-colors hover:text-[#EFA12D] sm:top-6 sm:right-6"
                aria-label="Close video modal"
            >
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            <div
                className="relative w-full max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-5xl"
                onClick={(e) => e.stopPropagation()}
            >
                <iframe
                    src={embedUrl}
                    className="aspect-video w-full rounded-lg shadow-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                />
            </div>
        </div>
    );
}
