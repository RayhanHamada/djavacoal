import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(["development", "production"]),

    /**
     * The base URL of the application, used for generating links in emails
     * and other places. This should be the full URL including the protocol.
     * For example: https://www.example.com
     */
    NEXT_PUBLIC_BASE_URL: z.url().default("http://localhost:3000"),

    /**
     * The URL where static assets are hosted. This can be a CDN or a different domain.
     * For example: https://assets.example.com
     */
    NEXT_PUBLIC_ASSET_URL: z.url().default("https://assets.djavacoal.com"),

    /**
     * The base URL of the Better Auth service. This is used for authentication requests.
     */
    BETTER_AUTH_URL: z.url(),

    /**
     * The base path for Better Auth routes. This is typically /api/auth.
     */
    BETTER_AUTH_BASE_PATH: z.string().default("/api/auth"),
  },
  server: {
    /**
     * The Cloudflare account ID where the D1 database is hosted.
     */
    CLOUDFLARE_ACCOUNT_ID: z.string(),

    /**
     * The Cloudflare D1 database ID.
     */
    CLOUDFLARE_DATABASE_ID: z.uuid(),

    /**
     * The Cloudflare D1 token with appropriate permissions to access the database.
     */
    CLOUDFLARE_D1_TOKEN: z.string(),

    /**
     * The secret used to sign and verify tokens for Better Auth.
     */
    BETTER_AUTH_SECRET: z.string(),

    /**
     * The API key for Resend, used for sending emails.
     */
    RESEND_API_KEY: z.string(),
  },
  client: {},

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_ASSET_URL: process.env.NEXT_PUBLIC_ASSET_URL,
    NEXT_PUBLIC_BASE_URL:
      process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL,

    BETTER_AUTH_URL:
      process.env.CF_PAGES_URL ||
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_BASE_URL,

    BETTER_AUTH_BASE_PATH: process.env.BETTER_AUTH_BASE_PATH,
  },
  emptyStringAsUndefined: true,
});
