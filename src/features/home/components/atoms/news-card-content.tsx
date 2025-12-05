"use client";

import { ArrowRight } from "lucide-react";

interface NewsCardContentProps {
    /** Article title */
    title: string;
    /** Publication date as ISO string */
    publishedAt: string;
}

/**
 * NewsCardContent - Content section for news card with date, title, and arrow
 */
export function NewsCardContent({ title, publishedAt }: NewsCardContentProps) {
    const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="bg-primary flex flex-col gap-2 pt-4 pb-2">
            <NewsCardDate date={formattedDate} />
            <div className="flex justify-between">
                <NewsCardTitle title={title} />
                <NewsCardArrow />
            </div>
        </div>
    );
}

interface NewsCardDateProps {
    /** Formatted date string */
    date: string;
}

/**
 * NewsCardDate - Date display for news card
 */
function NewsCardDate({ date }: NewsCardDateProps) {
    return (
        <span className="font-['Open_Sans'] text-[14px] text-[#9C9C9C] md:text-[15px]">
            {date}
        </span>
    );
}

interface NewsCardTitleProps {
    /** Article title */
    title: string;
}

/**
 * NewsCardTitle - Title display for news card
 */
function NewsCardTitle({ title }: NewsCardTitleProps) {
    return (
        <h4 className="font-['Josefin_Sans'] text-[16px] leading-tight font-bold text-white uppercase md:text-[18px]">
            {title}
        </h4>
    );
}

/**
 * NewsCardArrow - Arrow icon for news card
 */
function NewsCardArrow() {
    return (
        <span className="shrink-0 text-[#EFA12D] transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </span>
    );
}
