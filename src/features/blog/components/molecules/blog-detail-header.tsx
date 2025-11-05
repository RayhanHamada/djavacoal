import Image from "next/image";

import { DateBadge } from "../atoms";
import { cn } from "@/lib/utils";

interface BlogDetailHeaderProps {
    title: string;
    date: string;
    author: string;
    imageUrl: string;
    className?: string;
}

export function BlogDetailHeader({
    title,
    date,
    author,
    imageUrl,
    className,
}: BlogDetailHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-5 md:gap-10", className)}>
            <div className="flex flex-col gap-5">
                <h1 className="font-inter text-2xl leading-[1.21em] font-bold text-white md:text-[25px]">
                    {title}
                </h1>
                <div className="flex items-center gap-2">
                    <span className="font-inter text-primary text-base leading-[1.875em] font-normal">
                        {author}
                    </span>
                    <span className="text-white">-</span>
                    <DateBadge date={date} />
                </div>
                <div className="h-px w-full bg-[#474747]" />
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    );
}
