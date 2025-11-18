import config from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "node:path";
import process from "node:process";

config.config({
    path: path.resolve(process.cwd(), ".env"),
});

export default defineConfig({
    out: "./src/adapters/d1/migrations",
    schema: "./src/adapters/d1/schema.ts",
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
        token: process.env.CLOUDFLARE_API_TOKEN!,
    },
});
