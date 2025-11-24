"use client";
import { useState } from "react";

import Image from "next/image";

import { useTranslations } from "next-intl";
import { IoMdArrowDropright } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

type Product = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    products: Product[];
    selectedProductId?: number;
    onProductSelect: (productId: number) => void;
    isBrandSelected?: boolean;
    onBrandSelect: () => void;
};

export default function OurProductsSidebar({
    products,
    selectedProductId,
    onProductSelect,
    isBrandSelected = false,
    onBrandSelect,
}: Props) {
    const t = useTranslations("OurProductsSidebar");
    const [open, setOpen] = useState(false);

    const handleClick = (productId: number) => {
        onProductSelect(productId);
        setOpen(false);
    };

    const handleBrandClick = () => {
        onBrandSelect();
        setOpen(false);
    };

    const selectedProduct = products.find((p) => p.id === selectedProductId);

    return (
        <>
            {/* MOBILE DROPDOWN */}
            <div className="bg-primary flex items-center gap-3 border-b border-[#2a2a2a] px-4 py-3 lg:hidden">
                <div className="text-xl text-[#EFA12D]">
                    <Image
                        src="/svgs/ic_select.svg"
                        alt={t("filterIconAlt")}
                        width={40}
                        height={40}
                    />
                </div>

                <div className="relative w-full">
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex w-full items-center justify-between rounded-sm border border-[#3a3a3a] px-4 py-2 text-sm text-white"
                    >
                        <span className="truncate">
                            {isBrandSelected
                                ? t("djavacoalBrand")
                                : selectedProduct
                                  ? selectedProduct.name
                                  : t("selectProduct")}
                        </span>
                        {open ? (
                            <IoChevronUp className="text-[#EFA12D]" />
                        ) : (
                            <IoChevronDown className="text-[#EFA12D]" />
                        )}
                    </button>

                    {open && (
                        <div className="absolute left-0 mt-1 w-full overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#292D32]">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleClick(product.id)}
                                    className={`block w-full px-4 py-2 text-left text-sm rtl:text-right ${
                                        selectedProductId === product.id
                                            ? "text-[#EFA12D] underline underline-offset-4"
                                            : "text-white hover:text-[#EFA12D]"
                                    }`}
                                >
                                    {product.name}
                                </button>
                            ))}
                            {/* Djavacoal's Brand Menu Item */}
                            <button
                                onClick={handleBrandClick}
                                className={`block w-full px-4 py-2 text-left text-sm rtl:text-right ${
                                    isBrandSelected
                                        ? "text-[#EFA12D] underline underline-offset-4"
                                        : "text-white hover:text-[#EFA12D]"
                                }`}
                            >
                                {t("djavacoalBrand")}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* DESKTOP */}
            <nav className="hidden h-fit w-[260px] border-y border-[#2a2a2a] bg-[#222222] lg:block">
                <div className="scrollbar-none overflow-y-auto">
                    <div className="flex flex-col space-y-[3px]">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#2a2a2a]/60 after:content-[''] last:after:hidden rtl:after:right-0 rtl:after:left-auto"
                            >
                                <button
                                    onClick={() => handleClick(product.id)}
                                    className={`my-2 flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium transition-all duration-200 rtl:text-right ${
                                        selectedProductId === product.id
                                            ? "bg-[#9D7B19] font-semibold text-white"
                                            : "hover:bg-secondary bg-[#222222] text-gray-300 hover:font-bold hover:text-white"
                                    }`}
                                >
                                    <span>{product.name}</span>
                                    <IoMdArrowDropright
                                        size={12}
                                        className={
                                            selectedProductId === product.id
                                                ? "text-white"
                                                : "text-gray-400"
                                        }
                                    />
                                </button>
                            </div>
                        ))}
                        {/* Djavacoal's Brand Menu Item */}
                        <div className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#2a2a2a]/60 after:content-[''] last:after:hidden rtl:after:right-0 rtl:after:left-auto">
                            <button
                                onClick={handleBrandClick}
                                className={`my-2 flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium transition-all duration-200 rtl:text-right ${
                                    isBrandSelected
                                        ? "bg-[#9D7B19] font-semibold text-white"
                                        : "hover:bg-secondary bg-[#222222] text-gray-300 hover:font-bold hover:text-white"
                                }`}
                            >
                                <span>{t("djavacoalBrand")}</span>
                                <IoMdArrowDropright
                                    size={12}
                                    className={
                                        isBrandSelected
                                            ? "text-white"
                                            : "text-gray-400"
                                    }
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
