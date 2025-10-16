import "server-only";

import {
  ACCOUNT_COLUMNS,
  COMMON_COLUMNS,
  SESSION_COLUMNS,
  TABLE_NAMES,
  USER_COLUMNS,
  VERIFICATION_COLUMNS,
} from "@/adapters/d1/constants";
import betterAuthAdapter from "@/adapters/better-auth";
import {
  AUTH_APP_NAME,
  RESET_PASSWORD_TOKEN_EXPIRY_IN,
} from "@/features/admin-auth/lib/constants";
import {
  sendInvitationEmail,
  sendRequestResetPasswordEmail,
} from "@/features/admin-auth/server/functions";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins/magic-link";
import { admin } from "better-auth/plugins";

/**
 * Initialize BetterAuth with D1 and Drizzle ORM
 */
export function getAuth(env: CloudflareEnv) {
  const database = betterAuthAdapter(env.DJAVACOAL_DB);

  return betterAuth({
    database,

    appName: AUTH_APP_NAME,
    baseURL: env.NEXT_PUBLIC_BASE_URL,
    basePath: env.BETTER_AUTH_BASE_PATH,
    secret: env.BETTER_AUTH_SECRET,

    /**
     * Define your models and their corresponding table/column names
     * to match your database schema.
     */
    user: {
      modelName: TABLE_NAMES.USERS,
      fields: {
        name: USER_COLUMNS.NAME,
        email: USER_COLUMNS.EMAIL,
        emailVerified: USER_COLUMNS.EMAIL_VERIFIED,
        image: USER_COLUMNS.IMAGE,
        role: USER_COLUMNS.ROLE,
        banned: USER_COLUMNS.BANNED,
        banReason: USER_COLUMNS.BAN_REASON,
        banExpires: USER_COLUMNS.BAN_EXPIRES,

        createdAt: COMMON_COLUMNS.CREATED_AT,
        updatedAt: COMMON_COLUMNS.UPDATED_AT,
      },
    },
    session: {
      modelName: TABLE_NAMES.SESSIONS,
      fields: {
        userId: SESSION_COLUMNS.USER_ID,
        token: SESSION_COLUMNS.TOKEN,
        expiresAt: SESSION_COLUMNS.EXPIRES_AT,
        ipAddress: SESSION_COLUMNS.IP_ADDRESS,
        userAgent: SESSION_COLUMNS.USER_AGENT,
        impersonatedBy: SESSION_COLUMNS.IMPERSONATED_BY,

        createdAt: COMMON_COLUMNS.CREATED_AT,
        updatedAt: COMMON_COLUMNS.UPDATED_AT,
      },
    },
    account: {
      modelName: TABLE_NAMES.ACCOUNTS,
      fields: {
        userId: ACCOUNT_COLUMNS.USER_ID,
        accountId: ACCOUNT_COLUMNS.ACCOUNT_ID,
        providerId: ACCOUNT_COLUMNS.PROVIDER_ID,
        accessToken: ACCOUNT_COLUMNS.ACCESS_TOKEN,
        refreshToken: ACCOUNT_COLUMNS.REFRESH_TOKEN,
        accessTokenExpiresAt: ACCOUNT_COLUMNS.ACCESS_TOKEN_EXPIRES_AT,
        refreshTokenExpiresAt: ACCOUNT_COLUMNS.REFRESH_TOKEN_EXPIRES_AT,
        scope: ACCOUNT_COLUMNS.SCOPE,
        idToken: ACCOUNT_COLUMNS.ID_TOKEN,
        password: ACCOUNT_COLUMNS.PASSWORD,

        createdAt: COMMON_COLUMNS.CREATED_AT,
        updatedAt: COMMON_COLUMNS.UPDATED_AT,
      },
    },
    verification: {
      modelName: TABLE_NAMES.VERIFICATIONS,
      fields: {
        identifier: VERIFICATION_COLUMNS.IDENTIFIER,
        value: VERIFICATION_COLUMNS.VALUE,
        expiresAt: VERIFICATION_COLUMNS.EXPIRES_AT,

        createdAt: COMMON_COLUMNS.CREATED_AT,
        updatedAt: COMMON_COLUMNS.UPDATED_AT,
      },
    },

    /**
     * Configure authentication methods
     */
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_EXPIRY_IN,
      async sendResetPassword({ user: { email: to }, url: link }) {
        sendRequestResetPasswordEmail({ to, link });
      },
    },

    /**
     * Add any BetterAuth plugins you want to use here.
     */
    plugins: [
      magicLink({
        expiresIn: 60 * 60 * 24,
        async sendMagicLink({ email: to, url: link }) {
          await sendInvitationEmail({ to, link });
        },
      }),
      admin(),
    ],
  });
}

export type Auth = ReturnType<typeof getAuth>;
