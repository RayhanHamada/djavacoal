import "./globals.css";

import { PropsWithChildren } from "react";

import { headers } from "next/headers";

import { mantineHtmlProps } from "@mantine/core";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Metadata } from "next";

import { getDB } from "@/adapters/d1/db";
import { ClientGlobalProvider, ServerGlobalProvider } from "@/components";
import fonts from "@/configs/fonts";

type Props = Readonly<PropsWithChildren>;

export async function generateMetadata(): Promise<Metadata> {
    const header = await headers();
    const pathname = header.get("x-pathname") ?? "/";

    const { env } = await getCloudflareContext({ async: true });
    const db = getDB(env.DJAVACOAL_DB);
    const pageMetadata = await db.query.pageMetadatas.findFirst({
        where(fields, operators) {
            return operators.eq(fields.path, pathname);
        },
    });

    return {
        title: pageMetadata?.metadata_title || "CV Djavacoal Indonesia",
        description:
            pageMetadata?.metadata_description ||
            "Quality Charcoal from Indonesia",
        keywords: pageMetadata?.metadata_keywords || [
            "charcoal",
            "djavacoal",
            "indonesia",
            "quality charcoal",
        ],
        assets: process.env.NEXT_PUBLIC_ASSETS_URL,
    };
}

export default async function Layout({ children }: Props) {
    return (
        <html lang="en" {...mantineHtmlProps}>
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
