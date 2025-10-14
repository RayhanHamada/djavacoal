"use server";

import { KV_KEYS } from "@/adapters/kv/constants";
import {
  OnboardingInputSchema,
  InviteAdminInputSchema,
  RemoveAdminInputSchema,
} from "@/features/admin-auth/actions/schema";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import base from "@/lib/orpc/server";
import { onSuccess } from "@orpc/client";
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
    const auth = getAuth(env);
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
    const auth = getAuth(env);
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

/**
 * TODO: Implement invite admin action
 * This action should:
 * 1. Validate the input (email and name)
 * 2. Check if the email is already registered
 * 3. Generate an invitation token
 * 4. Send invitation email using the email template (admin-invitation.tsx)
 * 5. Store the invitation token with expiration
 *
 * Server-side only - email sending must be done on the server
 */
export const inviteAdmin = base
  .input(InviteAdminInputSchema)
  .handler(async function ({
    context: { env: _env },
    input: { name, email },
    errors: _errors,
  }) {
    // TODO: Implement the following:
    // 1. Check if user already exists in the database
    // const existingUser = await db.select().from(users).where(eq(users.email, email));
    // if (existingUser.length > 0) {
    //   throw errors.BAD_REQUEST({ message: "User already exists" });
    // }

    // 2. Generate invitation token (you can use crypto.randomUUID() or similar)
    // const invitationToken = crypto.randomUUID();

    // 3. Store invitation in database with expiration (e.g., 7 days)
    // await db.insert(invitations).values({
    //   id: crypto.randomUUID(),
    //   email,
    //   name,
    //   token: invitationToken,
    //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    // });

    // 4. Send invitation email using Plunk or your email service
    // import { plunk } from "@/lib/plunk";
    // import { AdminInvitationEmail } from "@/templates/emails";
    // await plunk.emails.send({
    //   to: email,
    //   subject: "You've been invited to Djavacoal CMS",
    //   body: render(AdminInvitationEmail({ name, invitationLink: `${process.env.APP_URL}/auth/accept-invitation?token=${invitationToken}` })),
    // });

    // For now, just log
    console.log("Invite admin:", { name, email });

    return { success: true };
  })
  .actionable();

/**
 * TODO: Implement remove admin action
 * This action should:
 * 1. Validate the admin ID
 * 2. Check if the admin exists
 * 3. Prevent removing the last admin
 * 4. Remove the admin from the database
 * 5. Invalidate all sessions for that admin
 */
export const removeAdmin = base
  .input(RemoveAdminInputSchema)
  .handler(async function ({
    context: { env: _env },
    input: { id },
    errors: _errors,
  }) {
    // TODO: Implement the following:
    // 1. Get current authenticated user to prevent self-deletion
    // const auth = getAuth(env);
    // const header = await headers();
    // const session = await auth.api.getSession({ headers: header });
    // if (session?.user?.id === adminId) {
    //   throw errors.BAD_REQUEST({ message: "Cannot remove yourself" });
    // }

    // 2. Check if admin exists
    // const admin = await db.select().from(users).where(eq(users.id, adminId));
    // if (admin.length === 0) {
    //   throw errors.NOT_FOUND({ message: "Admin not found" });
    // }

    // 3. Check if this is the last admin (prevent removing last admin)
    // const adminCount = await db.select({ count: count() }).from(users);
    // if (adminCount[0].count <= 1) {
    //   throw errors.BAD_REQUEST({ message: "Cannot remove the last admin" });
    // }

    // 4. Remove admin
    // await db.delete(users).where(eq(users.id, adminId));

    // 5. Invalidate all sessions for that admin
    // await db.delete(sessions).where(eq(sessions.userId, adminId));

    // For now, just log
    console.log("Remove admin:", { id });

    return { success: true };
  })
  .actionable();
