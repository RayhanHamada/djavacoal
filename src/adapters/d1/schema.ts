import {
  ACCOUNT_COLUMNS,
  COMMON_COLUMNS,
  SESSION_COLUMNS,
  TABLE_NAMES,
  USER_COLUMNS,
  VERIFICATION_COLUMNS,
} from "@/adapters/d1/constants";
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * default values used in the schema
 */
const DEFAULTS = {
  CURRENT_TIMESTAMP: sql`CURRENT_TIMESTAMP`,
} as const;

/**
 * common fields for all tables
 */
const COMMON_FIELDS = {
  [COMMON_COLUMNS.CREATED_AT]: integer(COMMON_COLUMNS.CREATED_AT, {
    mode: "timestamp",
  }).default(DEFAULTS.CURRENT_TIMESTAMP),
  [COMMON_COLUMNS.UPDATED_AT]: integer(COMMON_COLUMNS.UPDATED_AT, {
    mode: "timestamp",
  }).default(DEFAULTS.CURRENT_TIMESTAMP),
};

/**
 * table used by better-auth to store users
 */

export const user = sqliteTable(TABLE_NAMES.USERS, {
  /**
   * primary key for the user table
   */
  [COMMON_COLUMNS.ID]: text(COMMON_COLUMNS.ID).primaryKey(),

  [USER_COLUMNS.NAME]: text(USER_COLUMNS.NAME).notNull(),
  [USER_COLUMNS.EMAIL]: text(USER_COLUMNS.EMAIL).notNull().unique(),
  [USER_COLUMNS.EMAIL_VERIFIED]: integer(USER_COLUMNS.EMAIL_VERIFIED, {
    mode: "boolean",
  }).default(false),
  [USER_COLUMNS.IMAGE]: text(USER_COLUMNS.IMAGE),

  ...COMMON_FIELDS,
});

export const session = sqliteTable(TABLE_NAMES.SESSIONS, {
  /**
   * primary key for the session table
   */
  [COMMON_COLUMNS.ID]: text(COMMON_COLUMNS.ID).primaryKey(),

  /**
   * references the user table (id)
   */
  [SESSION_COLUMNS.USER_ID]: text(SESSION_COLUMNS.USER_ID)
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  [SESSION_COLUMNS.TOKEN]: text(SESSION_COLUMNS.TOKEN).notNull().unique(),
  [SESSION_COLUMNS.EXPIRES_AT]: integer(SESSION_COLUMNS.EXPIRES_AT, {
    mode: "timestamp",
  }).notNull(),
  [SESSION_COLUMNS.IP_ADDRESS]: text(SESSION_COLUMNS.IP_ADDRESS),
  [SESSION_COLUMNS.USER_AGENT]: text(SESSION_COLUMNS.USER_AGENT),

  ...COMMON_FIELDS,
});

export const account = sqliteTable(TABLE_NAMES.ACCOUNTS, {
  /**
   * primary key for the account table
   */
  [COMMON_COLUMNS.ID]: text(COMMON_COLUMNS.ID).primaryKey(),

  /**
   * references the user table (id)
   */
  [ACCOUNT_COLUMNS.USER_ID]: text(ACCOUNT_COLUMNS.USER_ID)
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  [ACCOUNT_COLUMNS.ACCOUNT_ID]: text(ACCOUNT_COLUMNS.ACCOUNT_ID).notNull(),
  [ACCOUNT_COLUMNS.PROVIDER_ID]: text(ACCOUNT_COLUMNS.PROVIDER_ID).notNull(),
  [ACCOUNT_COLUMNS.ACCESS_TOKEN]: text(ACCOUNT_COLUMNS.ACCESS_TOKEN),
  [ACCOUNT_COLUMNS.REFRESH_TOKEN]: text(ACCOUNT_COLUMNS.REFRESH_TOKEN),
  [ACCOUNT_COLUMNS.ACCESS_TOKEN_EXPIRES_AT]: integer(
    ACCOUNT_COLUMNS.ACCESS_TOKEN_EXPIRES_AT,
    { mode: "timestamp" }
  ),
  [ACCOUNT_COLUMNS.REFRESH_TOKEN_EXPIRES_AT]: integer(
    ACCOUNT_COLUMNS.REFRESH_TOKEN_EXPIRES_AT,
    {
      mode: "timestamp",
    }
  ),
  [ACCOUNT_COLUMNS.SCOPE]: text(ACCOUNT_COLUMNS.SCOPE),
  [ACCOUNT_COLUMNS.ID_TOKEN]: text(ACCOUNT_COLUMNS.ID_TOKEN),
  [ACCOUNT_COLUMNS.PASSWORD]: text(ACCOUNT_COLUMNS.PASSWORD),

  ...COMMON_FIELDS,
});

export const verification = sqliteTable(TABLE_NAMES.VERIFICATIONS, {
  /**
   * primary key for the verification table
   */
  [COMMON_COLUMNS.ID]: text(COMMON_COLUMNS.ID).primaryKey(),

  [VERIFICATION_COLUMNS.IDENTIFIER]: text(
    VERIFICATION_COLUMNS.IDENTIFIER
  ).notNull(),
  [VERIFICATION_COLUMNS.VALUE]: text(VERIFICATION_COLUMNS.VALUE).notNull(),
  [VERIFICATION_COLUMNS.EXPIRES_AT]: integer(VERIFICATION_COLUMNS.EXPIRES_AT, {
    mode: "timestamp",
  }).notNull(),

  ...COMMON_FIELDS,
});
