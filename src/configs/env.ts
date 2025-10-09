import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(["development", "production"]),

    NEXT_PUBLIC_ASSET_URL: z.url().optional(),
    NEXT_PUBLIC_BASE_URL: z.url().default("http://localhost:3000"),

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_BASE_PATH: z.string().default("/api/auth"),

    RESEND_API_KEY: z.string(),
  },
  server: {
    CLOUDFLARE_ACCOUNT_ID: z.string(),
    CLOUDFLARE_DATABASE_ID: z.uuid(),
    CLOUDFLARE_D1_TOKEN: z.string(),
  },
  client: {},

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_ASSET_URL: process.env.NEXT_PUBLIC_ASSET_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_BASE_PATH: process.env.BETTER_AUTH_BASE_PATH,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  emptyStringAsUndefined: true,
});
