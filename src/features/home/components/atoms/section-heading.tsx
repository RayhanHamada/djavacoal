import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    variant?: "left" | "center";
    className?: string;
}

export function SectionHeading({
    title,
    subtitle,
    variant = "center",
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-3",
                variant === "center" ? "items-center text-center" : "",
                className
            )}
        >
            {variant === "left" && (
                <div className="flex items-center gap-5">
                    <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-3xl font-bold text-black md:text-4xl lg:text-[36px]">
                        {title}
                    </h2>
                </div>
            )}
            {variant === "center" && (
                <>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                        <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                            {title}
                        </h2>
                    </div>
                    {subtitle && (
                        <p className="mt-3 max-w-2xl text-center font-['Open_Sans'] text-[14px] text-[#C6C6C6] md:text-[16px]">
                            {subtitle}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
