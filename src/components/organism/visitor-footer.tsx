import React from "react";

import Image from "next/image";
import Link from "next/link";

import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaTiktok,
    FaPhoneAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

export default async function VisitorFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/images/bg-footer.png')] bg-cover bg-center text-gray-200">
            <div className="bg-secondary absolute top-0 left-0 z-50 h-0.5 w-full"></div>
            {/* Top Section */}
            <div className="mx-auto grid grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-4">
                {/* Logo & Social Media */}
                <div className="flex flex-col items-start md:items-center">
                    <Image
                        src="/svgs/logo.svg"
                        alt="Logo Djavacoal"
                        width={160}
                        height={100}
                        className="h-auto w-auto"
                    />
                    <div className="flex space-x-3">
                        <Link
                            href="#"
                            className="border bg-transparent p-2 hover:bg-gray-500"
                        >
                            <FaFacebookF size={16} />
                        </Link>
                        <Link
                            href="#"
                            className="border bg-transparent p-2 hover:bg-gray-500"
                        >
                            <FaLinkedinIn size={16} />
                        </Link>
                        <Link
                            href="#"
                            className="border bg-transparent p-2 hover:bg-gray-500"
                        >
                            <FaInstagram size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="border bg-transparent p-2 hover:bg-gray-500"
                        >
                            <FaTiktok size={16} />
                        </Link>
                    </div>
                </div>

                {/* Company + Products */}
                <div className="flex-col-2 flex gap-6 md:flex-row md:justify-between">
                    {/* Company */}
                    <div className="md:w-1/2">
                        <h3 className="text-secondary border-secondary mb-2 border-b-2 pb-1 text-base font-bold sm:text-xl">
                            Company
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs md:text-base">
                            <li>
                                <Link href="#">CV. Djavacoal Indonesia</Link>
                            </li>
                            <li>
                                <Link href="#">Djavacoal’s Team</Link>
                            </li>
                            <li>
                                <Link href="#">Legal & Certificate</Link>
                            </li>
                            <li>
                                <Link href="#">Factory</Link>
                            </li>
                            <li>
                                <Link href="#">Our Gallery</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div className="md:w-1/2">
                        <h3 className="text-secondary border-secondary mb-2 border-b-2 pb-1 text-base font-bold sm:text-xl">
                            Products
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs md:text-base">
                            <li>
                                <Link href="#">
                                    Coconut Shell Charcoal Briquette
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                    Barbeque Charcoal Briquette
                                </Link>
                            </li>
                            <li>
                                <Link href="#">Sawdust Charcoal Briquette</Link>
                            </li>
                            <li>
                                <Link href="#">
                                    Natural Wood Charcoal Briquette
                                </Link>
                            </li>
                            <li>
                                <Link href="#">Djavacoal’s Brand</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Quick Link + Contact */}
                <div className="flex flex-col md:flex-row md:justify-between md:gap-3 lg:col-span-2">
                    {/* Quick Link */}
                    <div className="md:w-1/2">
                        <h3 className="text-secondary border-secondary mb-2 w-38 border-b-2 pb-1 text-base font-bold sm:text-xl md:w-full lg:w-36">
                            Quick Link
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs md:text-base">
                            <li>
                                <Link href="#">Production Process</Link>
                            </li>
                            <li>
                                <Link href="#">Shipment Terms</Link>
                            </li>
                            <li>
                                <Link href="#">MOQ & Payment Terms</Link>
                            </li>
                            <li>
                                <Link href="#">Packaging Info</Link>
                            </li>
                            <li>
                                <Link href="#">FAQ</Link>
                            </li>
                            <li>
                                <Link href="#">News & Article</Link>
                            </li>
                        </ul>
                    </div>
                    {/* Contact */}
                    <div className="mt-8 md:mt-0 md:w-1/2">
                        <h3 className="mb-2 pb-1 text-base font-bold sm:text-xl">
                            Contact Us
                        </h3>
                        <div className="mt-3 space-y-3">
                            <Link
                                href="https://maps.app.goo.gl/cAjob1UgJrb42iwj8"
                                className="flex items-start gap-2"
                            >
                                <FaMapMarkerAlt className="mt-1 size-8 self-center md:size-6" />
                                <span className="text-xs md:text-base">
                                    PT TAIBA COCOCHA INDONESIA Jl. PWRI No.53,
                                    RT.1/RW.6, Tonjong, Tajur Halang, Bogor,
                                    Jawa Barat 16320, Indonesia
                                </span>
                            </Link>
                            <p className="font-bold">Phone :</p>
                            <Link
                                href="https://wa.me/6282122859318"
                                className="flex items-center gap-2"
                            >
                                <FaPhoneAlt className="size-4" /> +62 821 2285
                                9318
                            </Link>
                            <p className="font-bold">E-mail :</p>
                            <Link
                                href="mailto:marketing@djavacoal.com"
                                className="flex items-center gap-2"
                            >
                                <HiMail className="size-4 md:size-6" />{" "}
                                marketing@djavacoal.com
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
                    © Copyright {year} · CV. Djavacoal Indonesia
                </span>
            </div>
        </footer>
    );
}
