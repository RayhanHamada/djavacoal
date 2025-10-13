"use server";

import { render } from "@react-email/components";
import {
  AdminInvitationEmail,
  AdminResetPasswordEmail,
} from "@/templates/emails";
import { getPlunk } from "@/lib/plunk";
import {
  EMAIL_SENDER_NAME,
  EMAIL_SUBJECT,
} from "@/features/admin-email/lib/constants";
import {
  InvitationEmailInputSchema,
  RequestResetPasswordEmailInputSchema,
} from "@/features/admin-email/actions/schema";
import base from "@/lib/orpc/server";

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
