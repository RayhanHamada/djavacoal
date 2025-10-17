import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { getDB } from "@/adapters/d1/db";

export default function betterAuthAdapter(db: D1Database) {
    return drizzleAdapter(getDB(db), { provider: "sqlite" });
}
