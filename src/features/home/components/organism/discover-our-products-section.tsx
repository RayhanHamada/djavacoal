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
        image: "/api/placeholder/300/300",
        href: "/our-products/coconut-shell-charcoal",
    },
    {
        id: "barbeque-charcoal",
        name: "Barbeque Charcoal",
        subtitle: "for Grilling",
        description:
            "High-quality barbeque charcoal for grilling, delivering consistent heat and authentic smoky flavor.",
        image: "/api/placeholder/300/300",
        href: "/our-products/barbeque-charcoal",
    },
    {
        id: "sawdust-charcoal",
        name: "Sawdust Charcoal",
        subtitle: "for Cooking",
        description:
            "Eco-friendly sawdust charcoal briquettes, ideal for cooking with excellent heat retention.",
        image: "/api/placeholder/300/300",
        href: "/our-products/sawdust-charcoal",
    },
    {
        id: "natural-wood-charcoal",
        name: "Natural Wood Charcoal",
        subtitle: "for Open Flame",
        description:
            "Pure natural wood charcoal for open flame cooking, sourced from sustainable hardwood.",
        image: "/api/placeholder/300/300",
        href: "/our-products/natural-wood-charcoal",
    },
];

export function DiscoverOurProductSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#151515] px-5 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
            {/* Section Header */}
            <div className="mb-12 flex flex-col items-center justify-center md:mb-16">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                        Discover Our Products
                    </h2>
                </div>
                <p className="mt-3 max-w-2xl text-center font-['Open_Sans'] text-[14px] text-[#C6C6C6] md:text-[16px]">
                    Explore our premium range of charcoal products, each crafted
                    to meet your specific needs
                </p>
            </div>

            {/* Product Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-gradient-radial relative overflow-hidden rounded-[20px] border border-[#4F4F4F] from-[#151515] to-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] md:p-8"
                    >
                        {/* Product Image */}
                        <div className="relative mb-6 flex h-[200px] items-center justify-center overflow-hidden rounded-[15px] bg-[#1D1D1D] md:h-[250px]">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-['Josefin_Sans'] text-[20px] font-bold text-white uppercase md:text-[24px]">
                                    {product.name}
                                </h3>
                                <p className="font-['Open_Sans'] text-[14px] text-[#EFA12D] uppercase md:text-[16px]">
                                    {product.subtitle}
                                </p>
                            </div>
                            <p className="font-['Open_Sans'] text-[14px] leading-relaxed text-[#C6C6C6] md:text-[15px]">
                                {product.description}
                            </p>

                            {/* CTA Button */}
                            <Link
                                href={product.href}
                                className="mt-4 inline-flex items-center gap-2 font-['Open_Sans'] text-[14px] font-semibold text-[#EFA12D] uppercase transition-all hover:gap-3 md:text-[15px]"
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
            <div className="mt-12 flex justify-center md:mt-16">
                <Link
                    href="/our-products"
                    className="rounded-[40px] border-2 border-[#EFA12D] bg-transparent px-8 py-3 font-['Open_Sans'] text-[14px] font-semibold text-[#EFA12D] uppercase transition-all hover:bg-[#EFA12D] hover:text-[#151515] md:px-10 md:py-4 md:text-[16px]"
                >
                    View All Products
                </Link>
            </div>
        </section>
    );
}
