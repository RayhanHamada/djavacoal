import type { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: new URL(process.env.NEXT_PUBLIC_ASSET_URL).hostname,
            },
        ],
    },
};

/**
 * Wrap the Next.js config with the next-intl plugin
 * to enable internationalization support
 */
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

/**
 * Initialize OpenNext Cloudflare for development environment
 * to enable Cloudflare Workers support when running
 * `wrangler dev` command
 */
initOpenNextCloudflareForDev();
