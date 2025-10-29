import "./globals.css";

import { PropsWithChildren } from "react";

import { headers } from "next/headers";

import { Metadata } from "next";

import { ClientGlobalProvider, ServerGlobalProvider } from "@/components";
import fonts from "@/configs/fonts";

type Props = Readonly<PropsWithChildren>;

export async function generateMetadata(): Promise<Metadata> {
    const header = await headers();
    const _pathname = header.get("x-pathname") ?? "/";

    return {
        title: "Djavacoal",
        description: "Quality Charcoal from Indonesia",
        keywords: [],
        assets: process.env.NEXT_PUBLIC_ASSETS_URL,
    };
}

export default async function Layout({ children }: Props) {
    return (
        <html lang="en">
            <body
                className={`${fonts.josefinSans.variable} ${fonts.openSans.variable} antialiased`}
            >
                <ServerGlobalProvider>
                    <ClientGlobalProvider>{children}</ClientGlobalProvider>
                </ServerGlobalProvider>
            </body>
        </html>
    );
}
