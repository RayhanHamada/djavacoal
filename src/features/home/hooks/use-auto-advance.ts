import { useEffect, useState } from "react";

interface UseAutoAdvanceOptions {
    /** Total number of slides */
    totalSlides: number;
    /** Interval in milliseconds */
    interval: number;
    /** Whether auto-advance is enabled */
    enabled?: boolean;
}

interface UseAutoAdvanceReturn {
    /** Current slide index */
    currentSlide: number;
    /** Set current slide */
    setCurrentSlide: (index: number) => void;
}

/**
 * Custom hook for auto-advancing carousel slides
 */
export function useAutoAdvance({
    totalSlides,
    interval,
    enabled = true,
}: UseAutoAdvanceOptions): UseAutoAdvanceReturn {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!enabled || !totalSlides) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, interval);

        return () => clearInterval(timer);
    }, [totalSlides, interval, enabled]);

    return {
        currentSlide,
        setCurrentSlide,
    };
}
