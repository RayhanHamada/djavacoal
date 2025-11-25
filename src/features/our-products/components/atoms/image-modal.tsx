"use client";
import Image from "next/image";

import { X } from "lucide-react";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
}

/**
 * ImageModal component displays an image in a full-screen modal
 * Click outside or on the X button to close
 */
export function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
    if (!isOpen || !imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6 md:p-8"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-7xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-full w-full">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 sm:h-12 sm:w-12 md:top-20"
                        aria-label="Close image modal"
                    >
                        <X className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                    </button>
                    <Image
                        src={imageUrl}
                        alt="Product image"
                        width={1920}
                        height={1080}
                        className="h-auto max-h-[60vh] w-full rounded-lg object-contain shadow-2xl"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
