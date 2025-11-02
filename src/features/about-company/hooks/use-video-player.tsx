"use client";

import { useState } from "react";

interface UseVideoPlayerReturn {
    isPlaying: boolean;
    play: () => void;
    pause: () => void;
    toggle: () => void;
}

export default function useVideoPlayer(
    initialPlaying = false
): UseVideoPlayerReturn {
    const [isPlaying, setIsPlaying] = useState(initialPlaying);

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);
    const toggle = () => setIsPlaying((prev) => !prev);

    return { isPlaying, play, pause, toggle };
}
