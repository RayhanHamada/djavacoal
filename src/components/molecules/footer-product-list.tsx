"use client";

import Link from "next/link";

import { $api } from "@/adapters/public-api/client";

export function FooterProductList() {
    const { data: productNames } = $api.useQuery("get", "/products-names");

    return (
        <ul className="mt-3 space-y-2 text-xs md:text-base">
            {productNames?.data.names.map((item) => (
                <Link
                    key={item.id}
                    href="#"
                    className="decoration-secondary hover:underline"
                >
                    <li>{item.name}</li>
                </Link>
            ))}
        </ul>
    );
}
