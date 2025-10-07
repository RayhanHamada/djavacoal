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
import { betterAuth, BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const plugins: BetterAuthPlugin[] = [];

export const getAuth = (db: D1Database) =>
  betterAuth({
    database: drizzleAdapter(getDB(db), {
      provider: "sqlite",
    }),
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
    emailAndPassword: {
      enabled: true,
    },

    plugins,
  });

export type Auth = ReturnType<typeof getAuth>;
