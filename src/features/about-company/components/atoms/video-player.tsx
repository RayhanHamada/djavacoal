"use client";

import Image from "next/image";

import { motion } from "framer-motion";

import { LOGO_IMAGE, THUMBNAIL_IMAGE } from "../../lib/constants";

interface VideoPlayerProps {
    src: string;
    title?: string;
    isPlaying: boolean;
    onPlay: () => void;
    className?: string;
}

export default function VideoPlayer({
    title = "Company Video",
    isPlaying,
    onPlay,
    className = "",
    src,
}: VideoPlayerProps) {
    return (
        <div
            className={`relative aspect-video w-full max-w-[849px] overflow-hidden rounded-xl border border-[#EFA12D] ${className}`}
        >
            {isPlaying ? (
                <>
                    <iframe
                        className="absolute inset-0 h-full w-full rounded-md"
                        src={src}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        loading="lazy"
                    />

                    {/* Watermark While Playing */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <Image
                            width={180}
                            height={180}
                            src={LOGO_IMAGE}
                            alt="Djavacoal Logo"
                            className="opacity-80"
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* Thumbnail */}
                    <Image
                        width={200}
                        height={200}
                        src={THUMBNAIL_IMAGE}
                        alt="Video Thumbnail"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* Overlay Logo + Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image
                                width={180}
                                height={180}
                                src={LOGO_IMAGE}
                                alt="Djavacoal Logo"
                                className="mb-4 opacity-80"
                            />
                        </motion.div>

                        <motion.button
                            onClick={onPlay}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="group absolute flex h-16 w-16 items-center justify-center rounded-full bg-[#EFA12D] shadow-lg transition-all hover:bg-[#ffb84d]"
                            aria-label="Play video"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="none"
                                className="h-7 w-7 pl-1"
                            >
                                <path d="M5 3l14 9-14 9V3z" />
                            </svg>
                        </motion.button>
                    </div>
                </>
            )}
        </div>
    );
}
