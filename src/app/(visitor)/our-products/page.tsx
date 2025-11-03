import Image from "next/image";

import { ProductPage } from "@/features/our-products/components/organism";

export default function OurProductsPage() {
    return (
        <main className="min-h-screen bg-[#161616] text-white">
            {/* Hero Section */}
            <section className="relative w-full overflow-hidden bg-[#1C1C1C] text-white">
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
            </section>

            {/* Main Content */}
            <section className="relative w-full overflow-hidden bg-[#1C1C1C] text-white">
                <ProductPage />
            </section>
        </main>
    );
}
