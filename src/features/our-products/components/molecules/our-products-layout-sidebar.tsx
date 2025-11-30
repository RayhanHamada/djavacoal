"use client";

import { useState } from "react";

import Image from "next/image";

import { useTranslations } from "next-intl";

import {
    DropdownItemButton,
    DropdownItemLink,
    DropdownTrigger,
    SidebarNavButton,
    SidebarNavLink,
} from "../atoms";
import {
    useProductsContext,
    DJAVACOAL_BRANDS_PATH,
} from "@/features/our-products/hooks/use-products-context";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Product = {
    id: number;
    name: string;
    slug: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Layout-level sidebar component for product navigation.
 * Renders mobile dropdown on small screens and desktop nav on large screens.
 */
export function OurProductsLayoutSidebar() {
    const t = useTranslations("OurProductsSidebar");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const {
        products,
        selectedProductId,
        handleProductSelect,
        isBrandPage,
        isLoadingProducts,
    } = useProductsContext();

    const selectedProduct = products.find((p) => p.id === selectedProductId);

    const handleProductClick = (productId: number) => {
        handleProductSelect(productId);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    if (isLoadingProducts) {
        return null;
    }

    const displayText = isBrandPage
        ? t("djavacoalBrand")
        : (selectedProduct?.name ?? t("selectProduct"));

    return (
        <>
            <MobileDropdown
                products={products}
                selectedProductId={selectedProductId}
                isBrandPage={isBrandPage}
                isOpen={isDropdownOpen}
                displayText={displayText}
                filterIconAlt={t("filterIconAlt")}
                brandLabel={t("djavacoalBrand")}
                onToggle={toggleDropdown}
                onProductSelect={handleProductClick}
            />

            <DesktopNav
                products={products}
                selectedProductId={selectedProductId}
                isBrandPage={isBrandPage}
                brandLabel={t("djavacoalBrand")}
                onProductSelect={handleProductClick}
            />
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Dropdown Molecule
// ─────────────────────────────────────────────────────────────────────────────

interface MobileDropdownProps {
    products: Product[];
    selectedProductId: number | undefined;
    isBrandPage: boolean;
    isOpen: boolean;
    displayText: string;
    filterIconAlt: string;
    brandLabel: string;
    onToggle: () => void;
    onProductSelect: (id: number) => void;
}

function MobileDropdown({
    products,
    selectedProductId,
    isBrandPage,
    isOpen,
    displayText,
    filterIconAlt,
    brandLabel,
    onToggle,
    onProductSelect,
}: MobileDropdownProps) {
    return (
        <div className="bg-primary flex items-center gap-3 border-b border-[#2a2a2a] px-4 py-3 lg:hidden">
            <div className="text-xl text-[#EFA12D]">
                <Image
                    src="/svgs/ic_select.svg"
                    alt={filterIconAlt}
                    width={40}
                    height={40}
                />
            </div>

            <div className="relative w-full">
                <DropdownTrigger
                    label={displayText}
                    isOpen={isOpen}
                    onClick={onToggle}
                />

                {isOpen && (
                    <DropdownMenu
                        products={products}
                        selectedProductId={selectedProductId}
                        isBrandPage={isBrandPage}
                        brandLabel={brandLabel}
                        onProductSelect={onProductSelect}
                    />
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dropdown Menu (part of Mobile)
// ─────────────────────────────────────────────────────────────────────────────

interface DropdownMenuProps {
    products: Product[];
    selectedProductId: number | undefined;
    isBrandPage: boolean;
    brandLabel: string;
    onProductSelect: (id: number) => void;
}

function DropdownMenu({
    products,
    selectedProductId,
    isBrandPage,
    brandLabel,
    onProductSelect,
}: DropdownMenuProps) {
    return (
        <div className="absolute left-0 mt-1 w-full overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#292D32]">
            {products.map((product) => (
                <DropdownItemButton
                    key={product.id}
                    label={product.name}
                    isActive={selectedProductId === product.id && !isBrandPage}
                    onClick={() => onProductSelect(product.id)}
                />
            ))}
            <DropdownItemLink
                href={DJAVACOAL_BRANDS_PATH}
                label={brandLabel}
                isActive={isBrandPage}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop Navigation Molecule
// ─────────────────────────────────────────────────────────────────────────────

interface DesktopNavProps {
    products: Product[];
    selectedProductId: number | undefined;
    isBrandPage: boolean;
    brandLabel: string;
    onProductSelect: (id: number) => void;
}

function DesktopNav({
    products,
    selectedProductId,
    isBrandPage,
    brandLabel,
    onProductSelect,
}: DesktopNavProps) {
    return (
        <nav className="hidden h-fit w-[260px] border-y border-[#2a2a2a] bg-[#222222] lg:block">
            <div className="scrollbar-none overflow-y-auto">
                <div className="flex flex-col space-y-[3px]">
                    {products.map((product) => (
                        <SidebarNavButton
                            key={product.id}
                            label={product.name}
                            isActive={
                                selectedProductId === product.id && !isBrandPage
                            }
                            onClick={() => onProductSelect(product.id)}
                        />
                    ))}
                    <SidebarNavLink
                        href={DJAVACOAL_BRANDS_PATH}
                        label={brandLabel}
                        isActive={isBrandPage}
                    />
                </div>
            </div>
        </nav>
    );
}
