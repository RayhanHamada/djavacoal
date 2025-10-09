import "server-only";

import {
  TABLE_NAMES,
  ACCOUNT_COLUMNS,
  COMMON_COLUMNS,
  SESSION_COLUMNS,
  USER_COLUMNS,
  VERIFICATION_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { AUTH_APP_NAME } from "@/features/admin-auth/lib/constants";
import { adminEmailActions } from "@/features/admin-email/lib";
import { env } from "process";

export function getAuth(db: D1Database) {
  return betterAuth({
    database: drizzleAdapter(getDB(db), { provider: "sqlite" }),

    appName: AUTH_APP_NAME,
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

    plugins: [],

    emailAndPassword: {
      enabled: true,
      async sendResetPassword({ token, user: { email } }) {
        const link = `${env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${encodeURIComponent(token)}`;

        await adminEmailActions.sendResetPasswordEmail(email, link);
      },
    },
  });
}

export type Auth = ReturnType<typeof getAuth>;
