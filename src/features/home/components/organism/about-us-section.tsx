import Image from "next/image";
import Link from "next/link";

export function AboutUsSection() {
    return (
        <section className="w-full px-5 py-10 md:px-10 md:py-16 lg:px-20 lg:py-20">
            <div className="container mx-auto">
                <div className="flex flex-col items-center gap-10">
                    {/* Company Profile Video/Image Card */}
                    <div className="relative w-full max-w-[800px] overflow-hidden rounded-lg border border-[#EFA12D]/40 bg-gradient-to-b bg-[url('/images/bg-banner-header.png')] from-black/33 to-transparent bg-cover shadow-lg backdrop-blur-sm">
                        <div className="relative flex flex-col items-center gap-4 p-5 md:p-8">
                            {/* Header */}
                            <div className="flex items-center gap-4 rounded-lg bg-black/60 px-5 py-4 backdrop-blur-[34px]">
                                <Image
                                    src="/images/company-profile-icon.svg"
                                    alt="Company Profile"
                                    width={50}
                                    height={50}
                                    className="rounded-[110px] bg-[#EFA12D] p-3"
                                />
                                <h3 className="font-['Josefin_Sans'] text-base text-white">
                                    Company Profile - Djavacoal Indonesia
                                </h3>
                            </div>

                            {/* Divider Wave */}
                            <Image
                                src="/images/wave-divider.svg"
                                alt=""
                                width={113.29}
                                height={42.76}
                                className="my-2"
                            />
                        </div>
                    </div>

                    {/* Company Description */}
                    <div className="flex w-full max-w-[900px] flex-col items-center gap-5 text-center">
                        <h2 className="font-['Josefin_Sans'] text-3xl font-bold text-black md:text-4xl lg:text-[36px]">
                            CV. DJAVACOAL INDONESIA
                        </h2>
                        <p className="text-justify font-['Open_Sans'] text-base leading-[1.36em] text-[#C6C6C6]">
                            Djavacoal Indonesia is a trusted supplier and
                            exporter of premium coconut charcoal briquettes, BBQ
                            charcoal briquettes, sawdust charcoal and natural
                            wood charcoal. We are dedicated to fostering
                            innovation within our company and to operating at
                            the international level within the briquette
                            industry. We are committed to meeting the needs of
                            our partners and contributing to the growth of the
                            Indonesian economy.
                            <br />
                            <br />
                            In addition to producing charcoal briquettes, our
                            company is also a supplier of natural hardwood
                            charcoal. This is sourced from tamarind, halaban,
                            rosewood and a variety of other hardwoods, which are
                            in high demand for export to various countries.
                            Given our extensive experience in the charcoal
                            industry, we are confident that we would be able to
                            collaborate and cooperate with your company in the
                            future.
                            <br />
                            <br />
                            Indonesia is renowned for its high-quality coconut
                            charcoal. We are confident that we can guarantee the
                            processing of our products using the finest quality
                            raw materials. As a supplier, we operate three
                            factories in close collaboration on Java Island,
                            Indonesia.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href="/about-us"
                        className="group flex items-center gap-2 border-b-[3px] border-[#EFA12D] pb-1 font-['Open_Sans'] text-xl font-bold text-[#EFA12D] transition-all hover:border-[#D68F1F] hover:text-[#D68F1F]"
                    >
                        Get to Know Us!
                    </Link>
                </div>
            </div>
        </section>
    );
}
