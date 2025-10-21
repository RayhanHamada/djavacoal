import OurProductsSidebar from "@/features/our-products/components/molecules/our-product-sidebar";
import { ProductPage } from "@/features/our-products/components/organism";
export default function OurProducts() {
    return (
        <main className="bg-[#161616] text-white">
            <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16 lg:mx-0 lg:mr-10 lg:max-w-none lg:px-0 lg:py-0">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
                    <div className="bg-[#222222] lg:py-16">
                        <OurProductsSidebar />
                    </div>

                    <div className="space-y-12 lg:py-16">
                        <ProductPage />
                    </div>
                </div>
            </section>
        </main>
    );
}
