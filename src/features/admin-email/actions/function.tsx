"use server";

import { render } from "@react-email/components";
import {
  AdminInvitationEmail,
  AdminResetPasswordEmail,
} from "@/templates/emails";
import { plunk } from "@/lib/plunk";
import {
  EMAIL_LINK_REDIRECTS,
  EMAIL_SENDER_NAME,
  EMAIL_SUBJECT,
  QUERY_PARAMS,
} from "@/features/admin-email/lib/constants";
import { safeActionClient } from "@/lib/next-safe-action-client";
import {
  InvitationEmailInputSchema,
  RequestResetPasswordEmailInputSchema,
} from "@/features/admin-email/actions/schema";

/**
 * Send an invitation email to a new admin user
 */
export const sendInvitationEmail = safeActionClient
  .inputSchema(InvitationEmailInputSchema)
  .action(async function ({ clientInput: { to, token } }) {
    const url = new URL(
      EMAIL_LINK_REDIRECTS.INVITATION,
      process.env.NEXT_PUBLIC_BASE_URL
    );

    url.searchParams.set(QUERY_PARAMS.TOKEN, token);

    const link = url.toString();

    const body = await render(<AdminInvitationEmail email={to} link={link} />);
    await plunk.emails.send({
      to,
      body,
      name: EMAIL_SENDER_NAME,
      subject: EMAIL_SUBJECT.INVITATION,
    });
  });

/**
 * Send a reset password email to an admin user
 */
export const sendRequestResetPasswordEmail = safeActionClient
  .inputSchema(RequestResetPasswordEmailInputSchema)
  .action(async function ({ clientInput: { to, token } }) {
    const url = new URL(
      EMAIL_LINK_REDIRECTS.RESET_PASSWORD,
      process.env.NEXT_PUBLIC_BASE_URL
    );

    url.searchParams.set(QUERY_PARAMS.TOKEN, token);

    const link = url.toString();

    const body = await render(
      <AdminResetPasswordEmail email={to} link={link} />
    );
    await plunk.emails.send({
      to,
      body,
      name: EMAIL_SENDER_NAME,
      subject: EMAIL_SUBJECT.RESET_PASSWORD,
    });
  });
