"use client";
import { useEffect, useState } from "react";

import Image from "next/image";

import { IoMdArrowDropright } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const ITEMS = [
    { id: "process", label: "Production Process" },
    { id: "moq", label: "MOQ & Payment Terms" },
    { id: "shipment", label: "Shipment Terms" },
    { id: "packaging", label: "Packaging Info" },
    { id: "faq", label: "FAQ" },
];

type Props = {
    idPrefix?: string;
};

export default function OurProductsSidebar({ idPrefix = "" }: Props) {
    const [active, setActive] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // pilih root scroll: desktop pakai container khusus, mobile pakai window
        const desktopContainer = document.querySelector<HTMLElement>(
            "#desktop-scroll-container"
        );
        const root = desktopContainer ?? null;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((e) => e.isIntersecting);
                if (visible?.target?.id) {
                    // hilangkan prefix saat setActive agar cocok dengan ITEMS.id
                    const rawId = visible.target.id.replace(idPrefix, "");
                    setActive(rawId);
                }
            },
            {
                threshold: 0.3,
                root: root, // null => window
                rootMargin: "0px 0px -40% 0px",
            }
        );

        ITEMS.forEach(({ id }) => {
            const section = document.getElementById(idPrefix + id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [idPrefix]);

    const handleClick = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;

        // deteksi apakah mode desktop (lg ke atas)
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        const container = document.querySelector<HTMLElement>(
            "#desktop-scroll-container"
        );

        if (isDesktop && container && container.contains(el)) {
            // 💻 Desktop: scroll di dalam container kanan
            const offsetTop = el.offsetTop;
            container.scrollTo({
                top: offsetTop - 20,
                behavior: "smooth",
            });
        } else {
            // 📱 Mobile & Tablet: scroll ke elemen di dalam window normal
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        setActive(id);
        setOpen(false);
    };

    return (
        <>
            {/* MOBILE DROPDOWN */}
            <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-[#2a2a2a] bg-[#161616] py-3 lg:hidden">
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
                        onClick={() => setOpen(!open)}
                        className="flex w-full items-center justify-between rounded-sm border border-[#3a3a3a] px-4 py-2 text-sm text-white"
                    >
                        <span className="truncate">
                            {active
                                ? ITEMS.find((i) => i.id === active)?.label
                                : "Select Topic"}
                        </span>
                        {open ? (
                            <IoChevronUp className="text-[#EFA12D]" />
                        ) : (
                            <IoChevronDown className="text-[#EFA12D]" />
                        )}
                    </button>

                    {open && (
                        <div className="absolute left-0 mt-1 w-full overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#292D32]">
                            {ITEMS.map(({ id, label }) => (
                                <button
                                    key={id}
                                    onClick={() => handleClick(id)}
                                    className={`block w-full px-4 py-2 text-left text-sm ${
                                        active === id
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

            {/* DESKTOP */}
            <nav className="sticky top-[120px] hidden h-fit w-[260px] self-start border-y border-[#2a2a2a] bg-[#222222] lg:block">
                <div className="scrollbar-none max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="flex flex-col space-y-[3px]">
                        {ITEMS.map(({ id, label }) => (
                            <div
                                key={id}
                                className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-[#2a2a2a]/60 after:content-[''] last:after:hidden"
                            >
                                <button
                                    onClick={() => handleClick(id)}
                                    className={`my-2 flex w-full items-center justify-between px-5 py-4 text-sm font-medium transition-all duration-200 ${
                                        active === id
                                            ? "bg-[#9D7B19] font-semibold text-white"
                                            : "bg-[#222222] text-gray-300 hover:bg-[#3B5952] hover:font-bold hover:text-white"
                                    }`}
                                >
                                    <span>{label}</span>
                                    <IoMdArrowDropright
                                        size={12}
                                        className={
                                            active === id
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
