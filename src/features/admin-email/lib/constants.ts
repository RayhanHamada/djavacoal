export const EMAIL_SENDER_NAME = "Djavacoal CMS";

export const EMAIL_SUBJECT = {
  INVITATION: "Djavacoal - Invitation to join Djavacoal CMS",
  RESET_PASSWORD: "Djavacoal - Reset Your Password",
} as const;

export const EMAIL_LINK_REDIRECTS = {
  INVITATION: "/auth/accept-invitation",
  RESET_PASSWORD: "/auth/reset-password",
} as const;

export const QUERY_PARAMS = {
  TOKEN: "token",
} as const;
