import type { NextConfig } from "next";

import nextBundleAnalyzer from "@next/bundle-analyzer";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: new URL(process.env.NEXT_PUBLIC_ASSET_URL).hostname,
            },
            {
                hostname: "img.youtube.com",
            },
        ],
    },
};

/**
 * Wrap the Next.js config with the next-intl plugin
 * to enable internationalization support
 */
const withNextIntl = createNextIntlPlugin();
const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withNextIntl(nextConfig));

/**
 * Initialize OpenNext Cloudflare for development environment
 * to enable Cloudflare Workers support when running
 * `wrangler dev` command
 */
initOpenNextCloudflareForDev();
