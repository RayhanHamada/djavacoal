import { ProductPage } from "@/features/our-products/components/organism";

export default function OurProductsPage() {
    return (
        <main className="min-h-screen bg-[#161616] text-white">
            {/* Hero Section */}
            <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden">
                {/* Background with gradient overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 50% -18%, rgba(21, 21, 21, 0.3) 39%, rgba(219, 172, 102, 1) 72%),
                            url('/images/bg-banner-header.png')
                        `,
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-[214px] px-4 py-[125px]">
                    <h1 className="text-2xl font-semibold italic md:text-4xl">
                        Products
                    </h1>
                </div>

                {/* Bottom decorative line */}
                <div className="absolute bottom-0 h-[2px] w-full bg-[#474747]" />
            </div>

            {/* Main Content */}
            <ProductPage />
        </main>
    );
}
