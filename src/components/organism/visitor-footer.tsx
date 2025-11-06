import React from "react";

import Image from "next/image";
import Link from "next/link";

import { getTranslations } from "next-intl/server";
import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaTiktok,
    FaPhoneAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

import { serverPublicAPIClient } from "@/adapters/public-api/server";
import { FooterProductList } from "@/components/molecules/footer-product-list";

export default async function VisitorFooter() {
    const t = await getTranslations("Footer");
    const year = new Date().getFullYear();

    const { data } = await serverPublicAPIClient.GET("/footer-content");

    return (
        <footer className="relative bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/images/bg-footer.png')] bg-cover bg-center text-gray-200">
            <div className="bg-secondary absolute top-0 left-0 z-50 h-0.5 w-full"></div>
            {/* Top Section */}
            <div className="mx-auto grid grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-4">
                {/* Logo & Social Media */}
                <div className="flex flex-col items-start md:items-center">
                    <Image
                        src="/svgs/logo.svg"
                        alt={t("logoAlt")}
                        width={160}
                        height={100}
                        className="h-auto w-auto"
                    />
                    <div className="flex space-x-3">
                        <Link
                            href={data?.data.facebook_link || "#"}
                            className="border bg-transparent p-2 hover:bg-gray-500"
                        >
                            <FaFacebookF size={16} />
                        </Link>
                        <Link
                            href={data?.data.linkedin_link || "#"}
                            className="border bg-transparent p-2 hover:bg-gray-500"
                        >
                            <FaLinkedinIn size={16} />
                        </Link>
                        <Link
                            href={data?.data.instagram_link || "#"}
                            className="border bg-transparent p-2 hover:bg-gray-500"
                        >
                            <FaInstagram size={18} />
                        </Link>
                        <Link
                            href={data?.data.tiktok_link || "#"}
                            className="border bg-transparent p-2 hover:bg-gray-500"
                        >
                            <FaTiktok size={16} />
                        </Link>
                    </div>
                </div>

                {/* Company + Products */}
                <div className="flex-col-2 flex gap-6 md:flex-row md:justify-between">
                    {/* Company */}
                    {/* Company */}
                    <div className="md:w-1/2">
                        <h3 className="text-secondary border-secondary mb-2 border-b-2 pb-1 text-base font-bold sm:text-xl">
                            {t("sections.company")}
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs md:text-base">
                            <li>
                                <Link href="#">{t("company.cvDjavacoal")}</Link>
                            </li>
                            <li>
                                <Link href="#">{t("company.team")}</Link>
                            </li>
                            <li>
                                <Link href="#">{t("company.legal")}</Link>
                            </li>
                            <li>
                                <Link href="#">{t("company.factory")}</Link>
                            </li>
                            <li>
                                <Link href="#">{t("company.gallery")}</Link>
                            </li>
                        </ul>
                    </div>
                    {/* Products */}
                    <div className="md:w-1/2">
                        <h3 className="text-secondary border-secondary mb-2 border-b-2 pb-1 text-base font-bold sm:text-xl">
                            {t("sections.products")}
                        </h3>
                        <FooterProductList />
                    </div>
                </div>

                {/* Quick Link + Contact */}
                <div className="flex flex-col md:flex-row md:justify-between md:gap-3 lg:col-span-2">
                    {/* Quick Link */}
                    <div className="md:w-1/2">
                        <h3 className="text-secondary border-secondary mb-2 w-38 border-b-2 pb-1 text-base font-bold sm:text-xl md:w-full lg:w-36">
                            {t("sections.quickLink")}
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs md:text-base">
                            <li>
                                <Link href="#">
                                    {t("quickLinks.productionProcess")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                    {t("quickLinks.shipmentTerms")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                    {t("quickLinks.moqPayment")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                    {t("quickLinks.packagingInfo")}
                                </Link>
                            </li>
                            <li>
                                <Link href="#">{t("quickLinks.faq")}</Link>
                            </li>
                            <li>
                                <Link href="#">{t("quickLinks.news")}</Link>
                            </li>
                        </ul>
                    </div>
                    {/* Contact */}
                    <div className="mt-8 md:mt-0 md:w-1/2">
                        <h3 className="mb-2 pb-1 text-base font-bold sm:text-xl">
                            {t("sections.contactUs")}
                        </h3>
                        <div className="mt-3 space-y-3">
                            <Link
                                href={data?.data.maps_link || "#"}
                                className="flex items-start gap-2"
                            >
                                <FaMapMarkerAlt className="mt-1 size-8 self-center md:size-6" />
                                <span className="text-xs md:text-base">
                                    {data?.data.address || ""}
                                </span>
                            </Link>
                            <p className="font-bold">{t("contact.phone")}</p>
                            <Link
                                href={`https://wa.me/${data?.data.phone_number || ""}`}
                                className="flex items-center gap-2"
                            >
                                <FaPhoneAlt className="size-4" />{" "}
                                {data?.data.phone_number || ""}
                            </Link>
                            <p className="font-bold">{t("contact.email")}</p>
                            <Link
                                href="mailto:marketing@djavacoal.com"
                                className="flex items-center gap-2"
                            >
                                <HiMail className="size-4 md:size-6" />{" "}
                                {data?.data.email || ""}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Copyright */}
            <div className="relative py-4 text-center text-xs text-white">
                <div className="absolute inset-0 bg-[#EFA12D]"></div>
                <div className="absolute inset-0 bg-black/50"></div>
                <span className="relative z-10 text-xs lg:text-base">
                    {t("copyright", { year })}
                </span>
            </div>
        </footer>
    );
}
