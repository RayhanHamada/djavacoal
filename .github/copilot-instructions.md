# Djavacoal - AI Coding Agent Instructions

## Project Overview

Next.js 15 application deployed to Cloudflare Workers using OpenNext adapter. Features admin authentication, i18n support, and a feature-based architecture with type-safe RPC.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript + Bun runtime
- **Deployment**: Cloudflare Workers via `@opennextjs/cloudflare`
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 (S3-compatible) via AWS SDK v3
- **Auth**: Better Auth (NOT NextAuth) with custom D1 adapter
- **RPC**: oRPC for type-safe client-server communication
- **UI**: Mantine v8 + Tailwind CSS v4 + Framer Motion
- **i18n**: next-intl (cookie-based locale storage)
- **Email**: Resend with react-email templates

## Critical Architecture Patterns

### Cloudflare Context Access

All Cloudflare bindings (D1, KV, R2) accessed via `getCloudflareContext()`:

```typescript
// In Route Handlers or Server Functions
import { getCloudflareContext } from "@opennextjs/cloudflare";

const { env } = await getCloudflareContext({ async: true });
const db = getDB(env.DJAVACOAL_DB); // D1 database
```

**Environment bindings** defined in `wrangler.jsonc` and typed in `cloudflare-env.d.ts` (regenerate with `bun cf:typegen`).

### Feature-Based Organization

Features live in `src/features/<feature-name>/` with subfolders:

- `components/` - React components (atoms/molecules/organism pattern)
- `hooks/` - Custom React hooks
- `lib/` - Business logic, utilities, constants
- `server/` - Server-side functions, RPC routers, schemas

**Export pattern**: Each subfolder has `index.ts` for barrel exports.

### RPC System (oRPC)

Type-safe client-server communication without API route boilerplate. RPC functions can be **callable** (for client-side hooks) or **actionable** (for Server Actions with redirects).

**Server-side** (`src/features/<feature>/server/`):

```typescript
// functions.ts - Define server functions
export const myFunction = base
    .input(MyInputSchema)
    .output(MyOutputSchema) // Optional but recommended
    .handler(async ({ context: { env }, input }) => {
        const db = getDB(env.DJAVACOAL_DB);
        // Business logic here
        return { data: "..." };
    })
    .callable(); // For RPC calls

// For Server Actions with redirects:
export const myAction = base
    .input(MyInputSchema)
    .handler(async ({ input }) => {
        // Logic here
        return { success: true };
    })
    .actionable({
        interceptors: [
            onSuccess(async function (data) {
                redirect("/dashboard"); // Next.js redirect
            }),
        ],
    });

// router.ts - Export router
export const router = {
    myFunction,
    // Don't include actionable functions here
};
```

**Register** callable functions in `src/adapters/rpc/index.ts`:

```typescript
import { router as myFeature } from "@/features/my-feature/server/router";

const router = {
    myFeature, // Add your feature router
};
```

**Client-side** usage:

```typescript
import { rpc } from "@/lib/rpc";

// For callable functions (TanStack Query hooks)
const { data } = rpc.myFeature.myFunction.useQuery({ input: {...} });
const mutation = rpc.myFeature.myFunction.useMutation();

// For actionable functions (Server Actions)
import { myActionActions } from "@/features/my-feature/server/actions";
await myActionActions({ input: {...} }); // Triggers redirect on success
```

**RPC Route Handler**: `src/app/api/rpc/[...rest]/route.ts` handles all HTTP methods (GET, POST, etc.) by delegating to `src/adapters/rpc/index.ts`.

### Better Auth Integration

Custom Better Auth setup with D1 adapter in `src/adapters/better-auth/index.ts`:

1. **Server instance**: `src/features/admin-auth/lib/better-auth-server.ts` exports `getAuth(env)` function
2. **Route handler**: `src/app/api/auth/[...all]/route.ts` uses `toNextJsHandler` with Cloudflare context
3. **Custom field mapping**: Maps Better Auth fields to snake_case D1 columns via constants in `src/adapters/d1/constants.ts`
4. **Plugins**: Uses `admin` and `magicLink` plugins with custom email templates
5. **D1 Adapter**: `betterAuthAdapter(env.DJAVACOAL_DB)` wraps Drizzle adapter with SQLite provider

**Authentication Flows:**

**Magic Link (Admin Invitation):**

```typescript
// Server: Better Auth configured with magicLink plugin
plugins: [
    magicLink({
        expiresIn: 60 * 60 * 24, // 24 hours
        async sendMagicLink({ email: to, url: link }) {
            await sendInvitationEmail({ to, link });
        },
    }),
];

// Usage: Invite admin via RPC
rpc.admins.inviteAdmin.useMutation({
    onSuccess: () => {
        // Magic link email sent automatically
    },
});
```

**Password Reset Flow:**

```typescript
// Server: Configured in emailAndPassword settings
emailAndPassword: {
  enabled: true,
  resetPasswordTokenExpiresIn: 1000 * 60 * 60 * 24, // 24 hours
  async sendResetPassword({ user: { email: to }, url: link }) {
    sendRequestResetPasswordEmail({ to, link });
  },
}

// Client: Request password reset
await client.forgetPassword({ email });

// Client: Reset with token (from email link)
await client.resetPassword({ newPassword, token });
```

**Email Templates**: React Email components in `src/templates/emails/`:

- `AdminInvitationEmail` - Magic link invitation
- `AdminResetPasswordEmail` - Password reset

### Database Patterns (Drizzle + D1)

