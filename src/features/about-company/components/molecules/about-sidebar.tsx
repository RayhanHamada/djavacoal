"use client";

import { useState } from "react";

import Image from "next/image";

import { IoMdArrowDropright } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

import { useScrollSpy } from "../../hooks";
import { SIDEBAR_ITEMS } from "../../lib/constants";

interface AboutSidebarProps {
    idPrefix?: string;
}

export default function AboutSidebar({ idPrefix = "" }: AboutSidebarProps) {
    const { activeId, scrollToSection } = useScrollSpy({
        items: SIDEBAR_ITEMS,
        idPrefix,
    });

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleClick = (id: string) => {
        scrollToSection(idPrefix + id);
        setIsMobileOpen(false);
    };

    const activeLabel = activeId
        ? SIDEBAR_ITEMS.find((i) => i.id === activeId)?.label
        : "Select Section";

    return (
        <>
            {/* Mobile Dropdown */}
            <div className="bg-primary sticky top-0 z-40 flex items-center gap-3 border-b border-[#2a2a2a] py-3 lg:hidden">
                <div className="text-xl text-[#EFA12D]">
                    <Image
                        src="/svgs/ic_select.svg"
                        alt="Filter Icon"
                        width={40}
                        height={40}
                    />
                </div>
                <div className="relative w-full">
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="flex w-full items-center justify-between rounded-sm border border-[#3a3a3a] px-4 py-2 text-sm text-white"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileOpen}
                    >
                        <span className="truncate">{activeLabel}</span>
                        {isMobileOpen ? (
                            <IoChevronUp className="text-[#EFA12D]" />
                        ) : (
                            <IoChevronDown className="text-[#EFA12D]" />
                        )}
                    </button>

                    {isMobileOpen && (
                        <div className="absolute left-0 mt-1 w-full overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#292D32]">
                            {SIDEBAR_ITEMS.map(({ id, label }) => (
                                <button
                                    key={id}
                                    onClick={() => handleClick(id)}
                                    className={`block w-full px-4 py-2 text-left text-sm ${
                                        activeId === id
                                            ? "text-[#EFA12D] underline underline-offset-4"
                                            : "text-white hover:text-[#EFA12D]"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <nav className="sticky top-28 hidden h-fit w-[260px] self-start border-y border-[#2a2a2a] bg-[#222222] lg:block">
                <div className="scrollbar-none max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="flex flex-col space-y-[3px]">
                        {SIDEBAR_ITEMS.map(({ id, label }) => (
                            <div
                                key={id}
                                className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#2a2a2a]/60 after:content-[''] last:after:hidden"
                            >
                                <button
                                    onClick={() => handleClick(id)}
                                    className={`my-2 flex w-full items-center justify-between px-5 py-4 text-sm font-medium transition-all duration-200 ${
                                        activeId === id
                                            ? "bg-[#9D7B19] font-semibold text-white"
                                            : "bg-[#222222] text-gray-300 hover:bg-[#3B5952] hover:font-bold hover:text-white"
                                    }`}
                                    aria-label={`Navigate to ${label}`}
                                    aria-current={
                                        activeId === id ? "true" : undefined
                                    }
                                >
                                    <span>{label}</span>
                                    <IoMdArrowDropright
                                        size={12}
                                        className={
                                            activeId === id
                                                ? "text-white"
                                                : "text-gray-400"
                                        }
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    );
}
