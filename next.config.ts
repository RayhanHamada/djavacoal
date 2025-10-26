import type { NextConfig } from "next";

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
                hostname: new URL(process.env.NEXT_PUBLIC_ASSET_URL).hostname,
            },
        ],
    },
};

/**
 * Wrap Next.js config with next-intl plugin (for i18n)
 */
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

/**
 * Initialize Cloudflare Workers dev environment
 */
initOpenNextCloudflareForDev();
