/**
 * Application name for BetterAuth
 */
export const AUTH_APP_NAME = "Djavacoal CMS";

/**
 * Reset password token expiry time in milliseconds (e.g., 24 hours)
 */
export const RESET_PASSWORD_TOKEN_EXPIRY_IN = 1000 * 60 * 60 * 24;

export const EMAIL_SENDER_NAME = "Djavacoal CMS";

export const EMAIL_SUBJECT = {
    INVITATION: "Djavacoal - Invitation to join Djavacoal CMS",
    RESET_PASSWORD: "Djavacoal - Reset Your Password",
} as const;
