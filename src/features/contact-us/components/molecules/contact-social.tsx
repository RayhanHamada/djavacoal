import React from "react";

import Link from "next/link";

import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaTiktok,
} from "react-icons/fa";

export const ContactSocial = () => (
    <div className="flex justify-start gap-3 md:justify-start">
        <div className="flex flex-col items-start md:items-center">
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
    </div>
);
