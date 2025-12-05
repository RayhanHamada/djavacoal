import type { NextConfig } from "next";

import nextBundleAnalyzer from "@next/bundle-analyzer";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const isDevelopment = process.env.NEXTJS_ENV === "development";

const nextConfig: NextConfig = {
    images: {
        loader: isDevelopment ? "default" : "custom",
        loaderFile: isDevelopment ? undefined : "./image-loader.ts",
        remotePatterns: [
            {
                hostname: "i.ytimg.com",
            },
            {
                hostname: "img.youtube.com",
            },
            {
                hostname: "ytimg.googleusercontent.com",
            },
            {
                hostname: "flagsapi.com",
            },
            {
                hostname: "img.youtube.com",
            },
            {
                hostname: new URL(process.env.NEXT_PUBLIC_ASSET_URL).hostname,
            },
        ],
        formats: ["image/webp"],
    },
    async redirects() {
        return [
            {
                source: "/category/:path*",
                destination: "/blog",
                permanent: false,
            },
            {
                // Match any path that starts with a 4-digit year
                // /2021
                // /2021/09
                // /2021/09/09
                // /2021/09/09/slug/whatever
                source: "/:year(\\d{4})/:rest*",
                destination: "/blog",
                permanent: true,
            },
        ];
    },
};

/**
 * Wrap Next.js config with next-intl plugin (for i18n)
 */
const withNextIntl = createNextIntlPlugin();
const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withNextIntl(nextConfig));

/**
 * Initialize Cloudflare Workers dev environment
 */
initOpenNextCloudflareForDev({
    environment: process.env.NEXTJS_ENV,
});
