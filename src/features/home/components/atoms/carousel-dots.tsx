import { cn } from "@/lib/utils";

interface CarouselDotsProps {
    totalSlides: number;
    currentSlide: number;
    onSlideChange: (index: number) => void;
    className?: string;
}

/**
 * CarouselDots component for navigation between carousel slides
 * Displays clickable dots indicating current position in carousel
 */
export function CarouselDots({
    totalSlides,
    currentSlide,
    onSlideChange,
    className,
}: CarouselDotsProps) {
    return (
        <div
            className={cn("flex items-center justify-center gap-3", className)}
        >
            {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onSlideChange(index)}
                    className={cn(
                        "h-3 w-3 rounded-full transition-all duration-300",
                        index === currentSlide
                            ? "bg-[#EFA12D]"
                            : "bg-[#4F4F4F] hover:bg-[#6F6F6F]"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    );
}
