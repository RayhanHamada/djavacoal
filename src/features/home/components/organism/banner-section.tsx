"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

export function BannerSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        "/images/hero-carousel-1.png",
        "/images/hero-carousel-2.png",
        "/images/hero-carousel-3.png",
        "/images/hero-carousel-4.png",
    ];

    return (
        <section className="bg-primary relative h-[800px] w-full">
            {/* Hero Carousel */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
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
                {/* Dark overlay */}
                <div className="bg-gradient-radial absolute inset-0 from-[#151515] to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-10 px-5 md:px-20 lg:px-32">
                <h1 className="max-w-[650px] text-center font-['Josefin_Sans'] text-[25px] leading-[1.4em] font-semibold text-white md:text-[36px] lg:text-[42px] lg:leading-[1.1em]">
                    Power Your Flame with Djavacoal Indonesia: The Ultimate
                    Solution for Clean Energy
                </h1>

                <div className="flex w-full max-w-[480px] flex-col gap-2.5 md:flex-row">
                    <Link
                        href="/about-us"
                        className="flex flex-1 items-center justify-center rounded-[40px] border border-white bg-black/40 px-8 py-5 font-['Josefin_Sans'] text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    >
                        About Us
                    </Link>
                    <Link
                        href="/our-products"
                        className="flex flex-1 items-center justify-center rounded-[40px] border border-[#EFA12D] bg-black/40 px-8 py-5 text-center font-['Josefin_Sans'] text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    >
                        Discover Our Products
                    </Link>
                </div>

                {/* Carousel Dots */}
                <div className="flex items-center justify-center gap-5">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-[15px] w-[15px] rounded-full border transition-all ${
                                index === currentSlide
                                    ? "border-[#EFA12D] bg-[#EFA12D]"
                                    : "border-[#EFA12D] bg-white/30"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
