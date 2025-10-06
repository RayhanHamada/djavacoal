"use client";

import { env } from "@/configs";
import type { Auth } from "@/lib/auth/server";
import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  basePath: env.BETTER_AUTH_BASE_PATH,

  plugins: [inferAdditionalFields<Auth>(), emailOTPClient()],
});
