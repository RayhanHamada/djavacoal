import "server-only";

import { KV_KEYS } from "@/adapters/kv/constants";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import {
  InvitationEmailInputSchema,
  OnboardingInputSchema,
  RequestResetPasswordEmailInputSchema,
} from "@/features/admin-auth/server/schema";
import base from "@/lib/orpc/server";
import { headers } from "next/headers";
import { render } from "@react-email/components";
import {
  EMAIL_SENDER_NAME,
  EMAIL_SUBJECT,
} from "@/features/admin-auth/lib/constants";
import { getPlunk } from "@/lib/plunk";
import {
  AdminInvitationEmail,
  AdminResetPasswordEmail,
} from "@/templates/emails";

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
    const body = await render(<AdminInvitationEmail email={to} link={link} />);

    const plunk = getPlunk(env.RESEND_API_KEY);
    await plunk.emails.send({
      to,
      body,
      name: EMAIL_SENDER_NAME,
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
    const body = await render(
      <AdminResetPasswordEmail email={to} link={link} />
    );

    const plunk = getPlunk(env.RESEND_API_KEY);
    await plunk.emails.send({
      to,
      body,
      name: EMAIL_SENDER_NAME,
      subject: EMAIL_SUBJECT.RESET_PASSWORD,
    });
  })
  .callable();
