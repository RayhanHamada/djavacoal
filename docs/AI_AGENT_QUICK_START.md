# AI Coding Agent Quick Start Guide

Welcome! This guide helps AI coding agents quickly understand and work with the Djavacoal codebase.

## 🚀 Essential Information

### Project Type
- **Framework:** Next.js 15 (App Router)
- **Runtime:** Bun (not Node.js)
- **Deployment:** Cloudflare Workers via OpenNext adapter
- **Language:** TypeScript (strict mode)

### Critical: Read This First!
1. **Always check feature AGENTS.md files** at `src/features/<feature-name>/AGENTS.md`
2. **Never use NextAuth** - This project uses Better Auth exclusively
3. **Access Cloudflare bindings** via `getCloudflareContext({ async: true })`
4. **Column names are snake_case** - Map via constants, don't hardcode
5. **Store large content in R2**, not D1 database columns

## 📁 Project Structure

```
djavacoal/
├── src/
│   ├── features/              # Feature-based architecture
│   │   ├── dashboard-*/       # Admin features
│   │   ├── blog/              # Public features
│   │   └── public-api/        # API features
│   ├── adapters/              # External service adapters
│   │   ├── d1/                # Database (Drizzle ORM)
│   │   ├── r2/                # Object storage
│   │   ├── kv/                # Key-value store
│   │   ├── better-auth/       # Authentication adapter
│   │   ├── email-service/     # Email (Resend)
│   │   └── rpc/               # RPC router registration
│   ├── components/            # Global components
│   ├── lib/                   # Shared utilities
│   ├── i18n/                  # Internationalization
│   └── app/                   # Next.js routes
│       ├── (admin)/           # Protected admin routes
│       ├── (visitor)/         # Public routes
│       └── api/               # API routes
├── docs/                      # Documentation
│   ├── AGENTS_MD_GUIDE.md     # How to write AGENTS.md
│   ├── FEATURES_OVERVIEW.md   # All features explained
│   └── AI_AGENT_QUICK_START.md # This file
└── .github/
    └── copilot-instructions.md # Full project documentation
```

## 🎯 Quick Workflow

### Working with a Feature

1. **Read the AGENTS.md file**
   ```bash
   # Example: Working with products
   cat src/features/dashboard-product/AGENTS.md
   ```

2. **Understand the structure**
   - `components/` - UI components (atoms/molecules/organisms)
   - `hooks/` - React hooks
   - `lib/` - Constants, types, utilities
   - `server/` - RPC functions, schemas, helpers

3. **Check RPC registration**
   ```typescript
   // src/adapters/rpc/index.ts
   import { router as featureName } from "@/features/feature-name/server/router";
   ```

### Adding a New RPC Function

```typescript
// 1. Define schema in server/schemas.ts
export const INPUT_SCHEMA = z.object({
  name: z.string().min(1),
});

export const OUTPUT_SCHEMA = z.object({
  id: z.number(),
  success: z.boolean(),
});

// 2. Create function in server/functions.ts
import base from "@/lib/orpc/server";

export const myFunction = base
  .input(INPUT_SCHEMA)
  .output(OUTPUT_SCHEMA)
  .handler(async ({ context: { env }, input }) => {
    const db = getDB(env.DJAVACOAL_DB);
    // Your logic here
    return { id: 1, success: true };
  })
  .callable();

// 3. Export in server/router.ts
export const router = {
  myFunction,
  // other functions...
};

// 4. Register in src/adapters/rpc/index.ts
import { router as myFeature } from "@/features/my-feature/server/router";

const router = {
  myFeature,
  // other features...
};

// 5. Use in client
const { data } = rpc.myFeature.myFunction.useQuery({ name: "test" });
```

### Working with Database

```typescript
// 1. Update schema in src/adapters/d1/schema.ts
export const myTable = sqliteTable("my_table", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
});

// 2. Add constants in src/adapters/d1/constants.ts
export const MY_TABLE_COLUMNS = {
  NAME: "name",
  CREATED_AT: "created_at",
} as const;

// 3. Generate migration
bun d1:generate

// 4. Apply migration (choose based on environment)
bun d1:migrate:development  // or bun d1:migrate:production

// 5. Use in code
import { getDB } from "@/adapters/d1/db";
import { myTable } from "@/adapters/d1/schema";
import { MY_TABLE_COLUMNS } from "@/adapters/d1/constants";

const db = getDB(env.DJAVACOAL_DB);
const rows = await db
  .select()
  .from(myTable)
  .where(eq(myTable[MY_TABLE_COLUMNS.NAME], "test"));
```

