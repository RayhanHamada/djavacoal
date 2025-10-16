"use client";

import type { Auth } from "@/features/admin-auth/lib/better-auth-server";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { magicLinkClient, adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  basePath: "/api/auth",

  plugins: [inferAdditionalFields<Auth>(), magicLinkClient(), adminClient()],
});
