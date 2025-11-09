"use client";

import type { Certificate } from "../../lib/types";

import { useTranslations } from "next-intl";

import { useImageModal } from "../../hooks";
import { CERTIFICATES } from "../../lib/constants";
import {
    CertificateCard,
    CertificateLightbox,
    FadeInView,
    ScaleOnHover,
    ScaleXView,
    SlideInView,
} from "../atoms";

export default function CertificateSection() {
    const t = useTranslations("AboutCompany.certificates");
    const { isOpen, currentItem, open, close } = useImageModal<Certificate>();

    const getCertificateName = (alt: string): string => {
        switch (alt) {
            case "NIB / Business Registration Number":
                return t("certificateNames.nib");
            case "Report Of Analysis (ROA)":
                return t("certificateNames.roa");
            case "Self-Heating Test (SHT) - 1":
                return t("certificateNames.sht1");
            case "Self-Heating Test (SHT) - 2":
                return t("certificateNames.sht2");
            case "Self-Heating Test (SHT) - 3":
                return t("certificateNames.sht3");
            case "Material Safety Data Sheet (MSDS) - 1":
                return t("certificateNames.msds1");
            case "Material Safety Data Sheet (MSDS) - 2":
                return t("certificateNames.msds2");
            case "Material Safety Data Sheet (MSDS)":
                return t("certificateNames.msds3");
            default:
                return alt;
        }
    };

    return (
        <section
            id="certificates"
            className="mt-10 scroll-mt-28 space-y-6 rounded-xl bg-[#222222] p-5 lg:p-10"
        >
            {/* Heading */}
            <header className="mb-2">
                <SlideInView className="mb-2 flex items-center gap-3">
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        {t("subtitle")}
                    </p>
                </SlideInView>

                <SlideInView
                    delay={0.05}
                    duration={0.65}
                    className="text-xl leading-snug font-semibold text-white md:text-2xl"
                >
                    <h2>{t("title")}</h2>
                </SlideInView>

                <SlideInView
                    delay={0.1}
                    duration={0.7}
                    yOffset={35}
                    className="font-medium text-[#EFA12D]"
                >
                    <p>{t("tagline")}</p>
                </SlideInView>

                <ScaleXView className="mt-4 h-px origin-left bg-[#3A3A3A]">
                    <div />
                </ScaleXView>
            </header>

            {/* Mobile Horizontal Scroll */}
            <div className="scrollbar-hide overflow-x-auto pr-12 pb-3 lg:hidden">
                <div className="flex snap-x snap-mandatory gap-6">
                    {CERTIFICATES.map((certificate, index) => (
                        <ScaleOnHover
                            key={index}
                            scale={1.03}
                            className="flex w-[250px] shrink-0 snap-start flex-col items-center"
                        >
                            <button onClick={() => open(certificate, index)}>
                                <CertificateCard certificate={certificate} />
                                <p className="mt-2 text-xs text-gray-300 italic">
                                    {getCertificateName(certificate.alt)}
                                </p>
                            </button>
                        </ScaleOnHover>
                    ))}
                </div>
            </div>

            {/* Desktop Grid */}
            <FadeInView
                duration={0.4}
                className="hidden gap-6 lg:grid lg:grid-cols-4"
            >
                {CERTIFICATES.map((certificate, index) => (
                    <ScaleOnHover
                        key={index}
                        scale={1.04}
                        className="flex flex-col items-center"
                    >
                        <button onClick={() => open(certificate, index)}>
                            <CertificateCard certificate={certificate} />
                            <p className="mt-2 text-center text-sm text-gray-300 italic">
                                {getCertificateName(certificate.alt)}
                            </p>
                        </button>
                    </ScaleOnHover>
                ))}
            </FadeInView>

            {/* Certificate Lightbox */}
            <CertificateLightbox
                isOpen={isOpen}
                certificate={currentItem}
                onClose={close}
            />
        </section>
    );
}
