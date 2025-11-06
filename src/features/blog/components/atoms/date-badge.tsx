import { cn } from "@/lib/utils";

interface DateBadgeProps {
    date: string;
    className?: string;
}

export function DateBadge({ date, className }: DateBadgeProps) {
    return (
        <div
            className={cn(
                "text-base leading-[1.875em] font-normal text-white",
                className
            )}
        >
            {date}
        </div>
    );
}
