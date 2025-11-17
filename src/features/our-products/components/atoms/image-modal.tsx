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
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-white transition-colors hover:text-[#EFA12D] sm:top-6 sm:right-6"
                aria-label="Close image modal"
            >
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            <div
                className="relative max-h-[90vh] w-full max-w-7xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-full w-full">
                    <Image
                        src={imageUrl}
                        alt="Product image"
                        width={1920}
                        height={1080}
                        className="h-auto max-h-[90vh] w-full rounded-lg object-contain shadow-2xl"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
