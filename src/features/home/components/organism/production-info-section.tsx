"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

const productionTabs = [
    {
        id: "production-process",
        label: "Production Process",
        title: "Our Production Process",
        description:
            "We follow a meticulous 9-step production process to ensure the highest quality charcoal products. From raw material selection to final quality control, every step is carefully monitored to deliver premium products that meet international standards.",
        features: [
            "Raw Material Selection",
            "Carbonization Process",
            "Quality Control",
            "Packaging & Distribution",
        ],
        image: "/images/Step1.png",
        href: "/production-info#process",
    },
    {
        id: "moq-payment",
        label: "MOQ & Payment Terms",
        title: "Minimum Order & Payment",
        description:
            "We offer flexible MOQ options and payment terms to accommodate businesses of all sizes. Our transparent pricing and secure payment methods ensure smooth transactions for both domestic and international clients.",
        features: [
            "Flexible MOQ Options",
            "Multiple Payment Methods",
            "Secure Transactions",
            "Competitive Pricing",
        ],
        image: "/images/shipment.png",
        href: "/production-info#payment",
    },
    {
        id: "shipment-terms",
        label: "Shipment Terms",
        title: "Global Shipping Solutions",
        description:
            "We partner with leading international shipping companies to ensure safe and timely delivery worldwide. Our experienced logistics team handles all documentation and customs clearance for hassle-free shipping.",
        features: [
            "Worldwide Delivery",
            "Multiple Shipping Partners",
            "Full Documentation Support",
            "Customs Clearance Assistance",
        ],
        image: "/images/shipping-pil.png",
        href: "/production-info#shipment",
    },
    {
        id: "packaging-option",
        label: "Packaging Option",
        title: "Flexible Packaging Solutions",
        description:
            "Choose from our range of packaging options designed to meet your specific business needs. From retail-ready full packaging to economical bulk solutions, we provide the right packaging for your market.",
        features: [
            "Full Packaging",
            "Bulk Packaging",
            "Bulk Loose Packaging",
            "Custom Solutions",
        ],
        image: "/images/packaging-full.png",
        href: "/production-info#packaging",
    },
];

export function ProductionInfoSection() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="relative w-full overflow-hidden bg-[#151515] px-5 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
            {/* Section Header */}
            <div className="mb-12 flex flex-col items-center justify-center md:mb-16">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                        Production Information
                    </h2>
                </div>
                <p className="mt-3 max-w-2xl text-center font-['Open_Sans'] text-[14px] text-[#C6C6C6] md:text-[16px]">
                    Everything you need to know about our production, payment,
                    and shipping processes
                </p>
            </div>

            {/* Tab Buttons */}
            <div className="mx-auto mb-8 flex max-w-4xl flex-wrap justify-center gap-3 md:mb-12 md:gap-4">
                {productionTabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(index)}
                        className={`rounded-[30px] border-2 px-6 py-3 font-['Open_Sans'] text-[13px] font-semibold transition-all md:px-8 md:py-3 md:text-[14px] ${
                            activeTab === index
                                ? "border-[#EFA12D] bg-[#EFA12D] text-[#151515]"
                                : "border-[#4F4F4F] bg-transparent text-[#C6C6C6] hover:border-[#EFA12D] hover:text-[#EFA12D]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Left: Image */}
                    <div className="relative overflow-hidden rounded-[20px]">
                        <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
                            <Image
                                src={productionTabs[activeTab].image}
                                alt={productionTabs[activeTab].title}
                                fill
                                className="rounded-[20px] object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex flex-col justify-center space-y-6">
                        <h3 className="font-['Josefin_Sans'] text-[26px] font-bold text-white uppercase md:text-[32px] lg:text-[36px]">
                            {productionTabs[activeTab].title}
                        </h3>
                        <p className="font-['Open_Sans'] text-[15px] leading-relaxed text-[#C6C6C6] md:text-[16px]">
                            {productionTabs[activeTab].description}
                        </p>

                        {/* Features List */}
                        <ul className="space-y-3">
                            {productionTabs[activeTab].features.map(
                                (feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3 font-['Open_Sans'] text-[14px] text-white md:text-[15px]"
                                    >
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#EFA12D]">
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10 3L4.5 8.5L2 6"
                                                    stroke="#151515"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                )
                            )}
                        </ul>

                        {/* Learn More Button */}
                        <Link
                            href={productionTabs[activeTab].href}
                            className="mt-6 inline-flex w-fit items-center gap-2 rounded-[40px] border-2 border-[#EFA12D] bg-transparent px-8 py-3 font-['Open_Sans'] text-[14px] font-semibold text-[#EFA12D] uppercase transition-all hover:bg-[#EFA12D] hover:text-[#151515] md:px-10 md:py-4 md:text-[15px]"
                        >
                            Learn More
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.5 15L12.5 10L7.5 5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
