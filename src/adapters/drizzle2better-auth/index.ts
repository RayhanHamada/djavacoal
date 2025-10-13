import { getDB } from "@/adapters/d1/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const drizzle2BetterAuthAdapter = (db: D1Database) =>
  drizzleAdapter(getDB(db), { provider: "sqlite" });

export default drizzle2BetterAuthAdapter;
