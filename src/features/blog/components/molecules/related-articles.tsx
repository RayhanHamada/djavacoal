import Image from "next/image";

import { DateBadge } from "../atoms";
import { cn } from "@/lib/utils";

interface RelatedPost {
    id: string;
    title: string;
    date: string;
    imageUrl: string;
}

interface RelatedArticlesProps {
    articles: RelatedPost[];
    title?: string;
    className?: string;
}

export function RelatedArticles({
    articles,
    title = "Newest",
    className,
}: RelatedArticlesProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-5 rounded border border-[#3D3D3D] p-5",
                className
            )}
        >
            <div className="flex items-center gap-2.5">
                <svg
                    width="13"
                    height="24"
                    viewBox="0 0 13 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-secondary flex-shrink-0"
                >
                    <line
                        x1="3"
                        y1="5"
                        x2="3"
                        y2="19"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <line
                        x1="10"
                        y1="5"
                        x2="10"
                        y2="19"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
                <h3 className="font-inter text-xl leading-[1.21em] font-extrabold text-white">
                    {title}
                </h3>
            </div>
            <div className="h-px w-full bg-[#474747]" />
            <div className="flex flex-col gap-10">
                {articles.map((article) => (
                    <div key={article.id} className="flex flex-col gap-[7px]">
                        <div className="relative aspect-[169/169] w-full overflow-hidden">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <DateBadge
                            date={article.date}
                            className="text-primary text-sm"
                        />
                        <h4 className="font-inter text-base leading-[1.21em] font-normal text-white">
                            {article.title}
                        </h4>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center border-t border-[#474747] pt-4">
                <button className="font-inter hover:text-primary text-xl leading-[1.21em] font-bold text-white">
                    More
                </button>
            </div>
        </div>
    );
}
