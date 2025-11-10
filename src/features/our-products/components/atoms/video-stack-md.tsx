"use client";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Play, X } from "lucide-react";

// Component Props Interfaces
interface VideoItem {
    video: string;
    thumbnail: string;
}

interface VideoGallerySectionProps {
    videoData?: {
        gallery: VideoItem[];
    };
}

// Helper function to check if URL is a YouTube video
function isYouTubeUrl(url: string): boolean {
    return url.includes("youtube.com") || url.includes("youtu.be");
}

// Helper function to extract YouTube video ID
function getYouTubeEmbedUrl(url: string): string {
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : url;
}

// Video Modal Component
function VideoModal({
    isOpen,
    onClose,
    videoSrc,
}: {
    isOpen: boolean;
    onClose: () => void;
    videoSrc: string;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isYouTube = isYouTubeUrl(videoSrc);

    useEffect(() => {
        if (isOpen && videoRef.current && !isYouTube) {
            videoRef.current
                .play()
                .catch((err: Error) => console.log("Play prevented:", err));
        }
    }, [isOpen, isYouTube]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6 md:p-8"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-white transition-colors hover:text-orange-500 sm:top-6 sm:right-6"
                aria-label="Close video modal"
            >
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            <div
                className="relative w-full max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-5xl"
                onClick={(e) => e.stopPropagation()}
            >
                {isYouTube ? (
                    <iframe
                        src={getYouTubeEmbedUrl(videoSrc)}
                        className="aspect-video w-full rounded-lg shadow-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        controls
                        autoPlay
                        className="w-full rounded-lg shadow-2xl"
                    />
                )}
            </div>
        </div>
    );
}

// Video Square Component
function VideoSquare({
    item,
    onOpenModal,
}: {
    item: VideoItem;
    onOpenModal: () => void;
}) {
    const [isHovering, setIsHovering] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isHovering) {
                videoRef.current
                    .play()
                    .catch((err: Error) => console.log("Play prevented:", err));
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isHovering]);

    return (
        <div
            className="group relative flex aspect-square flex-1 cursor-pointer overflow-hidden rounded-lg sm:rounded-xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={onOpenModal}
        >
            {/* Thumbnail */}
            <Image
                src={item.thumbnail}
                alt="Video thumbnail"
                fill
                className={`bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff40_100%)] object-cover transition-opacity duration-300 ${
                    isHovering ? "opacity-0" : "opacity-100"
                }`}
            />

            {/* Video Preview on Hover */}
            <video
                ref={videoRef}
                src={item.video}
                muted
                loop
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    isHovering ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Djavacoal Logo Watermark - Responsive sizing */}
            <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 justify-center sm:top-4 md:top-6">
                <Image
                    src="/images/logo.png"
                    alt="Djavacoal Logo"
                    width={150}
                    height={60}
                    className="h-auto w-20 object-contain opacity-90 sm:w-24 md:w-32"
                />
            </div>

            {/* Play Button Overlay - Responsive sizing */}
            <div
                className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
                    isHovering ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110 sm:h-14 sm:w-14 md:h-16 md:w-16">
                    <Play className="ml-0.5 h-6 w-6 fill-white text-white sm:h-7 sm:w-7 md:ml-1 md:h-8 md:w-8" />
                </div>
            </div>
        </div>
    );
}

// Thumbnail Slider Component
function ThumbnailSlider({
    items,
    onItemClick,
}: {
    items: VideoItem[];
    onItemClick: (videoSrc: string) => void;
}) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Check scroll position to show/hide navigation buttons
    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                container.scrollLeft <
                    container.scrollWidth - container.clientWidth - 1
            );
        }
    };

    useEffect(() => {
        checkScroll();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScroll);
            window.addEventListener("resize", checkScroll);
            return () => {
                container.removeEventListener("scroll", checkScroll);
                window.removeEventListener("resize", checkScroll);
            };
        }
    }, [items]);

    const handlePrevious = () => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 160 + 8; // thumbnail width + gap
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 160 + 8; // thumbnail width + gap
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            {canScrollLeft && (
                <button
                    onClick={handlePrevious}
                    className="absolute top-1/2 left-0 z-10 flex h-8 w-8 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-900 shadow-lg transition-all hover:bg-white"
                    aria-label="Previous videos"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            )}

            {/* Thumbnail Grid - Fixed with flex to prevent cramping */}
            <div
                ref={scrollContainerRef}
                className="scrollbar-hide flex gap-2 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="group relative aspect-square min-h-40 min-w-40 shrink-0 cursor-pointer overflow-hidden rounded-lg sm:min-h-[180px] sm:min-w-[180px] sm:rounded-xl"
                        onClick={() => onItemClick(item.video)}
                    >
                        {/* Thumbnail */}
                        <Image
                            src={item.thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff40_100%)] object-cover"
                        />

                        {/* Djavacoal Logo Watermark - Matching main thumbnail style */}
                        <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 justify-center sm:top-4">
                            <Image
                                src="/images/logo.png"
                                alt="Djavacoal Logo"
                                width={150}
                                height={60}
                                className="h-auto w-16 object-contain opacity-90 sm:w-20"
                            />
                        </div>

                        {/* Play Button Overlay - Matching main thumbnail style */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110 sm:h-12 sm:w-12">
                                <Play className="ml-0.5 h-5 w-5 fill-white text-white sm:h-6 sm:w-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {canScrollRight && (
                <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-0 z-10 flex h-8 w-8 translate-x-3 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-900 shadow-lg transition-all hover:bg-white"
                    aria-label="Next videos"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// Main Component
export function VideoGallerySectionMd({
    videoData: propVideoData,
}: VideoGallerySectionProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState("");

    // Sample video data - replace with your actual video sources or use props
    const defaultVideoData: { gallery: VideoItem[] } = {
        gallery: [
            {
                video: "/videos/product-1.mp4",
                thumbnail: "/images/product-hero-image-new.png",
            },
            {
                video: "/videos/product-2.mp4",
                thumbnail: "/images/product-hero-image-new.png",
            },
            {
                video: "/videos/product-3.mp4",
                thumbnail: "/images/product-hero-image-new.png",
            },
            {
                video: "/videos/product-4.mp4",
                thumbnail: "/images/product-hero-image-new.png",
            },
            {
                video: "/videos/product-5.mp4",
                thumbnail: "/images/product-hero-image-new.png",
            },
        ],
    };

    const videoData = propVideoData || defaultVideoData;

    const handleOpenModal = (videoSrc: string) => {
        setCurrentVideo(videoSrc);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentVideo("");
    };

    return (
        <div className="flex w-full">
            <div className="mx-auto px-0">
                {/* Mobile/Tablet Layout - Grid with main video and thumbnails */}
                <div className="mx-auto w-full">
                    {/* Main Large Video */}
                    {videoData.gallery.length > 0 && (
                        <div className="mx-auto mb-4 w-full">
                            <VideoSquare
                                item={videoData.gallery[0]}
                                onOpenModal={() =>
                                    handleOpenModal(videoData.gallery[0].video)
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Thumbnail Slider - Allow overflow */}
                <ThumbnailSlider
                    items={videoData.gallery.slice(1)}
                    onItemClick={handleOpenModal}
                />
            </div>

            {/* Video Modal */}
            <VideoModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                videoSrc={currentVideo}
            />
        </div>
    );
}
