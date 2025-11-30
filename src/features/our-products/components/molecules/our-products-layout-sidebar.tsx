"use client";

import { useState } from "react";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { DropdownItemLink, DropdownTrigger, SidebarNavLink } from "../atoms";
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
        currentProductId,
        isBrandPage,
        isLoadingProducts,
        getProductUrl,
    } = useProductsContext();

    const selectedProduct = products.find((p) => p.id === currentProductId);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

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
                currentProductId={currentProductId}
                isBrandPage={isBrandPage}
                isOpen={isDropdownOpen}
                displayText={displayText}
                filterIconAlt={t("filterIconAlt")}
                brandLabel={t("djavacoalBrand")}
                onToggle={toggleDropdown}
                onClose={closeDropdown}
                getProductUrl={getProductUrl}
            />

            <DesktopNav
                products={products}
                currentProductId={currentProductId}
                isBrandPage={isBrandPage}
                brandLabel={t("djavacoalBrand")}
                getProductUrl={getProductUrl}
            />
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Dropdown Molecule
// ─────────────────────────────────────────────────────────────────────────────

interface MobileDropdownProps {
    products: Product[];
    currentProductId: number | undefined;
    isBrandPage: boolean;
    isOpen: boolean;
    displayText: string;
    filterIconAlt: string;
    brandLabel: string;
    onToggle: () => void;
    onClose: () => void;
    getProductUrl: (productId: number) => string;
}

function MobileDropdown({
    products,
    currentProductId,
    isBrandPage,
    isOpen,
    displayText,
    filterIconAlt,
    brandLabel,
    onToggle,
    onClose,
    getProductUrl,
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
                        currentProductId={currentProductId}
                        isBrandPage={isBrandPage}
                        brandLabel={brandLabel}
                        getProductUrl={getProductUrl}
                        onItemClick={onClose}
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
    currentProductId: number | undefined;
    isBrandPage: boolean;
    brandLabel: string;
    getProductUrl: (productId: number) => string;
    onItemClick: () => void;
}

function DropdownMenu({
    products,
    currentProductId,
    isBrandPage,
    brandLabel,
    getProductUrl,
    onItemClick,
}: DropdownMenuProps) {
    return (
        <div className="absolute left-0 mt-1 w-full overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#292D32]">
            {products.map((product) => (
                <DropdownItemLink
                    key={product.id}
                    href={getProductUrl(product.id)}
                    label={product.name}
                    isActive={currentProductId === product.id && !isBrandPage}
                    onClick={onItemClick}
                />
            ))}
            <DropdownItemLink
                href={DJAVACOAL_BRANDS_PATH}
                label={brandLabel}
                isActive={isBrandPage}
                onClick={onItemClick}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop Navigation Molecule
// ─────────────────────────────────────────────────────────────────────────────

interface DesktopNavProps {
    products: Product[];
    currentProductId: number | undefined;
    isBrandPage: boolean;
    brandLabel: string;
    getProductUrl: (productId: number) => string;
}

function DesktopNav({
    products,
    currentProductId,
    isBrandPage,
    brandLabel,
    getProductUrl,
}: DesktopNavProps) {
    return (
        <nav className="hidden h-fit w-[260px] border-y border-[#2a2a2a] bg-[#222222] lg:block">
            <div className="scrollbar-none overflow-y-auto">
                <div className="flex flex-col space-y-[3px]">
                    {products.map((product) => (
                        <SidebarNavLink
                            key={product.id}
                            href={getProductUrl(product.id)}
                            label={product.name}
                            isActive={
                                currentProductId === product.id && !isBrandPage
                            }
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
