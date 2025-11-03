"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

export function BannerSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        "/images/hero-carousel-1.png",
        "/images/hero-carousel-2.png",
        "/images/hero-carousel-3.png",
        "/images/hero-carousel-4.png",
        "/images/hero-carousel-5.png",
    ];

    // ✅ Auto-slide setiap 8 detik
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section className="relative h-[800px] w-full overflow-hidden bg-[#161616]">
            {/* ✅ Image Carousel */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <Image
                            src={slide}
                            alt={`Hero slide ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
            </div>

            {/* ✅ Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-10 px-5 text-center md:px-20 lg:px-32">
                <h1 className="max-w-[700px] font-['Josefin_Sans'] text-[25px] leading-[1.4em] font-semibold text-white md:text-[36px] lg:text-[42px] lg:leading-[1.1em]">
                    Power Your Flame with{" "}
                    <span className="text-[#EFA12D]">Djavacoal Indonesia</span>:
                    The Ultimate Solution for Clean Energy
                </h1>

                {/* ✅ Buttons (tetap satu baris & responsif) */}
                <div className="flex w-full max-w-[480px] flex-col gap-3 sm:flex-row sm:justify-center sm:gap-5">
                    <Link
                        href="/about-us"
                        className="flex flex-1 items-center justify-center rounded-[40px] border border-white bg-black/40 px-8 py-4 font-['Josefin_Sans'] text-[15px] font-bold whitespace-nowrap text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 sm:text-[16px] md:px-10 md:py-5"
                    >
                        About Us
                    </Link>
                    <Link
                        href="/our-products"
                        className="flex flex-1 items-center justify-center rounded-[40px] border border-[#EFA12D] bg-black/40 px-8 py-4 font-['Josefin_Sans'] text-[15px] font-bold whitespace-nowrap text-[#EFA12D] backdrop-blur-sm transition-all duration-300 hover:bg-black/60 sm:text-[16px] md:px-10 md:py-5"
                    >
                        Discover Our Products
                    </Link>
                </div>
            </div>

            {/* ✅ Carousel Dots di bawah tengah */}
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-5 md:bottom-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-[14px] w-[14px] rounded-full border transition-all duration-300 ${
                            index === currentSlide
                                ? "border-[#EFA12D] bg-[#EFA12D]"
                                : "border-[#EFA12D] bg-transparent hover:bg-[#EFA12D]/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
