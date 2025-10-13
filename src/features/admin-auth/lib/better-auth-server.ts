import "server-only";

import {
  ACCOUNT_COLUMNS,
  COMMON_COLUMNS,
  SESSION_COLUMNS,
  TABLE_NAMES,
  USER_COLUMNS,
  VERIFICATION_COLUMNS,
} from "@/adapters/d1/constants";
import drizzle2BetterAuthAdapter from "@/adapters/drizzle2better-auth";
import { env } from "@/configs";
import {
  AUTH_APP_NAME,
  RESET_PASSWORD_TOKEN_EXPIRY_IN,
} from "@/features/admin-auth/lib/constants";
import * as emailActions from "@/features/admin-email/actions/function";
import { betterAuth } from "better-auth";

/**
 * Initialize BetterAuth with D1 and Drizzle ORM
 */
export function getAuth(db: D1Database) {
  const database = drizzle2BetterAuthAdapter(db);

  return betterAuth({
    database,

    appName: AUTH_APP_NAME,
    baseURL: env.BETTER_AUTH_URL,
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
      async sendResetPassword({ token, user: { email: to } }) {
        emailActions.sendRequestResetPasswordEmail({ to, token });
      },
      resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_EXPIRY_IN,
      autoSignIn: false,
    },

    /**
     * Add any BetterAuth plugins you want to use here.
     */
    plugins: [],
  });
}

export type Auth = ReturnType<typeof getAuth>;
