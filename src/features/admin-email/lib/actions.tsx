import "server-only";

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

/**
 * Actions related to sending admin emails
 */
export const adminEmailActions = {
  /**
   * Send an invitation email to a new admin user
   */
  async sendInvitationEmail(to: string, token: string) {
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
  },

  /**
   * Send a reset password email to an admin user
   */
  async sendResetPasswordEmail(to: string, token: string) {
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
  },
};
