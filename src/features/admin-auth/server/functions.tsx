import "server-only";

import { KV_KEYS } from "@/adapters/kv/constants";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import {
  InvitationEmailInputSchema,
  InviteAdminInputSchema,
  ListAdminInputSchema,
  ListAdminsOutputSchema,
  OnboardingInputSchema,
  RequestResetPasswordEmailInputSchema,
} from "@/features/admin-auth/server/schema";
import base from "@/lib/orpc/server";
import { headers } from "next/headers";
import {
  EMAIL_SENDER_NAME,
  EMAIL_SUBJECT,
} from "@/features/admin-auth/lib/constants";
import { getResend } from "@/adapters/email-service";
import {
  AdminInvitationEmail,
  AdminResetPasswordEmail,
} from "@/templates/emails";
import { getDB } from "@/adapters/d1/db";
import { and, count, like, ne, or, sql, SQL } from "drizzle-orm";
import { users } from "@/adapters/d1/schema";

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

/**
 * Send an invitation email to a new admin user
 */
export const sendInvitationEmail = base
  .input(InvitationEmailInputSchema)
  .handler(async function ({ context: { env }, input: { to, link } }) {
    const emailService = getResend(env.RESEND_API_KEY);
    await emailService.emails.send({
      to,
      react: <AdminInvitationEmail email={to} link={link} />,
      from: `${EMAIL_SENDER_NAME} <${env.SENDER_EMAIL}>`,
      subject: EMAIL_SUBJECT.INVITATION,
    });
  })
  .callable();

/**
 * Send a reset password email to an admin user
 */
export const sendRequestResetPasswordEmail = base
  .input(RequestResetPasswordEmailInputSchema)
  .handler(async function ({ context: { env }, input: { to, link } }) {
    const emailService = getResend(env.RESEND_API_KEY);
    await emailService.emails.send({
      to,
      react: <AdminResetPasswordEmail email={to} link={link} />,
      from: `${EMAIL_SENDER_NAME} <${env.SENDER_EMAIL}>`,
      subject: EMAIL_SUBJECT.RESET_PASSWORD,
    });
  })
  .callable();

/**
 * list all registered admin users
 */
export const listAllAdmins = base
  .input(ListAdminInputSchema)
  .output(ListAdminsOutputSchema)
  .handler(async function ({
    context: { env },
    input: { search = "", page, limit },
  }) {
    const header = await headers();
    const db = getDB(env.DJAVACOAL_DB);
    const auth = getAuth(env);
    const session = await auth.api.getSession({ headers: header });

    const currentUserId = session?.user?.id ?? "";

    const offset = (page - 1) * limit;
    const condition: SQL[] = [
      like(sql`lower(${users.email})`, `%${search}%`),
      like(sql`lower(${users.name})`, `%${search}%`),
    ];

    const admins = await db
      .select({
        data: users,
        total: count(),
      })
      .from(users)
      .where(and(ne(users.id, currentUserId), or(...condition)))
      .groupBy(users.id)
      .offset(offset)
      .limit(limit);

    return {
      admins: admins.map((v) => ({
        id: v.data.id,
        name: v.data.name,
        email: v.data.email,
        created_at: v.data.created_at!,
      })),
      total: admins.at(0)?.total ?? 0,
      page,
      pageSize: limit,
    };
  })
  .callable();

/**
 * Invite a new admin user via magic link
 * This will create a user account and send them an invitation email
 */
export const inviteAdmin = base
  .input(InviteAdminInputSchema)
  .handler(async function ({
    context: { env },
    input: { email, name },
    errors,
  }) {
    const header = await headers();
    const auth = getAuth(env);
    const db = getDB(env.DJAVACOAL_DB);

    // Check if user is authenticated
    const session = await auth.api.getSession({ headers: header });
    if (!session?.user) {
      throw errors.BAD_REQUEST({
        message: "You must be authenticated to invite admins",
      });
    }

    // Check if user with this email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(like(sql`lower(${users.email})`, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      throw errors.BAD_REQUEST({
        message: "An admin with this email already exists",
      });
    }

    // Send magic link invitation using Better Auth
    // The magic link plugin will create the user on first sign-in
    try {
      await auth.api.signInMagicLink({
        headers: header,
        body: {
          email,
          name,
          callbackURL: "/dashboard",
        },
      });
    } catch {
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to send invitation email",
      });
    }
  })
  .callable();
