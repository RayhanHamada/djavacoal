"use client";

import type { ReactNode } from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { WATERMARK_IMAGE } from "../../lib/constants";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    children: ReactNode;
}

export default function ImageModal({
    isOpen,
    onClose,
    onNext,
    onPrev,
    children,
}: ImageModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-99999 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                className="absolute top-6 right-6 rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                onClick={onClose}
                aria-label="Close modal"
            >
                ✕
            </button>

            {/* Modal Content Wrapper */}
            <div
                className="relative flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {children}

                {/* Prev Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#EFA12D] lg:left-[-85px]"
                    aria-label="Previous item"
                >
                    <ChevronLeft size={30} />
                </button>

                {/* Next Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#EFA12D] lg:right-[-85px]"
                    aria-label="Next item"
                >
                    <ChevronRight size={30} />
                </button>
            </div>
        </div>
    );
}

interface CertificateLightboxProps {
    isOpen: boolean;
    certificate: { src: string; alt: string } | null;
    onClose: () => void;
}

export function CertificateLightbox({
    isOpen,
    certificate,
    onClose,
}: CertificateLightboxProps) {
    if (!isOpen || !certificate) return null;

    return (
        <motion.div
            className="fixed inset-0 z-999 flex items-start justify-center overflow-y-auto bg-black/80 p-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="relative mx-auto mt-10 max-w-[90vw] rounded-lg bg-white shadow-xl sm:max-w-[70vw] lg:max-w-[30vw]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Certificate Image */}
                <div className="relative w-full">
                    <Image
                        src={certificate.src}
                        alt={certificate.alt}
                        width={1400}
                        height={2000}
                        className="h-auto w-full object-contain"
                        priority
                    />

                    {/* Watermark */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <Image
                            src={WATERMARK_IMAGE}
                            alt="Watermark Djavacoal"
                            width={280}
                            height={280}
                            className="object-contain opacity-40"
                        />
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-5 -right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFA12D] text-xl font-bold text-black shadow-lg transition hover:scale-105"
                    aria-label="Close lightbox"
                >
                    ✕
                </button>
            </motion.div>
        </motion.div>
    );
}
