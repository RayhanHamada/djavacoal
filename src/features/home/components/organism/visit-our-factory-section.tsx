"use client";

import Image from "next/image";
import Link from "next/link";

export function VisitOurFactorySection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#1D1D1D] px-5 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Left: Image */}
                    <div className="relative order-2 overflow-hidden rounded-[20px] lg:order-1">
                        <div className="relative h-[350px] w-full md:h-[450px] lg:h-[550px]">
                            <Image
                                src="/images/factory-visit-5eb1a1.png"
                                alt="Djavacoal Factory"
                                fill
                                className="rounded-[20px] object-cover"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-60" />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 flex flex-col justify-center space-y-6 lg:order-2">
                        <div className="flex items-center gap-3">
                            <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                            <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                                Visit Our Factory
                            </h2>
                        </div>

                        <p className="font-['Open_Sans'] text-[15px] leading-relaxed text-[#C6C6C6] md:text-[16px]">
                            Experience our state-of-the-art production
                            facilities firsthand. We welcome clients,
                            distributors, and partners to tour our three
                            factories located in Java Island, Indonesia. See our
                            commitment to quality and sustainability in action.
                        </p>

                        <p className="font-['Open_Sans'] text-[15px] leading-relaxed text-[#C6C6C6] md:text-[16px]">
                            Our factory tours provide insights into our complete
                            production process, from raw material processing to
                            final packaging. You&apos;ll meet our experienced
                            team and understand why we&apos;re a trusted
                            supplier of premium charcoal products globally.
                        </p>

                        {/* Factory Highlights */}
                        <ul className="space-y-3">
                            {[
                                "Three Production Facilities in Java Island",
                                "Advanced Quality Control Systems",
                                "Sustainable Production Practices",
                                "Experienced Production Team",
                                "International Standard Compliance",
                            ].map((highlight, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3 font-['Open_Sans'] text-[14px] text-white md:text-[15px]"
                                >
                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#EFA12D]">
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10 3L4.5 8.5L2 6"
                                                stroke="#151515"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    {highlight}
                                </li>
                            ))}
                        </ul>

                        {/* WhatsApp CTA Button */}
                        <Link
                            href="https://wa.me/6281234567890?text=Hi,%20I%20would%20like%20to%20schedule%20a%20factory%20visit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex w-fit items-center gap-3 rounded-[40px] border-2 border-[#25D366] bg-[#25D366] px-8 py-3 font-['Open_Sans'] text-[14px] font-semibold text-white uppercase transition-all hover:bg-transparent hover:text-[#25D366] md:px-10 md:py-4 md:text-[15px]"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"
                                    fill="currentColor"
                                />
                            </svg>
                            Schedule a Visit
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
