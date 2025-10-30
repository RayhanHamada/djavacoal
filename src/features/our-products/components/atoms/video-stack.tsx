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
                className="absolute top-6 right-6 z-10 text-white transition-colors hover:text-orange-500"
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
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={onOpenModal}
        >
            {/* Thumbnail */}
            <Image
                src={item.thumbnail}
                alt="Video thumbnail"
                fill
                className={`object-cover transition-opacity duration-300 ${
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

            {/* Djavacoal Logo Watermark */}
            <div className="absolute top-6 left-1/2 z-10 flex -translate-x-1/2 justify-center">
                <Image
                    src="/images/logo.png"
                    alt="Djavacoal Logo"
                    width={150}
                    height={60}
                    className="h-auto w-38 object-contain opacity-90"
                />
            </div>

            {/* Play Button Overlay */}
            <div
                className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
                    isHovering ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Play className="ml-1 h-8 w-8 fill-white text-white" />
                </div>
            </div>
        </div>
    );
}

// Main Component
export function VideoGallerySection({
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
        <div className="w-full">
            <div className="container mx-auto">
                {/* Stacked Video Squares */}
                <div className="mx-auto max-w-[460px] space-y-8">
                    {videoData.gallery.map((item, index) => (
                        <VideoSquare
                            key={index}
                            item={item}
                            onOpenModal={() => handleOpenModal(item.video)}
                        />
                    ))}
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

// shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] If needed can be added to the main div
