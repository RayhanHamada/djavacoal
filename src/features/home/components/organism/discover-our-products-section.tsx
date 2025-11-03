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

// Bagi 2 untuk tampilan tablet
const chunkBy2 = <T,>(arr: T[]) =>
    Array.from({ length: Math.ceil(arr.length / 2) }, (_, i) =>
        arr.slice(i * 2, i * 2 + 2)
    );

function ProductCard({
    product,
    isLastMobile,
}: {
    product: (typeof products)[number];
    isLastMobile?: boolean;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`flex w-full flex-col items-center pb-8 text-center md:pb-0 ${
                !isLastMobile ? "border-b border-[#9C9C9C] md:border-0" : ""
            }`}
        >
            <div className="relative flex aspect-square h-[371px] w-full max-w-[415px] items-center justify-center overflow-hidden rounded-[22px] border border-[#FFFFFF25] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,_#ffffff30_100%)] shadow-[0_0_30px_#00000040] transition-all duration-500 hover:border-[#EFA12D]/80 hover:shadow-[0_0_30px_#EFA12D40] md:h-[334px] lg:h-[415px]">
                <Image
                    src="/images/logo.png"
                    alt="Djavacoal Logo"
                    width={150}
                    height={40}
                    className="absolute top-5 left-1/2 -translate-x-1/2 scale-60 opacity-90"
                />
                <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="h-full w-full scale-90 object-contain transition-transform duration-700 hover:scale-105"
                />
            </div>

            <div className="mt-6 max-w-[415px]">
                <h3 className="font-['Josefin_Sans'] text-[15px] font-bold text-white uppercase md:text-[16px]">
                    <span className="text-[#EFA12D]">{product.highlight}</span>{" "}
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
    );
}

export function DiscoverOurProductSection() {
    const rows = chunkBy2(products);

    return (
        <section className="relative w-full overflow-hidden bg-[#0D0D0D] px-[20px] py-16 md:px-[40px] md:py-12 lg:px-[100px] lg:py-16">
            {/* Garis emas atas */}
            <div className="absolute top-0 left-0 h-[1px] w-full bg-[#EFA12D]" />

            {/* Header */}
            <div className="md:border-b md:border-[#9C9C9C] md:pb-8 md:text-center lg:border-none">
                <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                    Discover Our{" "}
                    <span className="text-[#EFA12D]">Products</span>
                </h2>
            </div>

            {/* MOBILE + TABLET */}
            <div className="lg:hidden">
                {rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`grid grid-cols-1 gap-y-14 px-0 py-8 md:grid-cols-2 md:gap-x-10 md:gap-y-16 ${
                            rowIndex !== rows.length - 1
                                ? "md:border-b md:border-[#9C9C9C]"
                                : ""
                        }`}
                    >
                        {row.map((p, i) => (
                            <div key={p.id} className="flex justify-center">
                                <ProductCard
                                    product={p}
                                    isLastMobile={
                                        rowIndex * 2 + i === products.length - 1
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* DESKTOP */}
            <div className="hidden lg:block">
                <div className="flex flex-nowrap gap-x-4">
                    {products.map((p) => (
                        <div key={p.id} className="">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Garis emas bawah */}
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#EFA12D]" />
        </section>
    );
}
