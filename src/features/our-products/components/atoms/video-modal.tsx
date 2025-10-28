"use client";
import { useEffect, useRef } from "react";

import { X } from "lucide-react";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoSrc: string;
}

export function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current
                .play()
                .catch((err) => console.log("Play prevented:", err));
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