### Uploading to R2

```typescript
// 1. Generate presigned URL (server-side)
import { generatePresignedUploadUrl } from "@/adapters/r2";

const { uploadUrl, key } = await generatePresignedUploadUrl(
  env.DJAVACOAL_BUCKET,
  "my-prefix",
  "image/jpeg"
);

// 2. Upload from browser (client-side)
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});

// 3. Save metadata to database
await db.insert(myTable).values({
  name: "My File",
  r2_key: key,
});
```

### Bilingual Content

```typescript
// Database: Store separate EN/AR fields
export const products = sqliteTable("products", {
  en_name: text("en_name").notNull(),
  ar_name: text("ar_name").notNull(),
  en_description: text("en_description").notNull(),
  ar_description: text("ar_description").notNull(),
});

// Display: Use locale to select field
import { useAppLocale } from "@/hooks/use-app-locale";
import { LOCALES } from "@/configs/constants";

function ProductName({ product }) {
  const locale = useAppLocale();
  const name = locale === LOCALES.AR ? product.ar_name : product.en_name;
  return <h1>{name}</h1>;
}

// UI Text: Use next-intl
import { useTranslations } from "next-intl";

function MyComponent() {
  const t = useTranslations("namespace");
  return <button>{t("buttonLabel")}</button>;
}
```

## 🔧 Common Commands

```bash
# Development
bun dev                    # Start dev server with Turbopack
bun start                  # Production server
bun lint                   # ESLint with auto-fix

# Database
bun d1:generate              # Generate migration from schema
bun d1:migrate:development   # Apply migrations to development D1
bun d1:migrate:production    # Apply migrations to production D1
bun d1:studio                # Open Drizzle Studio

# Cloudflare
bun cf:build               # Build for Workers
bun cf:deploy              # Deploy to Cloudflare
bun cf:typegen             # Regenerate env types

# Email
bun email:dev              # Preview email templates
```

## ⚠️ Common Pitfalls

### 1. Database Column Names
```typescript
// ❌ BAD - Hardcoded strings
await db.select().from(products).where(eq(products["en_name"], "test"));

// ✅ GOOD - Use constants
import { PRODUCT_COLUMNS } from "@/adapters/d1/constants";
await db.select().from(products).where(eq(products[PRODUCT_COLUMNS.EN_NAME], "test"));
```

### 2. Cloudflare Context
```typescript
// ❌ BAD - Using process.env
const db = getDB(process.env.DJAVACOAL_DB);

// ✅ GOOD - Use Cloudflare context
import { getCloudflareContext } from "@opennextjs/cloudflare";

const { env } = await getCloudflareContext({ async: true });
const db = getDB(env.DJAVACOAL_DB);
```

### 3. Content Storage
```typescript
// ❌ BAD - Large HTML in database
await db.insert(news).values({
  content: "<html>...</html>", // DON'T DO THIS
});

// ✅ GOOD - Store in R2
import { uploadTextContent } from "@/adapters/r2";

const contentKey = await uploadTextContent(
  env.DJAVACOAL_BUCKET,
  "news-content",
  "<html>...</html>"
);

await db.insert(news).values({
  content_key: contentKey, // Store only the key
});
```

### 4. RPC Registration
```typescript
// ❌ BAD - Function exists but not registered
// Feature works locally but fails in production

// ✅ GOOD - Always register in src/adapters/rpc/index.ts
import { router as myFeature } from "@/features/my-feature/server/router";

const router = {
  myFeature, // Must add here!
  // ...
};
```

### 5. Authentication
```typescript
// ❌ BAD - Using NextAuth (project doesn't use it)
import { getServerSession } from "next-auth";

// ✅ GOOD - Use Better Auth
import { getAuth } from "@/features/dashboard-auth/lib/better-auth-server";

const auth = getAuth(env);
const session = await auth.api.getSession({ headers });
```

## 📚 Key Documentation Files

