/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";

import { Download, MessageCircle, MapPin, Phone, Mail } from "lucide-react";

import VideoGallerySection from "@/features/our-products/components/atoms/image-carousel";
import ProductDescription from "@/features/our-products/components/molecules/product-description";

export function ProductPage() {
    const [_mobileMenuOpen, _setMobileMenuOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    const productImages = [
        "/api/placeholder/400/400",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
    ];

    const shapes = [
        {
            name: "CUBE",
            sizes: [
                "22x22x22 - (96 pcs/kg)",
                "25x25x25 - (72 pcs/kg)",
                "26x26x26 - (64 pcs/kg)",
                "27x27x27 - (54 pcs/kg)",
                "28x28x28 - (50 pcs/kg)",
            ],
        },
        {
            name: "FLAT",
            sizes: [
                "25x25x17 - (108 pcs/kg)",
                "25x25x15 - (120 pcs/kg)",
                "20x20x20 - (130 pcs/kg)",
            ],
        },
        {
            name: "HEXA",
            sizes: [
                "18x50 - (72 pcs/kg)",
                "25x35 - (96 pcs/kg)",
                "20x42 - (88 pcs/kg)",
            ],
        },
        {
            name: "STICK",
            sizes: [
                "18x50 - (72 pcs/kg)",
                "25x35 - (96 pcs/kg)",
                "25x40 - (66 pcs/kg)",
            ],
        },
    ];

    return (
        <div className="text-h1 min-h-screen bg-gradient-to-b from-gray-900 to-black">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 pt-20 pb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-center text-4xl font-bold lg:text-5xl">
                        Products
                    </h1>
                </div>
            </div>
            <ProductDescription />
            <VideoGallerySection />
            {/* Product Section */}
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-gray-800 p-8">
                            <img
                                src={productImages[selectedImage]}
                                alt="Coconut Shell Charcoal Briquette"
                                className="h-auto max-w-full"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {productImages.slice(1, 5).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx + 1)}
                                    className={`hover:ring-secondary rounded-lg bg-gray-800 p-4 transition hover:ring-2 ${
                                        selectedImage === idx + 1
                                            ? "ring-secondary ring-2"
                                            : ""
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Product view ${idx + 2}`}
                                        className="h-auto w-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-h1 mb-4 text-3xl font-bold lg:text-4xl">
                                <span className="text-secondary">
                                    Coconut Shell
                                </span>{" "}
                                Charcoal Briquette
                            </h2>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <button className="bg-secondary hover:bg-secondary flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-4 font-semibold text-white transition">
                                <Download size={20} />
                                Catalogue
                            </button>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700">
                                <MessageCircle size={20} />
                                Ask More
                            </button>
                        </div>

                        {/* Description */}
                        <div className="rounded-lg bg-gray-800/50 p-6">
                            <h3 className="text-secondary mb-3 text-xl font-semibold">
                                Description:
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-300">
                                Coconut Shell Charcoal Briquette Is An
                                Eco-Friendly, Sustainable Fuel Made From The
                                Natural Byproduct Of Coconut Shells, Known For
                                Its High Calorific Value, Long Burn Time, And
                                Low Ash Content. It Is Ideal For Grilling,
                                Smoking, And Industrial Applications. Our
                                Coconut Shell Charcoal Is Made From Pure Natural
                                Byproduct Without Any Harmful Chemicals, Making
                                It A Preferred Alternative To Traditional Wood
                                Charcoal. Additionally, It&apos;s Produced Using
                                A Renewable Resource, Contributing To
                                Environmental Conservation While Delivering
                                Efficient And Consistent Heat Output, Making It
                                A Popular Choice For Both Domestic And
                                Commercial Use Globally, Especially In The
                                Shisha Market.
                            </p>
                        </div>

                        {/* Specifications */}
                        <div className="rounded-lg bg-gray-800/50 p-6">
                            <h3 className="text-secondary mb-4 text-xl font-semibold">
                                Specification & Lab. Test:
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <img
                                    src="/api/placeholder/300/400"
                                    alt="Diamond Grade Specification"
                                    className="w-full rounded-lg"
                                />
                                <img
                                    src="/api/placeholder/300/400"
                                    alt="Certificate of Analysis"
                                    className="w-full rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shape & Size Section */}
                <div className="mt-12 rounded-lg bg-gray-800/50 p-6 lg:p-8">
                    <h3 className="text-secondary mb-6 text-2xl font-semibold">
                        Shape & Size:
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {shapes.map((shape, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-16 w-16 rounded-lg bg-gray-700"></div>
                                    <h4 className="text-lg font-semibold">
                                        {shape.name}:
                                    </h4>
                                </div>
                                <ul className="space-y-1 text-sm text-gray-300">
                                    {shape.sizes.map((size, sIdx) => (
                                        <li key={sIdx}>{size}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail Information */}
                <div className="mt-12 overflow-hidden rounded-lg bg-gray-800/50">
                    <h3 className="text-secondary p-6 text-2xl font-semibold">
                        Detail Information:
                    </h3>
                    <div className="divide-y divide-gray-700">
                        <div className="grid p-4 transition hover:bg-gray-700/30 sm:grid-cols-3">
                            <span className="font-semibold text-gray-400">
                                MOQ:
                            </span>
                            <span className="sm:col-span-2">
                                20&apos; Container (18 Tons)
                            </span>
                        </div>
                        <div className="grid p-4 transition hover:bg-gray-700/30 sm:grid-cols-3">
                            <span className="font-semibold text-gray-400">
                                Packaging:
                            </span>
                            <span className="text-blue-400 sm:col-span-2">
                                pail / Bulk / Bulk Load
                            </span>
                        </div>
                        <div className="grid p-4 transition hover:bg-gray-700/30 sm:grid-cols-3">
                            <span className="font-semibold text-gray-400">
                                Payment Terms:
                            </span>
                            <span className="text-blue-400 sm:col-span-2">
                                L/C, T/T, (DP)
                            </span>
                        </div>
                        <div className="grid p-4 transition hover:bg-gray-700/30 sm:grid-cols-3">
                            <span className="font-semibold text-gray-400">
                                Shipment Terms:
                            </span>
                            <span className="text-blue-400 sm:col-span-2">
                                Freight On Board (FOB)
                            </span>
                        </div>
                        <div className="grid p-4 transition hover:bg-gray-700/30 sm:grid-cols-3">
                            <span className="font-semibold text-gray-400">
                                Production Capacity:
                            </span>
                            <span className="sm:col-span-2">
                                250 Tons/Month
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 border-t border-gray-800 bg-black">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Company */}
                        <div>
                            <h4 className="text-secondary mb-4 font-semibold">
                                Company
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        CV. Djavacoal Indonesia
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Djavacoal&apos;s Team
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Legal & Certificate
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Our Facilities
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Our Gallery
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Products */}
                        <div>
                            <h4 className="text-secondary mb-4 font-semibold">
                                Products
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Coconut Shell Charcoal Briquette
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Barbeque Charcoal Briquette
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Sawdust Charcoal Briquette
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Natural Wood Charcoal Briquette
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Djavacoal&apos;s Brand
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Link */}
                        <div>
                            <h4 className="text-secondary mb-4 font-semibold">
                                Quick Link
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Production Process
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Shipment Process
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        MDQ & Payment Terms
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        Package & Stock
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-secondary transition"
                                    >
                                        News & Article
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div>
                            <h4 className="text-secondary mb-4 font-semibold">
                                Contact Us
                            </h4>
                            <div className="space-y-3 text-sm text-gray-400">
                                <div className="flex items-start gap-2">
                                    <MapPin
                                        size={16}
                                        className="mt-1 flex-shrink-0"
                                    />
                                    <p>
                                        JI. TABA CICICIUS-INDOMEBU, PADI
                                        BUYUANG, TEUNOM ACEH JAYA, ACEH,
                                        INDONESIA. 23662
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} />
                                    <p>+62 821 2285 9318</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <p>marketing@djavacoal.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                        © Copyright 2025 - CV. Djavacoal Indonesia
                    </div>
                </div>
            </footer>
        </div>
    );
}
