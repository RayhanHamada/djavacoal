"use client";
import { X } from "lucide-react";

interface YouTubeModalProps {
    isOpen: boolean;
    onClose: () => void;
    youtubeUrl: string;
}

/**
 * YouTubeModal component displays a YouTube video in a full-screen modal
 * Converts YouTube URL to embed format with autoplay
 */
export function YouTubeModal({
    isOpen,
    onClose,
    youtubeUrl,
}: YouTubeModalProps) {
    if (!isOpen || !youtubeUrl) return null;

    // Convert YouTube URL to embed format
    const getYouTubeEmbedUrl = (url: string): string => {
        try {
            const urlObj = new URL(url);
            let videoId = "";

            if (urlObj.hostname.includes("youtube.com")) {
                videoId = urlObj.searchParams.get("v") || "";
            } else if (urlObj.hostname.includes("youtu.be")) {
                videoId = urlObj.pathname.slice(1);
            }

            return videoId
                ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
                : "";
        } catch {
            return "";
        }
    };

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
