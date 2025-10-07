import "server-only";

import { render } from "@react-email/components";
import {
  AdminInvitationEmail,
  AdminResetPasswordEmail,
} from "@/templates/emails";
import { plunk } from "@/lib/plunk";
import {
  EMAIL_SENDER_NAME,
  EMAIL_SUBJECT,
} from "@/features/admin-email/lib/constants";

export const sendAdminEmailActions = {
  async sendInvitationEmail(to: string, token: string) {
    const body = await render(
      <AdminInvitationEmail email={to} token={token} />
    );

    await plunk.emails.send({
      to,
      body,
      name: EMAIL_SENDER_NAME,
      subject: EMAIL_SUBJECT.INVITATION,
    });
  },

  async sendResetPasswordEmail(to: string, resetLink: string) {
    const body = await render(
      <AdminResetPasswordEmail resetLink={resetLink} />
    );

    await plunk.emails.send({
      to,
      body,
      name: EMAIL_SENDER_NAME,
      subject: EMAIL_SUBJECT.RESET_PASSWORD,
    });
  },
};
