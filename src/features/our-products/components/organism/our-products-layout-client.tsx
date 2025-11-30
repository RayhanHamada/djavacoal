"use client";

import type { ReactNode } from "react";

import { useLocale } from "next-intl";

import { LOCALES } from "@/configs";
import { OurProductsLayoutSidebar } from "@/features/our-products/components/molecules/our-products-layout-sidebar";
import { ProductsProvider } from "@/features/our-products/hooks/use-products-context";
import { cn } from "@/lib/utils";

/**
 * Client component that provides the products context and renders the sidebar layout
 * Used by the our-products layout to share state between sidebar and content
 */
export function OurProductsLayoutClient({ children }: { children: ReactNode }) {
    const locale = useLocale();

    return (
        <ProductsProvider>
            <div className="flex flex-col gap-10 gap-y-0 py-0 lg:gap-0 lg:px-0">
                {/* Mobile Dropdown - sticky at top for mobile/tablet only */}
                <div className="sticky top-24 z-50 lg:hidden">
                    <OurProductsLayoutSidebar />
                </div>

                <section
                    className={cn(
                        "mx-auto max-w-7xl px-5 py-0 pb-10 md:px-10 md:py-16 lg:mx-0 lg:max-w-none lg:px-0 lg:py-0",
                        locale === LOCALES.AR ? "lg:ml-10" : "lg:mr-10"
                    )}
                >
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
                        {/* === LEFT SIDEBAR (Desktop Only) === */}
                        <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
                            <div className="bg-[#222222] pt-16 pb-[100vh]">
                                <OurProductsLayoutSidebar />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="my-0 space-y-12 rounded-xl py-0 pb-10 lg:my-16 lg:bg-[#222222] lg:px-10 lg:py-10 lg:pb-10">
                            {children}
                        </div>
                    </div>
                </section>
            </div>
        </ProductsProvider>
    );
}
