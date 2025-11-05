import Link from "next/link";

import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import { SOCIAL_LINKS } from "../../lib/constants";

export default function SocialMediaLinks() {
    return (
        <div className="flex space-x-3">
            <Link
                href={SOCIAL_LINKS.facebook}
                className="border bg-transparent p-2 hover:bg-gray-500"
                aria-label="Visit our Facebook page"
            >
                <FaFacebookF size={16} />
            </Link>
            <Link
                href={SOCIAL_LINKS.instagram}
                className="border bg-transparent p-2 hover:bg-gray-500"
                aria-label="Visit our Instagram page"
            >
                <FaInstagram size={18} />
            </Link>
            <Link
                href={SOCIAL_LINKS.linkedin}
                className="border bg-transparent p-2 hover:bg-gray-500"
                aria-label="Visit our LinkedIn page"
            >
                <FaLinkedinIn size={16} />
            </Link>
        </div>
    );
}
