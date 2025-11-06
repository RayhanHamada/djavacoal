"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const packagingOptions = [
    {
        id: "full-packaging",
        optionKey: "full",
        image: "/images/packaging-full.png",
    },
    {
        id: "bulk-packaging",
        optionKey: "bulk",
        image: "/images/packaging-bulk.png",
    },
    {
        id: "bulk-loose-packaging",
        optionKey: "bulkLoose",
        image: "/images/packaging-bulk-loose.png",
    },
];

export function PackagingOptionsSection() {
    const t = useTranslations("Home.packagingOptions");
    return (
        <section className="relative w-full overflow-hidden bg-[url('/images/bg-packaging-option.png')] bg-cover py-16">
            {/* Section Header */}
            <div className="mb-10 flex flex-col items-start justify-center px-[20px] md:px-[40px] lg:px-[240px]">
                <div className="flex items-center gap-3">
                    <div className="h-[2px] w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[26px] font-bold text-white md:text-[34px] lg:text-[40px]">
                        {t("title")}{" "}
                        <span className="text-[#EFA12D]">{t("highlight")}</span>
                    </h2>
                </div>
            </div>

            <div className="flex flex-col items-center gap-16 px-[20px] md:grid md:grid-cols-2 md:px-[40px] lg:flex lg:flex-row lg:justify-center lg:px-[100px]">
                {packagingOptions.map((option) => {
                    const optionKey = `options.${option.optionKey}` as any;
                    const name = t(`${optionKey}.name` as any);
                    const words = name.split(" ");
                    return (
                        <motion.div
                            key={option.id}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.4 }}
                            className="group relative flex h-[371px] w-[371px] flex-col items-center justify-center overflow-hidden rounded-[16px] border border-[#FFFFFF30] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,_#ffffff40_100%)] shadow-[0_0_40px_#00000050] transition-all duration-500 hover:border-[#EFA12D] md:h-[300px] md:w-[300px] lg:h-[384px] lg:w-[560px] lg:rounded-[0px]"
                        >
                            {/* Gambar */}
                            <div className="relative flex h-full w-full items-center justify-center">
                                <Image
                                    src={option.image}
                                    alt={name}
                                    width={600}
                                    height={600}
                                    className="h-full w-full scale-75 object-contain transition-transform duration-700 group-hover:scale-85"
                                />

                                {/* Overlay Radial Putih di Sudut */}
                                <div className="pointer-events-none absolute inset-0" />
                            </div>

                            {/* Teks di atas tengah */}
                            <h3 className="absolute top-5 left-1/2 -translate-x-1/2 font-['Josefin_Sans'] text-[18px] font-semibold text-white md:text-[20px] lg:text-[22px]">
                                <span className="text-[#EFA12D]">
                                    {words[0]}
                                </span>{" "}
                                {words.slice(1).join(" ")}
                            </h3>
                        </motion.div>
                    );
                })}
            </div>

            {/* Tombol View Details */}
            <div className="mt-12 flex justify-center">
                <Link
                    href="/production-info#packaging"
                    className="font-['Open_Sans'] text-[15px] font-semibold text-[#EFA12D] italic underline-offset-4 hover:underline md:text-[16px]"
                >
                    {t("viewDetails")}
                </Link>
            </div>
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#EFA12D]" />
        </section>
    );
}
