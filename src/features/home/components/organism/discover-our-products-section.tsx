"use client";

import type { Product } from "../../lib/types";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { PRODUCTS } from "../../lib/constants";
import { chunkArray } from "../../lib/utils";

interface ProductCardProps {
    product: Product;
    isLastMobile?: boolean;
}

function ProductCard({ product, isLastMobile }: ProductCardProps) {
    const t = useTranslations("Home.discoverProducts");
    const productKey = `products.${product.productKey}` as any;

    return (
        <motion.article
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 flex w-full flex-col items-center pb-8 text-center md:pb-0 ${!isLastMobile ? "border-b border-[#9C9C9C] md:border-0" : ""}`}
        >
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[22px] border border-[#FFFFFF25] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff30_100%)] shadow-[0_0_30px_#00000040] transition-all duration-500 hover:border-[#EFA12D]/80 hover:shadow-[0_0_30px_#EFA12D40]">
                <Image
                    src="/images/logo.png"
                    alt={t("logoAlt")}
                    width={150}
                    height={40}
                    className="absolute top-5 left-1/2 z-999 -translate-x-1/2 scale-60 opacity-90"
                />
                <Image
                    src={product.image}
                    alt={`${t(`${productKey}.highlight` as any)} ${t(`${productKey}.title` as any)}`}
                    width={400}
                    height={400}
                    className="h-full w-full scale-90 object-contain transition-transform duration-700 hover:scale-105"
                />
            </div>

            <div className="mt-6 max-w-[415px]">
                <h3 className="font-['Josefin_Sans'] text-[15px] font-bold text-white uppercase md:text-[16px]">
                    <span className="text-[#EFA12D]">
                        {t(`${productKey}.highlight` as any)}
                    </span>{" "}
                    {t(`${productKey}.title` as any)}
                </h3>
                <p className="mt-3 font-['Open_Sans'] text-[13px] leading-relaxed text-[#C6C6C6] md:text-[14px]">
                    {t(`${productKey}.description` as any)}
                </p>
                <Link
                    href={product.href}
                    className="mt-3 inline-block font-['Open_Sans'] text-[13px] font-semibold text-[#1E90FF] hover:underline md:text-[14px]"
                >
                    {t("detailProducts")}
                </Link>
            </div>
        </motion.article>
    );
}

export function DiscoverOurProductSection() {
    const t = useTranslations("Home.discoverProducts");
    const rows = chunkArray(PRODUCTS, 2);

    return (
        <section className="relative w-full overflow-hidden bg-[#0D0D0D] px-5 py-16 md:px-10 md:py-12 lg:px-[100px] lg:py-16">
            <div className="absolute top-0 left-0 h-px w-full bg-[#EFA12D]" />

            <div className="md:border-b md:border-[#9C9C9C] md:pb-8 md:text-center lg:border-none">
                <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                    {t("title")}{" "}
                    <span className="text-[#EFA12D]">{t("highlight")}</span>
                </h2>
            </div>

            <div className="lg:hidden">
                {rows.map((row, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        className={`grid grid-cols-1 gap-y-14 px-0 py-8 md:grid-cols-2 md:gap-x-10 md:gap-y-16 ${rowIndex !== rows.length - 1 ? "md:border-b md:border-[#9C9C9C]" : ""}`}
                    >
                        {row.map((product, i) => (
                            <div
                                key={product.id}
                                className="flex justify-center"
                            >
                                <ProductCard
                                    product={product}
                                    isLastMobile={
                                        rowIndex * 2 + i === PRODUCTS.length - 1
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="hidden lg:block">
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:grid-cols-4">
                    {PRODUCTS.map((product) => (
                        <div key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 h-px w-full bg-[#EFA12D]" />
        </section>
    );
}
