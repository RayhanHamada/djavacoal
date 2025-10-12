"use server";

import { getDB } from "@/adapters/d1/db";
import { OnboardingInputSchema } from "@/features/admin-auth/actions/schema";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import { safeActionClient } from "@/lib/next-safe-action-client";

export const onboardAdmin = safeActionClient
  .inputSchema(OnboardingInputSchema)
  .action(async function ({
    clientInput: { name, email, password },
    ctx: { env },
  }) {
    const db = getDB(env.DJAVACOAL_DB);
    const first = await db.query.users.findFirst({ columns: { id: true } });
    if (first) {
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
  });
