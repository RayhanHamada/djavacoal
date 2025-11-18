import type { NextConfig } from "next";

import nextBundleAnalyzer from "@next/bundle-analyzer";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
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
initOpenNextCloudflareForDev();
