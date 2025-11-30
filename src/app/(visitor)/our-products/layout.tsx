import type { ReactNode } from "react";

import Image from "next/image";

import { OurProductsLayoutClient } from "@/features/our-products/components/organism/our-products-layout-client";

export default function OurProductsLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className="bg-primary min-h-screen text-white">
            {/* Hero Section */}
            <section className="bg-primary relative w-full overflow-hidden text-white">
                {/* Background Image */}
                <div className="relative h-48 w-full md:h-72">
                    <Image
                        src="/images/bg-banner-header.png"
                        alt="Production Info Banner"
                        fill
                        className="object-cover object-center"
                        priority
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <h1 className="text-2xl font-semibold italic md:text-4xl">
                            Products
                        </h1>
                    </div>
                </div>
                {/* 🔹 Garis bawah */}
                <div className="absolute bottom-0 left-0 h-px w-full bg-[#474747]" />
            </section>

            {/* Main Content with Sidebar */}
            <section className="bg-primary relative w-full text-white">
                <OurProductsLayoutClient>{children}</OurProductsLayoutClient>
            </section>
        </main>
    );
}
