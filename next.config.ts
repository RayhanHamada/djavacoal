import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { createJiti } from "jiti";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "node:path";

/**
 * create jiti and validate env.ts file
 * to ensure that the environment variables
 * are properly typed when running next.js
 * commands such as `next dev`, `next build`, etc.
 *
 * Note: this must be done before exporting
 * the next.js config object
 */
const jiti = createJiti(import.meta.url);
jiti.import(path.resolve(process.cwd(), "src/configs/env.ts"));

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