- **Schema**: `src/adapters/d1/schema.ts` defines all tables with snake_case columns
- **Constants**: `src/adapters/d1/constants.ts` maps table/column names for consistency
- **Migrations**: Generated via `bun d1:generate`, applied with `bun d1:migrate:djavacoal`
- **DB Access**: Always use `getDB(env.DJAVACOAL_DB)` from `src/adapters/d1/db.ts`

### Internationalization (i18n)

- **Locale storage**: Cookie-based (not URL-based), set via `locale` cookie
- **Messages**: JSON files in `src/i18n/messages/{locale}.json`
- **Config**: `src/i18n/request.ts` reads locale from cookies
- **Usage**: `useTranslations()` hook from `next-intl`

### Component Organization

Global components in `src/components/` follow Atomic Design:

- `atoms/` - Basic UI elements
- `molecules/` - Composite components
- `organism/` - Complex sections
- `layouts/` - Page layouts (AdminLayout, VisitorLayout)

Two provider layers:

- `ServerGlobalProvider` - Server-side context (fonts, metadata)
- `ClientGlobalProvider` - Client-side (TanStack Query with devtools)

Note: Mantine provider is in root layout, not in ClientGlobalProvider.

## Development Workflows

### Local Development

```bash
bun dev                    # Next.js dev server with Turbopack
bun start                  # Start production Next.js server
bun lint                   # Run ESLint with auto-fix and caching
```

### Database Management

```bash
bun d1:generate            # Generate migration from schema changes
bun d1:migrate:djavacoal   # Apply D1 migrations to remote database
bun d1:studio              # Open Drizzle Studio for DB inspection
```

### Email Development

```bash
bun email:dev              # Preview email templates in browser
bun email:build            # Build email templates
```

### Cloudflare Workflows

```bash
bun cf:build               # Build for Cloudflare Workers deployment
bun cf:deploy              # Deploy to Cloudflare
bun cf:preview             # Preview deployment
bun cf:typegen             # Regenerate CloudflareEnv types from wrangler.jsonc
wrangler dev               # Run with Cloudflare bindings locally (alternative to bun dev)
```

### Database Schema Changes

1. Modify `src/adapters/d1/schema.ts`
2. Run `bun d1:generate` to create migration file
3. Run `bun d1:migrate:djavacoal` to apply to remote database

## Key Conventions

### Imports

- Use `@/` path alias (maps to `src/`)
- Prefer barrel exports via `index.ts` files
- Server-only code: Add `import "server-only"` at top

### Route Groups

- `(admin)/` - Protected admin routes, uses `AdminLayout`
- `(visitor)/` - Public routes, uses `VisitorLayout`
- `api/` - API routes (auth, RPC)

### Styling

- Tailwind for layout/spacing
- Mantine components for UI (configured in `src/lib/mantine-theme.ts`)
- Custom fonts: Josefin Sans (headings) + Open Sans (body) in `src/configs/fonts.ts`

### Error Handling in oRPC

Define custom errors in `src/lib/orpc/server.ts`:

```typescript
const base = os.errors({
    NOT_FOUND: { message: "..." },
    BAD_REQUEST: {},
});
```

Throw in handlers:

```typescript
throw errors.BAD_REQUEST({ message: "Custom error" });
```

## Environment Variables

**Required Environment Variables** (defined in `cloudflare-env.d.ts`, set in `.dev.vars` for local development):

```bash
# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000/
NEXT_PUBLIC_ASSET_URL=http://localhost:3000/

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_BASE_PATH=/api/auth

# Email Service (Resend)
RESEND_API_KEY=re_your_api_key
SENDER_EMAIL=noreply@yourdomain.com

# Cloudflare (for migrations/drizzle studio)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_DATABASE_ID=your-database-id
CLOUDFLARE_D1_TOKEN=your-d1-token
```

**Bindings** (configured in `wrangler.jsonc`, typed in `cloudflare-env.d.ts`):

- `DJAVACOAL_DB` - D1 Database binding
- `DJAVACOAL_KV` - KV Namespace binding
- `DJAVACOAL_BUCKET` - R2 Bucket binding (future use)
- `ASSETS` - Static assets binding

**Regenerate types** after changing `wrangler.jsonc`:

```bash
bun cf:typegen
```

## Common Pitfalls

1. **Don't use NextAuth** - This project uses Better Auth exclusively
2. **Always await `getCloudflareContext({ async: true })`** in route handlers
3. **Migration files** must follow naming: `0000_description.sql` pattern
4. **RPC functions** must be registered in central router (`src/adapters/rpc/index.ts`)
5. **Column names** in D1 are snake_case, map via constants, not hardcoded strings
6. **Locale switching** updates cookie, not URL path
7. **Environment variables** - Use `env` from Cloudflare context in server code, not `process.env`

## Integration Points

- **Email Service**: `src/adapters/email-service/` provides Resend/Plunk clients
    - Use `getResend(env.RESEND_API_KEY)` to send emails
    - Sender email configured via `env.SENDER_EMAIL`
- **Email Templates**: React components in `src/templates/emails/`
    - Built with `@react-email/components`
    - Preview with `bun email:dev`
- **R2 Storage**: AWS SDK v3 client for Cloudflare R2 in `src/adapters/r2/`
    - `getR2Client()` creates S3-compatible client
    - `generatePresignedUploadUrl()` for client-side uploads
    - `uploadTextContent()` / `getTextContent()` for HTML content
    - `deleteObject()` for cleanup
    - Constants in `src/adapters/r2/constants.ts` (bucket name, prefixes, expiration)
- **KV Store**: Constants in `src/adapters/kv/constants.ts`
    - Example: `IS_ALREADY_ONBOARDED` flag for first-time setup
- **Cloudflare Assets**: Configured in `wrangler.jsonc` with ASSETS binding
    - Static files served from `.open-next/assets` directory
