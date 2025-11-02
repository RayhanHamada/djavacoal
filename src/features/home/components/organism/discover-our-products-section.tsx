"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

const products = [
    {
        id: "coconut-shell-charcoal",
        highlight: "Coconut Shell",
        title: "Charcoal Briquette",
        description:
            "For Shisha - This charcoal is perfect for high heat and long burn times, offering a clean and sustainable option for shisha lovers. Its natural properties ensure minimal ash production and even heat distribution.",
        image: "/images/prod-coconut.png",
        href: "/our-products/coconut-shell-charcoal",
    },
    {
        id: "barbeque-charcoal",
        highlight: "Barbeque",
        title: "Charcoal",
        description:
            "For Grilling & Industrial Use - Ideal for grilling and industrial purposes, this charcoal is known for its dense structure, providing high heat retention and long-lasting burn, making it a reliable choice for both home and commercial use.",
        image: "/images/prod-bbq.png",
        href: "/our-products/barbeque-charcoal",
    },
    {
        id: "sawdust-charcoal",
        highlight: "Sawdust",
        title: "Charcoal",
        description:
            "For Grilling & Cooking - Best suited for grilling and slow-cooked meals, this charcoal is made from sawdust, ensuring a consistent and controlled burn, imparting a rich, smoky flavor to food while minimizing harmful emissions.",
        image: "/images/prod-sawdust.png",
        href: "/our-products/sawdust-charcoal",
    },
    {
        id: "natural-wood-charcoal",
        highlight: "Natural Wood",
        title: "Charcoal",
        description:
            "For Open Flame Grilling - Made from natural hardwoods, this charcoal is designed for open flame grilling, providing intense heat quickly with minimal ash. It's perfect for achieving that classic char-grilled flavor in a short cooking time.",
        image: "/images/prod-wood.png",
        href: "/our-products/natural-wood-charcoal",
    },
];

export function DiscoverOurProductSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#0D0D0D] px-6 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
            {/* Garis emas atas */}
            <div className="absolute top-0 left-0 h-[1px] w-full bg-[#EFA12D]" />

            {/* Header */}
            <div className="mb-12 text-center">
                <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                    Discover Our{" "}
                    <span className="text-[#EFA12D]">Products</span>
                </h2>
            </div>

            {/* ✅ Layout: Grid for mobile/tablet, flex row for desktop */}
            <div className="mx-auto flex max-w-[1600px] flex-wrap justify-center gap-x-8 gap-y-14 md:gap-x-10 lg:flex-nowrap lg:gap-x-8">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="flex w-[85vw] flex-shrink-0 flex-col items-center text-center md:w-[46%] lg:w-[24%] xl:w-[23%]"
                    >
                        {/* Card */}
                        <div className="relative flex aspect-square h-[371px] w-full max-w-[415px] items-center justify-center overflow-hidden rounded-[22px] border border-[#FFFFFF25] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,_#ffffff30_100%)] shadow-[0_0_30px_#00000040] transition-all duration-500 hover:border-[#EFA12D]/80 hover:shadow-[0_0_30px_#EFA12D40] md:h-[334px] lg:h-[415px]">
                            {/* Watermark */}
                            <Image
                                src="/images/logo.png"
                                alt="Djavacoal Logo"
                                width={150}
                                height={40}
                                className="absolute top-5 left-1/2 -translate-x-1/2 opacity-80"
                            />
                            <Image
                                src={product.image}
                                alt={product.title}
                                width={400}
                                height={400}
                                className="h-full w-full object-contain transition-transform duration-700 hover:scale-105"
                            />
                        </div>

                        {/* Text */}
                        <div className="mt-6 max-w-[415px]">
                            <h3 className="font-['Josefin_Sans'] text-[15px] font-bold text-white uppercase md:text-[16px]">
                                <span className="text-[#EFA12D]">
                                    {product.highlight}
                                </span>{" "}
                                {product.title}
                            </h3>

                            <p className="mt-3 font-['Open_Sans'] text-[13px] leading-relaxed text-[#C6C6C6] md:text-[14px]">
                                {product.description}
                            </p>

                            <Link
                                href={product.href}
                                className="mt-3 inline-block font-['Open_Sans'] text-[13px] font-semibold text-[#1E90FF] hover:underline md:text-[14px]"
                            >
                                Detail Products...
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Garis emas bawah */}
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#EFA12D]" />
        </section>
    );
}
