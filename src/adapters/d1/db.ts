import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/adapters/d1/schema";

export const getDB = (db: D1Database) =>
  drizzle(db, {
    schema,
    casing: "snake_case",
  });
