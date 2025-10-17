import React from "react";

import Link from "next/link";

export const SocialButton = ({
    href,
    icon,
}: {
    href: string;
    icon: React.ReactNode;
}) => (
    <Link
        href={href}
        target="_blank"
        className="rounded bg-gray-700 p-2 text-white transition hover:bg-orange-500"
    >
        {icon}
    </Link>
);
