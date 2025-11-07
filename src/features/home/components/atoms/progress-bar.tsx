import { cn } from "@/lib/utils";

interface ProgressBarProps {
    percentage: number;
    colorFrom: string;
    colorTo: string;
    className?: string;
}

/**
 * ProgressBar component for displaying percentage-based progress
 * Used in statistics, charts, or any visual progress indicators
 */
export function ProgressBar({
    percentage,
    colorFrom,
    colorTo,
    className,
}: ProgressBarProps) {
    // Clamp percentage between 0 and 100
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

    return (
        <div
            className={cn(
                "relative h-3 overflow-hidden rounded-full bg-[#1D1D1D]",
                className
            )}
        >
            <div
                className={cn(
                    "h-full bg-linear-to-r transition-all duration-1000 ease-out",
                    colorFrom,
                    colorTo
                )}
                style={{ width: `${clampedPercentage}%` }}
                role="progressbar"
                aria-valuenow={clampedPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
}
