"use client";

import Image from "next/image";
import Link from "next/link";

const products = [
    {
        id: "coconut-shell-charcoal",
        name: "Coconut Shell Charcoal Briquette",
        subtitle: "for Shisha",
        description:
            "Premium coconut shell charcoal briquettes, perfect for shisha with long-lasting burn time and low ash content.",
        image: "/images/ProductsHeader.png", // Temporary - replace with actual product image
        href: "/our-products/coconut-shell-charcoal",
    },
    {
        id: "barbeque-charcoal",
        name: "Barbeque Charcoal",
        subtitle: "for Grilling",
        description:
            "High-quality barbeque charcoal for grilling, delivering consistent heat and authentic smoky flavor.",
        image: "/images/ProductsHeader.png", // Temporary - replace with actual product image
        href: "/our-products/barbeque-charcoal",
    },
    {
        id: "sawdust-charcoal",
        name: "Sawdust Charcoal",
        subtitle: "for Cooking",
        description:
            "Eco-friendly sawdust charcoal briquettes, ideal for cooking with excellent heat retention.",
        image: "/images/ProductsHeader.png", // Temporary - replace with actual product image
        href: "/our-products/sawdust-charcoal",
    },
    {
        id: "natural-wood-charcoal",
        name: "Natural Wood Charcoal",
        subtitle: "for Open Flame",
        description:
            "Pure natural wood charcoal for open flame cooking, sourced from sustainable hardwood.",
        image: "/images/ProductsHeader.png", // Temporary - replace with actual product image
        href: "/our-products/natural-wood-charcoal",
    },
];

export function DiscoverOurProductSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#0D0D0D] px-5 py-20 md:px-10 md:py-24 lg:px-20 lg:py-32">
            {/* Section Header */}
            <div className="mb-14 flex flex-col items-center justify-center md:mb-20">
                <div className="mb-3 flex items-center gap-4">
                    <div className="h-0.5 w-[60px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[30px] font-bold text-white uppercase md:text-[38px] lg:text-[45px]">
                        Discover Our Products
                    </h2>
                </div>
                <p className="mt-4 max-w-2xl text-center font-['Open_Sans'] text-[14px] leading-relaxed text-[#B0B0B0] md:text-[16px]">
                    Explore our premium range of charcoal products, each crafted
                    to meet your specific needs
                </p>
            </div>

            {/* Product Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-gradient-radial relative overflow-hidden rounded-[25px] border-2 border-[#2A2A2A] from-[#0D0D0D] to-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] hover:shadow-xl hover:shadow-[#EFA12D]/10 md:p-10"
                    >
                        {/* Product Image */}
                        <div className="relative mb-8 flex h-[220px] items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] md:h-[280px]">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={350}
                                height={350}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-['Josefin_Sans'] text-[22px] font-bold text-white uppercase md:text-[26px]">
                                    {product.name}
                                </h3>
                                <p className="mt-1 font-['Open_Sans'] text-[14px] text-[#EFA12D] uppercase md:text-[16px]">
                                    {product.subtitle}
                                </p>
                            </div>
                            <p className="font-['Open_Sans'] text-[14px] leading-relaxed text-[#B0B0B0] md:text-[15px]">
                                {product.description}
                            </p>

                            {/* CTA Button */}
                            <Link
                                href={product.href}
                                className="mt-6 inline-flex items-center gap-2 font-['Open_Sans'] text-[14px] font-semibold text-[#EFA12D] uppercase transition-all hover:gap-3 md:text-[15px]"
                            >
                                Detail Products
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="transition-transform group-hover:translate-x-1"
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
                ))}
            </div>

            {/* View All Products Button */}
            <div className="mt-14 flex justify-center md:mt-20">
                <Link
                    href="/our-products"
                    className="rounded-[40px] border-2 border-[#EFA12D] bg-transparent px-10 py-4 font-['Open_Sans'] text-[14px] font-semibold text-[#EFA12D] uppercase transition-all hover:bg-[#EFA12D] hover:text-[#0D0D0D] md:px-12 md:py-5 md:text-[16px]"
                >
                    View All Products
                </Link>
            </div>
        </section>
    );
}
