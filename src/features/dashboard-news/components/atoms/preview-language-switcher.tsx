"use client";

import { cn } from "@/lib/utils";

type PreviewLocale = "en" | "ar";

interface PreviewLanguageSwitcherProps {
    /** Current selected locale */
    locale: PreviewLocale;
    /** Callback when locale changes */
    onLocaleChange: (locale: PreviewLocale) => void;
    /** Additional CSS classes */
    className?: string;
}

/**
 * PreviewLanguageSwitcher - Floating language toggle button for preview pages
 *
 * This component is NOT tied to next-intl, it only manages local preview state.
 * Positioned as a fixed floating button in the bottom-right corner.
 */
export function PreviewLanguageSwitcher({
    locale,
    onLocaleChange,
    className,
}: PreviewLanguageSwitcherProps) {
    const toggleLocale = () => {
        onLocaleChange(locale === "en" ? "ar" : "en");
    };

    return (
        <button
            type="button"
            onClick={toggleLocale}
            className={cn(
                "fixed right-6 bottom-6 z-50",
                "flex h-14 w-14 items-center justify-center",
                "rounded-full bg-[#EFA12D] shadow-lg",
                "text-lg font-bold text-black",
                "transition-all duration-200",
                "hover:scale-110 hover:bg-[#d8922a]",
                "focus:ring-2 focus:ring-[#EFA12D] focus:ring-offset-2 focus:outline-none",
                className
            )}
            aria-label={`Switch to ${locale === "en" ? "Arabic" : "English"}`}
            title={`Switch to ${locale === "en" ? "Arabic" : "English"}`}
        >
            {locale === "en" ? "AR" : "EN"}
        </button>
    );
}
