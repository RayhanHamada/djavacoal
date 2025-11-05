"use client";

import type { SidebarItem } from "../lib/types";

import { useEffect, useState } from "react";

import { SCROLL_SPY_CONFIG } from "../lib/constants";

interface UseScrollSpyOptions {
    items: SidebarItem[];
    idPrefix?: string;
    containerSelector?: string;
}

interface UseScrollSpyReturn {
    activeId: string | null;
    scrollToSection: (id: string) => void;
}

export default function useScrollSpy({
    items,
    idPrefix = "",
    containerSelector = "#desktop-scroll-container",
}: UseScrollSpyOptions): UseScrollSpyReturn {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const desktopContainer =
            document.querySelector<HTMLElement>(containerSelector);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((e) => e.isIntersecting);
                if (visible?.target?.id) {
                    const rawId = visible.target.id.replace(idPrefix, "");
                    setActiveId(rawId);
                }
            },
            {
                threshold: SCROLL_SPY_CONFIG.threshold,
                root: desktopContainer ?? null,
                rootMargin: SCROLL_SPY_CONFIG.rootMargin,
            }
        );

        items.forEach(({ id }) => {
            const section = document.getElementById(idPrefix + id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [idPrefix, items, containerSelector]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;

        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        const container =
            document.querySelector<HTMLElement>(containerSelector);

        if (isDesktop && container && container.contains(el)) {
            container.scrollTo({
                top: el.offsetTop + SCROLL_SPY_CONFIG.scrollOffset,
                behavior: "smooth",
            });
        } else {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        setActiveId(id);
    };

    return { activeId, scrollToSection };
}
