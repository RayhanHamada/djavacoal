import type { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "img.youtube.com",
            "i.ytimg.com",
            "ytimg.googleusercontent.com",
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "flagsapi.com",
                pathname: "/**",
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
