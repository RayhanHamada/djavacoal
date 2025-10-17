import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
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
