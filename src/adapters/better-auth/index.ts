import { db } from "@/adapters/d1/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const database = drizzleAdapter(db, {
  provider: "sqlite",
});
