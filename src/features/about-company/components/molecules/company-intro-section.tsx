"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion"; // ⬅️ Tambahan animasi
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function CompanyIntroSection() {
    const [playVideo, setPlayVideo] = useState(false);

    // ✅ Urutan bendera mengikuti gambar Figma (22 negara total)
    const countries = [
        "SA",
        "LB",
        "IR",
        "IQ",
        "BH",
        "JO",
        "KW",
        "OM",
        "YE",
        "TR",
        "JP",
        "KR",
        "AU",
        "DE",
        "BE",
        "ES",
        "US",
        "BR",
        "RU",
        "GN",
        "SL",
        "IN",
        "PK",
    ];

    return (
        <section
            id="company-intro"
            className="mt-2 scroll-mt-28 space-y-4 rounded-xl bg-[#222222] p-[20px] lg:p-[40px]"
        >
            {/* === Heading === */}
            <header className="mb-2">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        Production Process
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    How We Craft Quality Charcoal for Global Markets
                </h2>
                <p className="font-medium text-[#EFA12D]">
                    Leading Indonesian Charcoal Manufacturer
                </p>
                <div className="mt-4 h-[1px] bg-[#3A3A3A]" />
            </header>

            {/* === Video Section === */}
            <div className="flex w-full">
                <div className="relative aspect-video w-full max-w-[849px] overflow-hidden rounded-xl">
                    {playVideo ? (
                        <>
                            <iframe
                                className="absolute inset-0 h-full w-full rounded-md"
                                src="https://www.youtube.com/embed/NWO_S1Kh6U0?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0"
                                title="Production Process Coconut Charcoal Briquette From Djavacoal Indonesia"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                loading="lazy"
                            ></iframe>

                            {/* === Watermark Tetap Saat Video Berjalan === */}
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <Image
                                    width={180}
                                    height={180}
                                    src="/svgs/logo.svg"
                                    alt="Djavacoal Logo"
                                    className="opacity-80"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* === Thumbnail === */}
                            <Image
                                width={200}
                                height={200}
                                src="/images/thumbnail-yt.png"
                                alt="Video Thumbnail"
                                className="absolute inset-0 h-full w-full border border-[#EFA12D] object-contain object-cover"
                            />

                            {/* === Overlay Logo + Tombol Play (dengan animasi ringan) === */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Image
                                        width={180}
                                        height={180}
                                        src="/svgs/logo.svg"
                                        alt="Djavacoal Logo"
                                        className="mb-4 opacity-80"
                                    />
                                </motion.div>

                                <motion.button
                                    onClick={() => setPlayVideo(true)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="group absolute flex h-16 w-16 items-center justify-center rounded-full bg-[#EFA12D] shadow-lg transition-all hover:bg-[#ffb84d]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="white"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="none"
                                        className="h-7 w-7 pl-1"
                                    >
                                        <path d="M5 3l14 9-14 9V3z" />
                                    </svg>
                                </motion.button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* === Social Media Links === */}
            <div className="flex space-x-3">
                <Link
                    href="#"
                    className="border-1 bg-transparent p-2 hover:bg-gray-500"
                >
                    <FaFacebookF size={16} />
                </Link>
                <Link
                    href="#"
                    className="border-1 bg-transparent p-2 hover:bg-gray-500"
                >
                    <FaInstagram size={18} />
                </Link>
                <Link
                    href="#"
                    className="border-1 bg-transparent p-2 hover:bg-gray-500"
                >
                    <FaLinkedinIn size={16} />
                </Link>
            </div>

            {/* === Description === */}
            <div className="space-y-4 text-justify leading-relaxed text-gray-200">
                <p>
                    <strong>CV Djavacoal Indonesia</strong> is a trusted
                    supplier and exporter of premium charcoal products,
                    specializing in coconut shell charcoal briquettes, BBQ
                    briquettes, sawdust charcoal briquettes, and natural
                    hardwood charcoal. With years of expertise in the charcoal
                    industry, we are committed to delivering excellence through
                    innovation, strict quality standards, and reliable service.
                </p>
                <p>
                    We operate with three partner factories across Java Island,
                    Indonesia, strategically located with direct access to major
                    international ports in Jakarta, Semarang, and Surabaya. This
                    ensures smooth logistics, competitive shipping costs, and
                    timely delivery for our global partners.
                </p>
                <p>
                    At Djavacoal, quality is our priority. We carefully select
                    only the best raw materials, ensuring every product meets
                    international standards for performance, long-lasting
                    burning time, and eco-friendly characteristics. Through
                    advanced production methods and rigorous quality control, we
                    guarantee consistency and reliability in every shipment.
                </p>
                <p>
                    Beyond supplying charcoal, we proudly serve the
                    international market with OEM and private label services,
                    offering customized briquette shapes, packaging, and
                    branding to fit our clients’ unique needs. Our vision is not
                    only to deliver high-quality products, but also to establish
                    long-term partnerships built on trust, professionalism, and
                    mutual growth.
                </p>
            </div>

            {/* === Company Legal Data === */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Legal Data</h3>

                <div className="overflow-hidden rounded-md border border-[#2A2A2A] text-sm">
                    <table className="w-full border-collapse border border-[#848484] text-sm md:text-base">
                        <tbody>
                            <tr className="border border-[#848484] bg-[#3A3A3A]">
                                <td className="w-44 border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:w-56 md:p-4">
                                    Company Name:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    CV Djavacoal Indonesia
                                </td>
                            </tr>
                            <tr className="border border-[#848484] bg-[#262626]">
                                <td className="border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:p-4">
                                    Owner’s Name:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    Yoga Indra Pradipta N
                                </td>
                            </tr>
                            <tr className="border border-[#848484] bg-[#3A3A3A]">
                                <td className="border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:p-4">
                                    Address:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    Jl. P. Ilir Sari V No. 15, Jawa Barat,
                                    Indonesia
                                </td>
                            </tr>
                            <tr className="border border-[#848484] bg-[#262626]">
                                <td className="border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:p-4">
                                    Established:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    2018
                                </td>
                            </tr>
                            <tr className="border border-[#848484] bg-[#3A3A3A]">
                                <td className="border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:p-4">
                                    Products:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    Charcoal Products
                                </td>
                            </tr>
                            <tr className="border border-[#848484] bg-[#262626]">
                                <td className="border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:p-4">
                                    Production Capacity:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    250 Tons / Month
                                </td>
                            </tr>
                            <tr className="border border-[#848484] bg-[#3A3A3A]">
                                <td className="border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:p-4">
                                    Certification:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    Charcoal Products
                                </td>
                            </tr>
                            <tr className="border border-[#848484] bg-[#262626]">
                                <td className="border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:p-4">
                                    Registered Number:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    NIB – 0220001680488
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* === Export Countries === */}
            <div className="space-y-4 py-4">
                <h3 className="text-lg font-semibold">
                    Countries We Have Exported To
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                    Djavacoal Indonesia has successfully exported premium
                    charcoal products to more than 20 countries across the
                    Middle East, Asia, Europe, Africa, Australia, and the
                    Americas. Our global reach demonstrates the trust
                    international partners place in our quality, reliability,
                    and professionalism. From Saudi Arabia to Brazil, from Japan
                    to the USA, Djavacoal continues to serve the world with the
                    finest Indonesian charcoal.
                </p>

                {/* === Flags Grid (no country name) === */}
                <div className="flex flex-wrap gap-3 rounded-md pt-2">
                    {countries.map((code) => (
                        <div
                            key={code}
                            className="relative aspect-video h-8 overflow-hidden rounded-sm transition-all lg:h-16"
                        >
                            <Image
                                src={`https://flagsapi.com/${code}/flat/64.png`}
                                alt={`${code} flag`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
