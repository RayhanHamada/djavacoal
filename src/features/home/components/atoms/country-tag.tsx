import { cn } from "@/lib/utils";

interface CountryTagProps {
    name: string;
    className?: string;
}

/**
 * CountryTag component for displaying country names
 * Used in sections showing export destinations or shipping partners
 */
export function CountryTag({ name, className }: CountryTagProps) {
    return (
        <span
            className={cn(
                "inline-block rounded-full border border-[#4F4F4F] bg-[#1D1D1D] px-3 py-1 font-['Open_Sans'] text-[12px] text-[#C6C6C6] md:text-[13px]",
                className
            )}
        >
            {name}
        </span>
    );
}
