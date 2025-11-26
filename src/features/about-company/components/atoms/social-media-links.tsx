import Link from "next/link";

import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

type SocialMediaLinksProps = {
    className?: string;
    facebookLink: string;
    instagramLink: string;
    linkedinLink: string;
};

export default function SocialMediaLinks(props: SocialMediaLinksProps) {
    return (
        <div className="flex space-x-3">
            <Link
                href={props.facebookLink}
                className="border bg-transparent p-2 hover:bg-gray-500"
                aria-label="Visit our Facebook page"
            >
                <FaFacebookF size={16} />
            </Link>
            <Link
                href={props.instagramLink}
                className="border bg-transparent p-2 hover:bg-gray-500"
                aria-label="Visit our Instagram page"
            >
                <FaInstagram size={18} />
            </Link>
            <Link
                href={props.linkedinLink}
                className="border bg-transparent p-2 hover:bg-gray-500"
                aria-label="Visit our LinkedIn page"
            >
                <FaLinkedinIn size={16} />
            </Link>
        </div>
    );
}
