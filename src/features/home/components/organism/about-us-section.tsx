import Image from "next/image";
import Link from "next/link";

export function AboutUsSection() {
    return (
        <section className="w-full bg-white px-5 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
            <div className="container mx-auto">
                <div className="flex flex-col items-center gap-12 md:gap-16">
                    {/* Company Profile Video/Image Card */}
                    <div className="relative w-full max-w-[1200px] overflow-hidden rounded-[20px] bg-[#1D1D1D] shadow-2xl">
                        <div className="relative flex flex-col items-stretch gap-0 md:flex-row">
                            {/* Left: Text Content */}
                            <div className="flex flex-col items-start justify-center gap-6 px-8 py-10 md:w-1/2 md:px-12 md:py-14">
                                <h3 className="font-['Josefin_Sans'] text-lg leading-tight font-semibold text-white md:text-xl lg:text-2xl">
                                    Company Profile - Djavacoal Indonesia
                                </h3>

                                {/* Play Button */}
                                <div className="rounded-full bg-[#EFA12D] p-4 md:p-5">
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        className="md:h-10 md:w-10"
                                    >
                                        <path
                                            d="M10 8L24 16L10 24V8Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>

                                {/* Divider Wave */}
                                <Image
                                    src="/images/wave-divider.svg"
                                    alt=""
                                    width={100}
                                    height={40}
                                    className="my-2"
                                />
                            </div>

                            {/* Right: Image */}
                            <div className="relative h-[300px] md:h-auto md:w-1/2">
                                <Image
                                    src="/images/hero-carousel-1.png"
                                    alt="Djavacoal Indonesia Factory"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Description */}
                    <div className="flex w-full max-w-[1000px] flex-col items-center gap-6 text-center">
                        <h2 className="font-['Josefin_Sans'] text-3xl font-bold text-[#1D1D1D] md:text-4xl lg:text-[42px]">
                            CV.{" "}
                            <span className="text-[#EFA12D]">DJAVACOAL</span>{" "}
                            INDONESIA
                        </h2>
                        <div className="space-y-5 text-justify font-['Open_Sans'] text-[15px] leading-[1.8em] text-[#4A4A4A] md:text-[16px]">
                            <p>
                                Djavacoal Indonesia is a trusted supplier and
                                exporter of premium coconut charcoal briquettes,
                                BBQ charcoal briquettes, sawdust charcoal and
                                natural wood charcoal. We are dedicated to
                                fostering innovation within our company and to
                                operating at the international level within the
                                briquette industry. We are committed to meeting
                                the needs of our partners and contributing to
                                the growth of the Indonesian economy.
                            </p>
                            <p>
                                In addition to producing charcoal briquettes,
                                our company is also a supplier of natural
                                hardwood charcoal. This is sourced from
                                tamarind, halaban, rosewood and a variety of
                                other hardwoods, which are in high demand for
                                export to various countries. Given our extensive
                                experience in the charcoal industry, we are
                                confident that we would be able to collaborate
                                and cooperate with your company in the future.
                            </p>
                            <p>
                                Indonesia is renowned for its high-quality
                                coconut charcoal. We are confident that we can
                                guarantee the processing of our products using
                                the finest quality raw materials. As a supplier,
                                we operate three factories in close
                                collaboration on Java Island, Indonesia.
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href="/about-us"
                        className="group inline-flex items-center gap-2 border-b-[3px] border-[#EFA12D] pb-2 font-['Open_Sans'] text-xl font-bold text-[#EFA12D] transition-all hover:border-[#D68F1F] hover:text-[#D68F1F] md:text-2xl"
                    >
                        Get to Know Us!
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="transition-transform group-hover:translate-x-1"
                        >
                            <path
                                d="M9 18L15 12L9 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
