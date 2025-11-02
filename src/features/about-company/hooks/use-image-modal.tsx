"use client";

import type { GalleryType, GalleryViewerState } from "../lib/types";

import { useEffect, useState } from "react";

interface UseImageModalReturn<T = unknown> {
    isOpen: boolean;
    currentItem: T | null;
    currentIndex: number;
    open: (item: T, index: number) => void;
    close: () => void;
    next: (items: T[]) => void;
    prev: (items: T[]) => void;
}

export default function useImageModal<T = unknown>(): UseImageModalReturn<T> {
    const [isOpen, setIsOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<T | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const open = (item: T, index: number) => {
        setCurrentItem(item);
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = "hidden";
    };

    const close = () => {
        setIsOpen(false);
        setCurrentItem(null);
        document.body.style.overflow = "auto";
    };

    const next = (items: T[]) => {
        const nextIndex = (currentIndex + 1) % items.length;
        setCurrentIndex(nextIndex);
        setCurrentItem(items[nextIndex]);
    };

    const prev = (items: T[]) => {
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        setCurrentIndex(prevIndex);
        setCurrentItem(items[prevIndex]);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return { isOpen, currentItem, currentIndex, open, close, next, prev };
}

// Specialized hook for gallery viewer with type support
export function useGalleryViewer() {
    const [viewer, setViewer] = useState<GalleryViewerState | null>(null);

    const openViewer = (type: GalleryType, index: number) => {
        setViewer({ type, index });
        document.body.style.overflow = "hidden";
    };

    const closeViewer = () => {
        setViewer(null);
        document.body.style.overflow = "auto";
    };

    const nextItem = (listLength: number) => {
        if (!viewer) return;
        setViewer({
            ...viewer,
            index: (viewer.index + 1) % listLength,
        });
    };

    const prevItem = (listLength: number) => {
        if (!viewer) return;
        setViewer({
            ...viewer,
            index: (viewer.index - 1 + listLength) % listLength,
        });
    };

    useEffect(() => {
        if (!viewer) {
            document.body.style.overflow = "auto";
            return;
        }
        document.body.style.overflow = "hidden";
    }, [viewer]);

    return { viewer, openViewer, closeViewer, nextItem, prevItem };
}
