interface ProgressBarProps {
    percentage: number;
    colorFrom: string;
    colorTo: string;
}

export function ProgressBar({
    percentage,
    colorFrom,
    colorTo,
}: ProgressBarProps) {
    return (
        <div className="relative h-3 overflow-hidden rounded-full bg-[#1D1D1D]">
            <div
                className={`h-full bg-gradient-to-r ${colorFrom} ${colorTo} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
