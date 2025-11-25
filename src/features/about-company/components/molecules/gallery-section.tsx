"use client";

import type { GalleryType } from "../../lib/types";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import ReelGallery from "./reel-gallery";
import { useGalleryViewer } from "../../hooks";
import { FadeInView, ScaleOnHover, ScaleXView, SlideInView } from "../atoms";
import { useAboutCompanyContentAPI } from "@/features/public-api/hooks";

interface GallerySubsectionProps {
    title: string;
    highlightWord: string;
    galleryType: GalleryType;
    onImageClick: (index: number) => void;
}

function GallerySubsection({
    title,
    highlightWord,
    galleryType,
    onImageClick,
}: GallerySubsectionProps) {
    const t = useTranslations("AboutCompany.gallery");
    const { data: aboutCompanyData } = useAboutCompanyContentAPI();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const factoryGallery = useMemo(
        () => aboutCompanyData?.data.factory_galleries ?? [],
        [aboutCompanyData?.data.factory_galleries]
    );

    const productGallery = useMemo(
        () => aboutCompanyData?.data.product_galleries ?? [],
        [aboutCompanyData?.data.product_galleries]
    );

    const images = galleryType === "factory" ? factoryGallery : productGallery;
    const mainImage = images.at(0);
    const thumbnails = images.slice(1);

    const updateScrollState = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        updateScrollState();
        el.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);

        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [updateScrollState, thumbnails.length]);

    const scroll = useCallback((direction: "left" | "right") => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const scrollAmount = direction === "left" ? -300 : 300;
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }, []);

    return (
        <div className="space-y-4">
            <FadeInView>
                <h3 className="text-lg font-semibold lg:text-2xl">
                    {title}{" "}
                    <span className="text-[#EFA12D]">{highlightWord}</span>{" "}
                    Gallery
                </h3>
            </FadeInView>

            <ScaleOnHover>
                <button
                    onClick={() => onImageClick(0)}
                    className="col-span-full block w-full overflow-hidden"
                >
                    {mainImage && (
                        <Image
                            src={mainImage}
                            alt={mainImage}
                            width={1600}
                            height={900}
                            className="aspect-square rounded-none object-cover"
                        />
                    )}
                </button>
            </ScaleOnHover>

            {thumbnails.length > 0 && (
                <div className="group/slider relative">
                    <div
                        ref={scrollContainerRef}
                        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {thumbnails.map((image, i) => (
                            <button
                                key={`${galleryType}-thumb-${i}-${image}`}
                                onClick={() => onImageClick(i + 1)}
                                className="group h-[180px] min-w-[180px] shrink-0 snap-start overflow-hidden rounded-lg transition-transform duration-300 ease-out will-change-transform lg:h-[220px] lg:min-w-[220px]"
                            >
                                <Image
                                    src={image}
                                    alt={`${galleryType} gallery image ${i + 2}`}
                                    width={220}
                                    height={220}
                                    className="h-full w-full object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.05]"
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("left")}
                        className={`absolute top-1/2 left-2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:bg-[#EFA12D] lg:flex ${
                            canScrollLeft
                                ? "opacity-100"
                                : "pointer-events-none opacity-0"
                        }`}
                        aria-label={t("scrollLeft")}
                        disabled={!canScrollLeft}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className={`absolute top-1/2 right-2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:bg-[#EFA12D] lg:flex ${
                            canScrollRight
                                ? "opacity-100"
                                : "pointer-events-none opacity-0"
                        }`}
                        aria-label={t("scrollRight")}
                        disabled={!canScrollRight}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function GallerySection() {
    const t = useTranslations("AboutCompany.gallery");
    const { data: aboutCompanyData } = useAboutCompanyContentAPI();
    const { viewer, openViewer, closeViewer, nextItem, prevItem } =
        useGalleryViewer();

    const reels = useMemo(
        () => aboutCompanyData?.data.reels ?? [],
        [aboutCompanyData?.data.reels]
    );

    const factoryGallery = useMemo(
        () => aboutCompanyData?.data.factory_galleries ?? [],
        [aboutCompanyData?.data.factory_galleries]
    );

    const productGallery = useMemo(
        () => aboutCompanyData?.data.product_galleries ?? [],
        [aboutCompanyData?.data.product_galleries]
    );

    const currentList = useMemo(() => {
        if (!viewer) return [];
        if (viewer.type === "reel") return reels;
        return viewer.type === "factory" ? factoryGallery : productGallery;
    }, [factoryGallery, productGallery, reels, viewer]);

    const renderModalContent = () => {
        if (!viewer) return null;

        if (viewer.type === "reel") {
            const reel = reels.at(viewer.index);
            if (!reel) return null;

            return (
                <div className="relative aspect-9/16 w-[85vw] max-w-[400px] overflow-hidden rounded-xl">
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${reel.id}?autoplay=1&controls=1&playsinline=1`}
                        className="absolute inset-0 h-full w-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={t("videoReel", { index: viewer.index + 1 })}
                    />
                </div>
            );
        }

        const images =
            viewer.type === "factory" ? factoryGallery : productGallery;
        const currentImage = images.at(viewer.index);
        if (!currentImage) return null;

        return (
            <Image
                src={currentImage}
                alt={currentImage}
                width={1200}
                height={1200}
                className="max-h-[85vh] w-auto object-contain"
            />
        );
    };

    return (
        <section
            id="our-gallery"
            className="mt-10 scroll-mt-28 space-y-6 rounded-xl bg-[#222222] p-5 lg:p-10"
        >
            <header className="mb-[30px]">
                <SlideInView yOffset={30} duration={0.6}>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="h-px w-8 bg-white" />
                        <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                            {t("subtitle")}
                        </p>
                    </div>
                </SlideInView>

                <SlideInView yOffset={30} duration={0.65}>
                    <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                        {t("title")}
                    </h2>
                </SlideInView>

                <SlideInView yOffset={35} duration={0.7}>
                    <p className="font-medium text-[#EFA12D]">{t("tagline")}</p>
                </SlideInView>

                <ScaleXView duration={0.6}>
                    <div className="mt-4 h-px origin-left bg-[#3A3A3A]" />
                </ScaleXView>
            </header>

            <ReelGallery onReelClick={(index) => openViewer("reel", index)} />

            <hr className="hidden border-t border-[#3A3A3A] lg:block" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <GallerySubsection
                    title={t("factoryTitle")}
                    highlightWord={t("factoryHighlight")}
                    galleryType="factory"
                    onImageClick={(index) => openViewer("factory", index)}
                />

                <GallerySubsection
                    title={t("productsTitle")}
                    highlightWord={t("productsHighlight")}
                    galleryType="product"
                    onImageClick={(index) => openViewer("product", index)}
                />
            </div>

            {viewer && (
                <div
                    className="fixed inset-0 z-99999 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
                    onClick={closeViewer}
                >
                    <button
                        className="absolute top-6 right-6 rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                        onClick={closeViewer}
                        aria-label={t("closeViewer")}
                    >
                        ✕
                    </button>

                    <div
                        className="relative flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {renderModalContent()}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevItem(currentList.length);
                            }}
                            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#EFA12D] lg:left-[-85px]"
                            aria-label={t("previousItem")}
                        >
                            <ChevronLeft size={30} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextItem(currentList.length);
                            }}
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#EFA12D] lg:right-[-85px]"
                            aria-label={t("nextItem")}
                        >
                            <ChevronRight size={30} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
