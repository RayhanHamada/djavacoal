import Link from "next/link";

import { getTranslations } from "next-intl/server";

import { VisitorLayout } from "@/components";

export default async function NotFound() {
    const t = await getTranslations("NotFound");

    return (
        <VisitorLayout>
            <div className="relative flex min-h-[calc(100vh-6rem)] w-full items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url(/images/hero-carousel-1.png)",
                    }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/70" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
                    {/* 404 Title */}
                    <h1 className="mb-4 text-5xl font-bold text-white sm:text-6xl md:text-7xl lg:text-8xl">
                        <span className="text-[#D4A34A]">404</span> - NOT FOUND
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-2 max-w-2xl text-base text-gray-300 sm:text-lg md:text-xl">
                        {t("subtitle")}
                    </p>

                    {/* What can I do now section */}
                    <div className="mt-6 mb-8">
                        <p className="mb-2 text-base font-semibold text-white sm:text-lg">
                            {t("whatCanIDo")}
                        </p>
                        <p className="text-sm text-gray-300 sm:text-base">
                            {t("pleaseCheck")}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                        <Link
                            href="/"
                            className="min-w-[180px] rounded-md border-2 border-[#D4A34A] bg-transparent px-6 py-3 text-base font-medium text-[#D4A34A] transition-all hover:bg-[#D4A34A] hover:text-black sm:text-lg"
                        >
                            {t("buttons.returnHome")}
                        </Link>

                        <Link
                            href="/our-products"
                            className="min-w-[180px] rounded-md border-2 border-[#D4A34A] bg-transparent px-6 py-3 text-base font-medium text-[#D4A34A] transition-all hover:bg-[#D4A34A] hover:text-black sm:text-lg"
                        >
                            {t("buttons.ourProducts")}
                        </Link>

                        <Link
                            href="/about-company"
                            className="min-w-[180px] rounded-md border-2 border-[#D4A34A] bg-transparent px-6 py-3 text-base font-medium text-[#D4A34A] transition-all hover:bg-[#D4A34A] hover:text-black sm:text-lg"
                        >
                            {t("buttons.aboutCompany")}
                        </Link>
                    </div>
                </div>
            </div>
        </VisitorLayout>
    );
}
