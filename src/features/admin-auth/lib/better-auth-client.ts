"use client";

import { env } from "@/configs";
import type { Auth } from "@/features/admin-auth/lib/better-auth-server";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const client = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  basePath: env.BETTER_AUTH_BASE_PATH,

  plugins: [inferAdditionalFields<Auth>()],
});
