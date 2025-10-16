import Link from "next/link";
import React from "react";

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
    className="p-2 bg-gray-700 hover:bg-orange-500 text-white rounded transition"
  >
    {icon}
  </Link>
);
