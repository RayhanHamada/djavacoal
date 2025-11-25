"use client";

import { useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { chunkArray } from "../../lib/utils";
import { useHomeContentAPI } from "@/features/public-api/hooks";

interface ProductCardProps {
    id: number;
    slug: string;
    name: string;
    description: string;
    image_url: string;
    isLastMobile?: boolean;
}

function ProductCard({
    image_url,
    isLastMobile,
    name,
    description,
    slug,
}: ProductCardProps) {
    const t = useTranslations("Home.discoverProducts");

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
                    src={image_url}
                    alt={image_url}
                    width={400}
                    height={400}
                    className="h-full w-full scale-90 object-contain transition-transform duration-700 hover:scale-105"
                />
            </div>

            <div className="mt-6 max-w-[415px]">
                <h3 className="line-clamp-2 font-['Josefin_Sans'] text-[15px] font-bold text-white uppercase md:text-[16px]">
                    {name}
                </h3>
                <p
                    className="mt-3 line-clamp-2 font-['Open_Sans'] text-[13px] leading-relaxed text-[#C6C6C6] md:text-[14px]"
                    dangerouslySetInnerHTML={{
                        __html: description,
                    }}
                ></p>
                <Link
                    href={`/our-products#${slug}`}
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
    const { data } = useHomeContentAPI();
    const rows = useMemo(
        () => chunkArray(data?.data.featured_products ?? [], 2),
        [data?.data.featured_products]
    );

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
                                    name={product.name}
                                    image_url={product.image_url}
                                    description={product.description}
                                    slug={product.slug}
                                    id={product.id}
                                    isLastMobile={
                                        rowIndex * 2 + i ===
                                        rows.flat().length - 1
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="hidden lg:block">
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:grid-cols-4">
                    {rows.flat().map((product) => (
                        <div key={product.id}>
                            <ProductCard
                                name={product.name}
                                image_url={product.image_url}
                                description={product.description}
                                slug={product.slug}
                                id={product.id}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 h-px w-full bg-[#EFA12D]" />
        </section>
    );
}
