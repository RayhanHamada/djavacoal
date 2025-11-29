import { useCallback, useRef, useState } from "react";

/** Minimum swipe distance (px) to trigger slide change */
const SWIPE_THRESHOLD = 50;

interface UseCarouselDragOptions {
    /** Total number of slides */
    totalSlides: number;
    /** Current active slide index */
    activeSlide: number;
    /** Number of items visible at once */
    itemsPerSlide: number;
    /** Callback when slide changes */
    onSlideChange: (index: number) => void;
}

interface UseCarouselDragReturn {
    /** Ref for the container element */
    containerRef: React.RefObject<HTMLDivElement | null>;
    /** Ref for the track element */
    trackRef: React.RefObject<HTMLDivElement | null>;
    /** Whether currently dragging */
    isDragging: boolean;
    /** Current transform percentage */
    translatePercent: number;
    /** Touch start handler */
    handleTouchStart: (e: React.TouchEvent) => void;
    /** Touch move handler */
    handleTouchMove: (e: React.TouchEvent) => void;
    /** Touch end handler */
    handleTouchEnd: () => void;
    /** Mouse down handler */
    handleMouseDown: (e: React.MouseEvent) => void;
    /** Mouse move handler */
    handleMouseMove: (e: React.MouseEvent) => void;
    /** Mouse up handler */
    handleMouseUp: () => void;
    /** Mouse leave handler */
    handleMouseLeave: () => void;
    /** Keyboard handler */
    handleKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Custom hook for carousel drag/swipe functionality
 * Handles touch, mouse, and keyboard navigation
 */
export function useCarouselDrag({
    totalSlides,
    activeSlide,
    itemsPerSlide,
    onSlideChange,
}: UseCarouselDragOptions): UseCarouselDragReturn {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    // Base transform percentage for current slide
    const baseTranslate = (activeSlide * 100) / itemsPerSlide;

    // Convert pixel drag offset to percentage of container width
    const getOffsetPercent = useCallback(() => {
        if (!containerRef.current || dragOffset === 0) return 0;
        const containerWidth = containerRef.current.offsetWidth;
        return (dragOffset / containerWidth) * 100;
    }, [dragOffset]);

    // Final transform: base position + drag offset
    const translatePercent = baseTranslate - getOffsetPercent();

    // Navigate to slide with bounds checking
    const goToSlide = useCallback(
        (direction: "prev" | "next") => {
            if (direction === "prev" && activeSlide > 0) {
                onSlideChange(activeSlide - 1);
            } else if (direction === "next" && activeSlide < totalSlides - 1) {
                onSlideChange(activeSlide + 1);
            }
        },
        [activeSlide, totalSlides, onSlideChange]
    );

    // Start drag
    const handleDragStart = useCallback((clientX: number) => {
        startXRef.current = clientX;
        setIsDragging(true);
        setDragOffset(0);
    }, []);

    // Update drag offset in real-time
    const handleDragMove = useCallback(
        (clientX: number) => {
            if (!isDragging) return;
            const diff = clientX - startXRef.current;
            setDragOffset(diff);
        },
        [isDragging]
    );

    // End drag and snap to nearest slide
    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;

        const finalOffset = dragOffset;
        setIsDragging(false);
        setDragOffset(0);

        // Determine if we should change slides
        if (Math.abs(finalOffset) > SWIPE_THRESHOLD) {
            goToSlide(finalOffset < 0 ? "next" : "prev");
        }
    }, [isDragging, dragOffset, goToSlide]);

    // Touch handlers
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX),
        [handleDragStart]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX),
        [handleDragMove]
    );

    const handleTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

    // Mouse handlers
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            handleDragStart(e.clientX);
        },
        [handleDragStart]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => handleDragMove(e.clientX),
        [handleDragMove]
    );

    const handleMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);

    const handleMouseLeave = useCallback(() => {
        if (isDragging) handleDragEnd();
    }, [isDragging, handleDragEnd]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToSlide("prev");
            else if (e.key === "ArrowRight") goToSlide("next");
        },
        [goToSlide]
    );

    return {
        containerRef,
        trackRef,
        isDragging,
        translatePercent,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
        handleKeyDown,
    };
}
