import { PropsWithChildren } from "react";

import { headers } from "next/headers";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Metadata } from "next";

import { getDB } from "@/adapters/d1/db";
import { KV_KEYS } from "@/adapters/kv/constants";
import { VisitorLayout } from "@/components";

type Props = PropsWithChildren;

/**
 * Build full URL for an R2 asset key
 */
function buildAssetUrl(key: string): string {
    return new URL(key, process.env.NEXT_PUBLIC_ASSET_URL).toString();
}

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

    const title = pageMetadata?.metadata_title || "CV Djavacoal Indonesia";
    const description =
        pageMetadata?.metadata_description || "Quality Charcoal from Indonesia";
    const ogImage = pageMetadata?.og_image_key
        ? buildAssetUrl(pageMetadata.og_image_key)
        : null;

    // Get OG images - use page-specific or fall back to defaults from KV

    const [facebookImage, twitterImage, linkedinImage, instagramImage] =
        await Promise.all([
            env.DJAVACOAL_KV.get(KV_KEYS.OG_DEFAULT_FACEBOOK).then((v) =>
                v
                    ? new URL(v, process.env.NEXT_PUBLIC_ASSET_URL).toString()
                    : null
            ),
            env.DJAVACOAL_KV.get(KV_KEYS.OG_DEFAULT_TWITTER).then((v) =>
                v
                    ? new URL(v, process.env.NEXT_PUBLIC_ASSET_URL).toString()
                    : null
            ),
            env.DJAVACOAL_KV.get(KV_KEYS.OG_DEFAULT_LINKEDIN).then((v) =>
                v
                    ? new URL(v, process.env.NEXT_PUBLIC_ASSET_URL).toString()
                    : null
            ),
            env.DJAVACOAL_KV.get(KV_KEYS.OG_DEFAULT_INSTAGRAM).then((v) =>
                v
                    ? new URL(v, process.env.NEXT_PUBLIC_ASSET_URL).toString()
                    : null
            ),
        ]);

    const keywords = pageMetadata?.metadata_keywords || [
        "djavacoal",
        "indonesia",
        "charcoal",
        "quality charcoal",
    ];

    return {
        title,
        description,
        keywords,
        assets: process.env.NEXT_PUBLIC_ASSETS_URL,
        openGraph: {
            type: "website",
            title,
            description,
            images:
                ogImage ??
                [facebookImage, linkedinImage, instagramImage].filter(
                    (url): url is string => Boolean(url)
                ),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ?? twitterImage ?? undefined,
        },
    };
}

export default function Layout({ children }: Props) {
    return <VisitorLayout>{children}</VisitorLayout>;
}
