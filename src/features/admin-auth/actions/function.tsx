"use server";

import { KV_KEYS } from "@/adapters/kv/constants";
import {
  CheckIfAlreadyOnboardedOutputSchema,
  GetAuthSessionOutputSchema,
  OnboardingInputSchema,
} from "@/features/admin-auth/actions/schema";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import base from "@/lib/orpc/server";
import { onError, onSuccess } from "@orpc/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
  })
  .callable()
  .actionable({
    interceptors: [
      onSuccess(async function () {
        redirect("/auth/login");
      }),
    ],
  });

export const checkIfAlreadyOnboarded = base
  .handler(async function ({ context: { env } }) {
    const onboarded = await env.DJAVACOAL_KV.get(
      KV_KEYS.IS_ALREADY_ONBOARDED,
      "json"
    );

    return {
      onboarded: !!onboarded,
    };
  })
  .actionable({
    interceptors: [
      onSuccess(async function ({ onboarded }) {
        if (onboarded) redirect("/auth/login");
      }),
    ],
  });

export const guardAuthenticatedRoute = base
  .handler(async function ({ context: { env } }) {
    const auth = getAuth(env.DJAVACOAL_DB);
    const header = await headers();

    const session = await auth.api.getSession({ headers: header });

    return {
      user: session?.user,
    };
  })
  .actionable({
    interceptors: [
      onSuccess(async function ({ user }) {
        if (!user) redirect("/auth/login");
      }),
    ],
  });

export const redirectAuthenticatedUser = base
  .handler(async function ({ context: { env } }) {
    const auth = getAuth(env.DJAVACOAL_DB);
    const header = await headers();

    const session = await auth.api.getSession({ headers: header });

    return {
      user: session?.user,
    };
  })
  .actionable({
    interceptors: [
      onSuccess(async function ({ user }) {
        if (user) redirect("/dashboard");
      }),
    ],
  });