| File                              | Purpose                        |
| --------------------------------- | ------------------------------ |
| `.github/copilot-instructions.md` | Complete project documentation |
| `docs/AGENTS_MD_GUIDE.md`         | How to write feature docs      |
| `docs/FEATURES_OVERVIEW.md`       | All features catalog           |
| `src/features/*/AGENTS.md`        | Individual feature docs        |

## 🎨 Code Style

### TypeScript
- Always use strict types
- No `any` types
- Define interfaces in `lib/types.ts`
- Use Zod for runtime validation

### Components
- Follow atomic design (atoms → molecules → organisms)
- Use barrel exports (`index.ts`)
- Add JSDoc comments
- PascalCase for components

### Naming
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.tsx`
- Database columns: `snake_case`

### Imports
```typescript
// Use @ alias
import { Component } from "@/features/feature-name";

// Not relative paths from deep files
import { Component } from "../../../../features/feature-name";
```

## 🔍 Finding Things

### "Where is the authentication logic?"
→ `src/features/dashboard-auth/AGENTS.md`

### "How do I add an RPC function?"
→ Check any feature's `server/functions.ts` and this guide

### "Where are database schemas?"
→ `src/adapters/d1/schema.ts`

### "How do I upload to R2?"
→ `src/adapters/r2/index.ts` or check `dashboard-gallery/AGENTS.md`

### "Where are the constants for X?"
→ Check feature's `lib/constants.ts` or `server/constants.ts`

### "How does bilingual content work?"
→ Check `blog/AGENTS.md` or `dashboard-news/AGENTS.md`

### "What RPC functions are available?"
→ Check `src/adapters/rpc/index.ts` for registered routers

## 🚦 Decision Tree

```
Need to add a feature?
├─ Is it admin-only?
│  └─ Create in src/features/dashboard-*
└─ Is it public?
   └─ Create in src/features/ (no dashboard prefix)

Need to store data?
├─ Is it structured data?
│  └─ Use D1 database
├─ Is it large content (HTML, images)?
│  └─ Use R2 storage
└─ Is it simple key-value?
   └─ Use KV store

Need to add an endpoint?
├─ Is it for internal use?
│  └─ Use RPC (oRPC)
└─ Is it for external consumers?
   └─ Add to public-api feature

Need to add authentication?
└─ Use Better Auth (see dashboard-auth/AGENTS.md)

Need to make it bilingual?
├─ Data content?
│  └─ Store en_field and ar_field in database
└─ UI text?
   └─ Add to src/i18n/messages/{locale}.json
```

## 💡 Pro Tips

1. **Always read AGENTS.md first** - It saves time and prevents mistakes
2. **Use existing patterns** - Check similar features for reference
3. **Test with both locales** - Always verify EN and AR work
4. **Clean up R2 objects** - When deleting database records
5. **Validate on server** - Never trust client-side validation alone
6. **Use TypeScript** - Types catch bugs before runtime
7. **Follow the conventions** - Consistency makes code maintainable

## 🆘 Troubleshooting

### Build fails
1. Check TypeScript errors: `bun run type-check`
2. Check linting: `bun lint`
3. Verify imports are correct
4. Check Cloudflare bindings in `wrangler.jsonc`

### RPC function not found
1. Check function is in `server/functions.ts`
2. Verify it's exported in `server/router.ts`
3. Confirm router is registered in `src/adapters/rpc/index.ts`
4. Ensure function is `.callable()` not `.actionable()`
5. Restart dev server

### Database errors
1. Check schema in `src/adapters/d1/schema.ts`
2. Verify migrations applied: `bun d1:migrate:development` or `bun d1:migrate:production`
3. Use constants for column names
4. Check Cloudflare context is available

### Authentication issues
1. Verify `BETTER_AUTH_SECRET` is set
2. Check session cookies in browser
3. Review Better Auth route handler
4. See `dashboard-auth/AGENTS.md`

## 📞 Next Steps

1. Read `.github/copilot-instructions.md` for full details
2. Browse `src/features/` and read AGENTS.md files
3. Check `docs/FEATURES_OVERVIEW.md` for feature catalog
4. Review `docs/AGENTS_MD_GUIDE.md` when creating docs
5. Start coding with confidence! 🚀

---

**Remember:** When in doubt, check the feature's AGENTS.md file!