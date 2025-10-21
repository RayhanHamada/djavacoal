"use client";
import type { VideoItem } from "../../lib";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Play, X } from "lucide-react";

// Component Props Interfaces
interface VideoThumbnailProps {
    videoSrc: string;
    thumbnailSrc: string;
    onOpenModal: () => void;
}

interface AutoCarouselProps {
    items: VideoItem[];
    onThumbnailClick: (item: VideoItem) => void;
}

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoSrc: string;
}

// Main Video Component
function VideoThumbnail({
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
                    .catch((err: Error) => console.log("Play prevented:", err));
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 transition-transform group-hover:scale-110">
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

// Auto-Sliding Carousel Component
function AutoCarousel({ items, onThumbnailClick }: AutoCarouselProps) {
    const [position, setPosition] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prev) => {
                const newPosition = prev - 1;
                // Reset when we've scrolled one full set
                if (Math.abs(newPosition) >= items.length * 140) {
                    return 0;
                }
                return newPosition;
            });
        }, 30); // Adjust speed here (lower = faster)

        return () => clearInterval(interval);
    }, [items.length]);

    // Duplicate items for infinite scroll effect
    const duplicatedItems = [...items, ...items, ...items];

    return (
        <div className="relative w-full overflow-hidden bg-gray-900/50 py-4">
            <div
                ref={carouselRef}
                className="flex gap-4 transition-transform duration-0"
                style={{ transform: `translateX(${position}px)` }}
            >
                {duplicatedItems.map((item, index) => (
                    <div
                        key={index}
                        className="group h-32 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-800 transition-all hover:ring-2 hover:ring-orange-500"
                        onClick={() => onThumbnailClick(item)}
                    >
                        <div className="relative h-full w-full">
                            <Image
                                src={item.thumbnail}
                                alt={`Thumbnail ${index}`}
                                width={128}
                                height={128}
                                className="h-full w-full object-cover"
                            />
                            {/* Djavacoal Logo on Thumbnail */}
                            <div className="absolute top-2 left-2 text-[8px] font-bold tracking-wider text-white opacity-80">
                                DJAVACOAL
                            </div>
                            {/* Play icon overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFA12D]">
                                    <Play className="ml-1 h-6 w-6 fill-white text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Video Modal Component
function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current
                .play()
                .catch((err: Error) => console.log("Play prevented:", err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 text-white transition-colors hover:text-[#EFA12D]"
                aria-label="Close video modal"
            >
                <X size={32} />
            </button>

            <div
                className="relative mx-4 w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
            >
                <video
                    ref={videoRef}
                    src={videoSrc}
                    controls
                    autoPlay
                    className="w-full rounded-lg shadow-2xl"
                />
            </div>
        </div>
    );
}

// Main Component
export default function VideoGallerySection() {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState("");

    // Sample video data - replace with your actual video sources
    const videoData: { main: VideoItem; carousel: VideoItem[] } = {
        main: {
            video: "/videos/main-product.mp4",
            thumbnail: "/images/logo.png",
        },
        carousel: [
            {
                video: "/videos/product-1.mp4",
                thumbnail: "/images/logo.png",
            },
            {
                video: "/videos/product-2.mp4",
                thumbnail: "/images/logo.png",
            },
            {
                video: "/videos/product-3.mp4",
                thumbnail: "/images/logo.png",
            },
            {
                video: "/videos/product-4.mp4",
                thumbnail: "/images/logo.png",
            },
            {
                video: "/videos/product-5.mp4",
                thumbnail: "/images/logo.png",
            },
            {
                video: "/videos/product-6.mp4",
                thumbnail: "/images/logo.png",
            },
        ],
    };

    const handleOpenModal = (videoSrc: string) => {
        setCurrentVideo(videoSrc);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentVideo("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
            <div className="container mx-auto space-y-8 px-4">
                {/* Main Video Section */}
                <div className="mx-auto max-w-4xl">
                    <VideoThumbnail
                        videoSrc={videoData.main.video}
                        thumbnailSrc={videoData.main.thumbnail}
                        onOpenModal={() =>
                            handleOpenModal(videoData.main.video)
                        }
                    />
                </div>

                {/* Auto-Sliding Carousel */}
                <div className="w-full">
                    <AutoCarousel
                        items={videoData.carousel}
                        onThumbnailClick={(item) => handleOpenModal(item.video)}
                    />
                </div>
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
