"use server";

import { KV_KEYS } from "@/adapters/kv/constants";
import {
  CheckIfAlreadyOnboardedOutputSchema,
  GetAuthSessionOutputSchema,
  OnboardingInputSchema,
} from "@/features/admin-auth/actions/schema";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import { safeActionClient } from "@/lib/next-safe-action-client";
import { headers } from "next/headers";

export const onboardAdmin = safeActionClient
  .inputSchema(OnboardingInputSchema)
  .action(async function ({
    clientInput: { name, email, password },
    ctx: { env },
  }) {
    const onboarded = await env.DJAVACOAL_KV.get(
      KV_KEYS.IS_ALREADY_ONBOARDED,
      "json"
    );

    if (onboarded) {
      throw new Error("Admin user already exists");
    }

    const auth = getAuth(env.DJAVACOAL_DB);
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    await env.DJAVACOAL_KV.put(
      KV_KEYS.IS_ALREADY_ONBOARDED,
      JSON.stringify(true)
    );
  });

export const checkIfAlreadyOnboarded = safeActionClient
  .outputSchema(CheckIfAlreadyOnboardedOutputSchema)
  .action(async function ({ ctx: { env } }) {
    const onboarded = await env.DJAVACOAL_KV.get(
      KV_KEYS.IS_ALREADY_ONBOARDED,
      "json"
    );

    return {
      onboarded: Boolean(onboarded),
    };
  });

export const getAuthSession = safeActionClient
  .outputSchema(GetAuthSessionOutputSchema)
  .action(async function ({ ctx: { env } }) {
    const auth = getAuth(env.DJAVACOAL_DB);
    const header = await headers();

    const session = await auth.api.getSession({ headers: header });

    return {
      session,
      user: session?.user,
    };
  });
