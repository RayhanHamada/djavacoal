import Image from "next/image";

import { ProductPage } from "@/features/our-products/components/organism";

export default function OurProductsPage() {
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
            </section>

            {/* Main Content */}
            <section className="bg-primary relative w-full overflow-hidden text-white">
                <ProductPage />
            </section>
        </main>
    );
}
