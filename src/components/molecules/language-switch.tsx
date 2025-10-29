"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Check, ChevronDown, Globe } from "lucide-react";
import { Locale } from "next-intl";

import arLogo from "@/../public/svgs/saudi_arabia_flag.svg";
import ukLogo from "@/../public/svgs/uk_flag.svg";
import { LOCALES } from "@/configs";
import { useAppLocale } from "@/hooks";
import { cn } from "@/lib/utils";

type Variant = "desktop" | "mobile";

type Props = {
    variant?: Variant;
};

export function LanguageSwitch({ variant = "desktop" }: Props) {
    const router = useRouter();
    const { locale, setLocale } = useAppLocale();
    const [isOpen, setIsOpen] = useState(false);

    async function handleChangeLocale(newLocale: Locale) {
        setIsOpen(false);
        try {
            await setLocale(newLocale);
        } catch {
            // TODO: handler error
        }
        router.refresh();
    }

    const locales = [
        { code: LOCALES.EN, label: "English", logo: ukLogo },
        { code: LOCALES.AR, label: "العربية", logo: arLogo },
    ];

    const currentLocale = locales.find((l) => l.code === locale);

    if (variant === "mobile") {
        return (
            <div className="w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex w-full items-center justify-between rounded-lg px-4 py-3",
                        "bg-white/5 transition-colors hover:bg-white/10",
                        "focus:ring-secondary focus:ring-2 focus:outline-none"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Globe size={20} className="text-secondary" />
                        <span className="text-sm font-medium text-white">
                            Language
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image
                            src={currentLocale?.logo ?? ukLogo}
                            alt={currentLocale?.label ?? "English"}
                            width={20}
                            height={20}
                            className="rounded-sm"
                        />
                        <ChevronDown
                            size={16}
                            className={cn(
                                "text-white transition-transform duration-200",
                                isOpen && "rotate-180"
                            )}
                        />
                    </div>
                </button>

                {/* Dropdown Menu */}
                <div
                    className={cn(
                        "mt-2 overflow-hidden transition-all duration-200",
                        isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="space-y-1 rounded-lg bg-white/5 p-2">
                        {locales.map(({ code, label, logo }) => (
                            <button
                                key={code}
                                onClick={() => handleChangeLocale(code)}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-md px-3 py-2",
                                    "transition-colors",
                                    locale === code
                                        ? "bg-secondary/20 text-secondary"
                                        : "text-white/90 hover:bg-white/10"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={logo}
                                        alt={label}
                                        width={20}
                                        height={20}
                                        className="rounded-sm"
                                    />
                                    <span className="text-sm font-medium">
                                        {label}
                                    </span>
                                </div>
                                {locale === code && (
                                    <Check
                                        size={16}
                                        className="text-secondary"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Desktop variant
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2",
                    "bg-white/5 transition-all duration-200",
                    "hover:bg-white/10 hover:shadow-lg",
                    "focus:ring-secondary focus:ring-2 focus:outline-none",
                    isOpen && "bg-white/10 shadow-lg"
                )}
            >
                <Image
                    src={currentLocale?.logo ?? ukLogo}
                    alt={currentLocale?.label ?? "English"}
                    width={20}
                    height={20}
                    className="rounded-sm"
                />
                <span className="text-sm font-medium text-white uppercase">
                    {locale}
                </span>
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-white transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown content */}
                    <div
                        className={cn(
                            "absolute top-full right-0 z-20 mt-2 w-48",
                            "animate-in fade-in slide-in-from-top-2 duration-200",
                            "rounded-lg border border-white/10 bg-[#353535]/95 shadow-2xl backdrop-blur-lg"
                        )}
                    >
                        <div className="p-2">
                            {locales.map(({ code, label, logo }) => (
                                <button
                                    key={code}
                                    onClick={() => handleChangeLocale(code)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-md px-3 py-2",
                                        "transition-all duration-150",
                                        locale === code
                                            ? "bg-secondary text-white"
                                            : "text-white/90 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={logo}
                                            alt={label}
                                            width={20}
                                            height={20}
                                            className="rounded-sm"
                                        />
                                        <span className="text-sm font-medium">
                                            {label}
                                        </span>
                                    </div>
                                    {locale === code && (
                                        <Check
                                            size={16}
                                            className="animate-in zoom-in duration-200"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
