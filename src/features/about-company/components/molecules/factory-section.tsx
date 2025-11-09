"use client";

import Image from "next/image";
import Link from "next/link";

import { FaWhatsapp } from "react-icons/fa";

import { FadeInView, ScaleXView, SlideInView } from "../atoms";
import { useAboutCompanyContentAPI } from "@/features/public-api/hooks";

export default function FactorySection() {
    const { data } = useAboutCompanyContentAPI();

    return (
        <section
            id="factory"
            className="mt-10 scroll-mt-28 space-y-6 rounded-xl bg-[#222222] p-5 lg:p-10"
        >
            <header className="mb-2 pt-4">
                <SlideInView yOffset={30} duration={0.6}>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="h-px w-8 bg-white" />
                        <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                            Our Factory
                        </p>
                    </div>
                </SlideInView>

                <SlideInView yOffset={30} duration={0.65}>
                    <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                        Where Quality Meets Production
                    </h2>
                </SlideInView>

                <SlideInView yOffset={35} duration={0.7}>
                    <p className="font-medium text-[#EFA12D]">
                        Three Factories Across Java, Ready To Serve Global
                        Markets
                    </p>
                </SlideInView>

                <ScaleXView duration={0.6}>
                    <div className="mt-4 h-px origin-left bg-[#3A3A3A]" />
                </ScaleXView>
            </header>

            <FadeInView duration={0.5}>
                <div className="relative h-56 w-full overflow-hidden rounded-md sm:h-72 md:h-80 lg:h-[520px] lg:max-w-3/4">
                    {data?.data.our_factory_photo && (
                        <Image
                            src={data?.data.our_factory_photo ?? ""}
                            alt="Charcoal Production Factory Djavacoal Indonesia"
                            fill
                            className="rounded-md object-cover"
                            priority
                            sizes="(max-width: 1024px) 100vw, 850px"
                        />
                    )}
                </div>
            </FadeInView>

            <SlideInView yOffset={30} duration={0.55}>
                <article className="space-y-4 text-justify text-sm leading-relaxed text-gray-300 md:text-base">
                    <p>
                        At{" "}
                        <strong className="text-white">
                            Djavacoal Indonesia
                        </strong>
                        , we take pride in operating three factories across Java
                        that combine years of expertise, strict quality control,
                        and modern production standards to deliver world-class
                        charcoal products. Every step of our process from
                        selecting premium raw materials to shaping, testing, and
                        packaging is carried out with professionalism and
                        dedication to ensure consistency, safety, and
                        performance. With our proven experience in serving
                        global markets, we welcome you to visit our factories
                        and witness firsthand how we transform Indonesia&apos;s
                        finest resources into trusted charcoal products for the
                        world.
                    </p>
                </article>
            </SlideInView>

            <div className="mt-4 flex">
                <Link
                    href="https://wa.me/628xxxxxxx"
                    target="_blank"
                    className="bg-button-whatsapp flex h-16 w-full items-center justify-center gap-2 rounded-md font-semibold text-white transition hover:bg-[#25d366] md:w-[325px] lg:w-[325px]"
                >
                    <span>Schedule a Visit</span>
                    <FaWhatsapp className="text-lg" />
                </Link>
            </div>
        </section>
    );
}
