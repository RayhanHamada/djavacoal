"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

import { ContactInfoItem } from "../molecules/contact-info-item";
import { ContactSocial } from "../molecules/contact-social";

export default function ContactSection() {
    const t = useTranslations("ContactUs");

    return (
        <section className="relative bg-[#1C1C1C] text-white">
            {/* Header Section */}
            <div className="relative w-full overflow-hidden bg-[#1C1C1C] text-white">
                {/* Background Image */}
                <div className="relative h-48 w-full md:h-72">
                    <Image
                        src="/images/bg-banner-header.png"
                        alt={t("page.bannerAlt")}
                        fill
                        className="object-cover object-center"
                        priority
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <h1 className="text-2xl font-semibold italic md:text-4xl">
                            {t("page.title")}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="mx-auto flex max-w-6xl flex-col px-6 py-10 md:flex-row md:items-center md:justify-between">
                {/* Logo */}
                <div className="flex flex-col items-center md:w-1/2">
                    <Image
                        src="/svgs/logoContactUs.svg"
                        alt={t("info.logoAlt")}
                        width={300}
                        height={120}
                        className=""
                    />
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-6 md:w-1/2">
                    <ContactInfoItem
                        icon={<FaEnvelope />}
                        label={t("info.email.label")}
                        value={t("info.email.value")}
                    />
                    <ContactInfoItem
                        icon={<FaPhoneAlt />}
                        label={t("info.phone.label")}
                        value={t("info.phone.value")}
                    />
                    <ContactInfoItem
                        icon={<FaMapMarkerAlt />}
                        label={t("info.location.label")}
                        value={t("info.location.value")}
                    />
                    <ContactSocial />
                </div>
            </div>
        </section>
    );
}
