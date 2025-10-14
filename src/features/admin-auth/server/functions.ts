import "server-only";

import { KV_KEYS } from "@/adapters/kv/constants";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import { OnboardingInputSchema } from "@/features/admin-auth/server/schema";
import base from "@/lib/orpc/server";
import { headers } from "next/headers";

export const onboardAdmin = base
  .input(OnboardingInputSchema)
  .handler(async function ({
    context: { env },
    input: { name, email, password },
    errors,
  }) {
    const onboarded = await env.DJAVACOAL_KV.get(
      KV_KEYS.IS_ALREADY_ONBOARDED,
      "json"
    );

    if (onboarded) {
      throw errors.BAD_REQUEST({
        message: "Admin user already exists",
      });
    }

    const auth = getAuth(env);
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
  })
  .callable();

export const redirectJoinedUser = base
  .handler(async function ({ context: { env } }) {
    const onboarded = await env.DJAVACOAL_KV.get(
      KV_KEYS.IS_ALREADY_ONBOARDED,
      "json"
    );

    return {
      onboarded: !!onboarded,
    };
  })
  .callable();

export const redirectUnauthenticatedUser = base
  .handler(async function ({ context: { env } }) {
    const auth = getAuth(env);
    const header = await headers();
    const session = await auth.api.getSession({ headers: header });

    return {
      user: session?.user,
    };
  })
  .callable();

export const redirectAuthenticatedUser = base
  .handler(async function ({ context: { env } }) {
    const auth = getAuth(env);
    const header = await headers();
    const session = await auth.api.getSession({ headers: header });

    return {
      user: session?.user,
    };
  })
  .callable();
