"use client";

import React from "react";

import Link from "next/link";

import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaTiktok,
} from "react-icons/fa";

import { useContactInfoContentAPI } from "@/features/public-api/hooks";

export function ContactSocial() {
    const { data: contactUsData } = useContactInfoContentAPI();
    return (
        <div className="flex justify-start gap-3 md:justify-start">
            <div className="flex flex-col items-start md:items-center">
                <div className="flex space-x-3">
                    <Link
                        href={contactUsData?.data.facebook_link ?? "#"}
                        target="_blank"
                        className="border bg-transparent p-2 hover:bg-gray-500"
                    >
                        <FaFacebookF size={16} />
                    </Link>
                    <Link
                        href={contactUsData?.data.linkedin_link ?? "#"}
                        target="_blank"
                        className="border bg-transparent p-2 hover:bg-gray-500"
                    >
                        <FaLinkedinIn size={16} />
                    </Link>
                    <Link
                        href={contactUsData?.data.instagram_link ?? "#"}
                        target="_blank"
                        className="border bg-transparent p-2 hover:bg-gray-500"
                    >
                        <FaInstagram size={18} />
                    </Link>
                    <Link
                        href={contactUsData?.data.tiktok_link ?? "#"}
                        target="_blank"
                        className="border bg-transparent p-2 hover:bg-gray-500"
                    >
                        <FaTiktok size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
