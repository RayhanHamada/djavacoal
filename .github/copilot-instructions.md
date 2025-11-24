# Djavacoal - AI Coding Agent Instructions

## Project Overview

Next.js 15 application deployed to Cloudflare Workers using OpenNext adapter. Features admin authentication, i18n support, and a feature-based architecture with type-safe RPC.

**Documentation Convention**: Each feature has an `AGENTS.md` file in its directory (`src/features/<feature-name>/AGENTS.md`) providing comprehensive implementation details, schemas, and usage examples. **Always consult these files when working with specific features.**

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript + Bun runtime
- **Deployment**: Cloudflare Workers via `@opennextjs/cloudflare`
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 (S3-compatible) via AWS SDK v3
- **KV Store**: Cloudflare KV for page settings and configuration
- **Auth**: Better Auth (NOT NextAuth) with custom D1 adapter
- **RPC**: oRPC for type-safe client-server communication
- **Public API**: RESTful API with OpenAPI/Redocly documentation
- **UI**: Mantine v8 + Tailwind CSS v4 + Framer Motion
- **i18n**: next-intl (cookie-based locale storage)
- **Email**: Resend with react-email templates
- **Rich Text**: TipTap for content editing (news articles)
- **Drag & Drop**: @dnd-kit for reordering functionality

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

- `components/` - React components (atoms/molecules/organisms pattern)
- `hooks/` - Custom React hooks
- `lib/` - Business logic, utilities, constants
- `server/` - Server-side functions, RPC routers, schemas

**Export pattern**: Each subfolder has `index.ts` for barrel exports.

**Documentation**: Each feature has an `AGENTS.md` file with implementation details.

### RPC System (oRPC)

Type-safe client-server communication without API route boilerplate. RPC functions can be **callable** (for client-side hooks) or **actionable** (for Server Actions with redirects).

**Middleware**:

- `injectCFContext` - Automatically injects Cloudflare context into all RPC handlers, making `env` available in the `context` parameter
- `injectNextCookies` - Injects Next.js cookies (including locale) into context for public API routes
- `injectSession` - Validates Better Auth session for protected routes (admin operations)

**Error Handling**: Define custom errors in `src/lib/orpc/server.ts`:

```typescript
const base = os.errors({
    NOT_FOUND: { message: "Resource not found" },
    BAD_REQUEST: { message: "Invalid input" },
    UNAUTHORIZED: { message: "Authentication required" },
    INTERNAL_SERVER_ERROR: { message: "Server error" },
});
```

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

1. **Server instance**: `src/features/dashboard-auth/lib/better-auth-server.ts` exports `getAuth(env)` function
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
- **Dashboard UI**: Some dashboard features use hardcoded English text for simplicity (e.g., `dashboard-product`), while product/content data remains bilingual (EN/AR) for public display
- **Public Pages**: All visitor-facing content uses `next-intl` for full bilingual support

### Component Organization

Global components in `src/components/` follow Atomic Design:

- `atoms/` - Basic UI elements
- `molecules/` - Composite components
- `organisms/` - Complex sections
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
3. Review generated migration in `src/adapters/d1/migrations/`
4. Run `bun d1:migrate:djavacoal` to apply to remote database
5. Test changes with `bun d1:studio`

## Key Conventions

### Imports

- Use `@/` path alias (maps to `src/`)
- Prefer barrel exports via `index.ts` files
- Server-only code: Add `import "server-only"` at top

### Route Groups

- `(admin)/` - Protected admin routes, uses `AdminLayout`
- `(visitor)/` - Public routes, uses `VisitorLayout`
- `api/` - API routes (auth, RPC, public)

### Styling

- Tailwind for layout/spacing
- Mantine components for UI (configured in `src/lib/mantine-theme.ts`)
- Custom fonts: Josefin Sans (headings) + Open Sans (body) in `src/configs/fonts.ts`
- Mantine notifications for user feedback (success/error states)

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
CLOUDFLARE_API_TOKEN=your-d1-token

# R2 Storage
S3_API=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
```

**Bindings** (configured in `wrangler.jsonc`, typed in `cloudflare-env.d.ts`):

- `DJAVACOAL_DB` - D1 Database binding
- `DJAVACOAL_KV` - KV Namespace binding
- `DJAVACOAL_BUCKET` - R2 Bucket binding
- `ASSETS` - Static assets binding

**Regenerate types** after changing `wrangler.jsonc`:

```bash
bun cf:typegen
```

## Feature-Specific Patterns

### Content Management Features (News, Products)

**Status Workflows**: Features like `dashboard-news` use draft→published→unpublished status flows:

- Validate status transitions server-side (can't go draft→unpublished)
- Track `published_at` and `published_by` fields
- Support scheduled publishing with "migration" vs "fresh" modes

**Rich Text Content**: Store HTML in R2, not D1:

- Separate files for EN/AR content (`news-content/{id}-en.html`, `news-content/{id}-ar.html`)
- Use `uploadTextContent()` / `getTextContent()` from R2 adapter
- Store only R2 keys in database

**Auto-Tag Systems**: Tags are created automatically when referenced:

```typescript
// Tags in metadata are auto-created if they don't exist
await db.insert(tags).values(nameSlugPairs).onConflictDoNothing();
```

### Media Management Patterns

**Direct Upload Flow**: Use presigned URLs for browser-to-R2 uploads:

1. Client requests presigned URL with name/MIME type
2. Client uploads directly to R2 using PUT request
3. Client confirms upload to save metadata in D1

**R2 Cleanup**: Always delete R2 objects when removing database records:

```typescript
// Delete from database AND R2
await db.delete(photos).where(eq(photos.id, id));
await deleteObject(env.DJAVACOAL_BUCKET, key);
```

**Unique Name Validation**: Check availability before upload/rename:

```typescript
const isAvailable = await isPhotoNameAvailable(db, name, excludeId);
if (!isAvailable) throw errors.BAD_REQUEST({ message: "Name taken" });
```

### Drag-and-Drop Reordering

Features with custom ordering (products, variants, specs) use `order_index`:

- 0-based sequential indexing
- Use `@dnd-kit/core`, `@dnd-kit/sortable` libraries for UI
- Batch update via RPC with array of `{ id, order_index }` pairs
- Drag handle: `IconGripVertical` positioned at top-left with `cursor: grab`
- Visual feedback: 50% opacity on dragged item, DragOverlay for preview
- Collision detection: `closestCenter` algorithm
- Sorting strategy: `rectSortingStrategy` for grid layouts
- Server sync: Mutation triggers on `handleDragEnd`, updates all order indices
- Toast notifications for success/error states

**Example Implementation Pattern:**

```typescript
// Component with drag-and-drop
const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

<Card ref={setNodeRef} style={{ transform, transition, opacity: isDragging ? 0.5 : 1 }}>
  <ActionIcon {...listeners} {...attributes}>
    <IconGripVertical />
  </ActionIcon>
  {/* Card content */}
</Card>

// Parent container
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={itemIds} strategy={rectSortingStrategy}>
    <Grid>{/* Items */}</Grid>
  </SortableContext>
  <DragOverlay>{activeItem}</DragOverlay>
</DndContext>
```

## Common Pitfalls

1. **Don't use NextAuth** - This project uses Better Auth exclusively
2. **Always await `getCloudflareContext({ async: true })`** in route handlers
3. **Migration files** must follow naming: `0000_description.sql` pattern
4. **RPC functions** must be registered in central router (`src/adapters/rpc/index.ts`)
5. **Column names** in D1 are snake_case, map via constants, not hardcoded strings
6. **Locale switching** updates cookie, not URL path
7. **Environment variables** - Use `env` from Cloudflare context in server code, not `process.env`
8. **R2 Content Storage** - Store large content (HTML, rich text) in R2, not D1 columns
9. **Status Transitions** - Validate state machine transitions server-side, don't trust client
10. **Feature Documentation** - Always check `src/features/<feature>/AGENTS.md` for feature-specific patterns
11. **Barrel Exports** - Always export through `index.ts` files in component/hook/lib folders
12. **Type Safety** - Define Zod schemas for all RPC inputs/outputs
13. **Session Validation** - Always validate session in protected RPC functions
14. **Image Optimization** - Use Next.js Image component with proper sizing
15. **Error Messages** - User-facing errors should be descriptive and actionable

## Integration Points

### Email Service

`src/adapters/email-service/` provides Resend clients:

- Use `getResend(env.RESEND_API_KEY)` to send emails
- Sender email configured via `env.SENDER_EMAIL`
- Templates in `src/templates/emails/`
- Built with `@react-email/components`
- Preview with `bun email:dev`

### R2 Storage

AWS SDK v3 client for Cloudflare R2 in `src/adapters/r2/`:

- `getR2Client()` creates S3-compatible client
- `generatePresignedUploadUrl()` for client-side uploads
- `uploadTextContent()` / `getTextContent()` for HTML content
- `deleteObject()` for cleanup
- Constants in `src/adapters/r2/constants.ts` (bucket name, prefixes, expiration)

### KV Store

Constants in `src/adapters/kv/constants.ts`:

- Used for page settings (social links, contact info, galleries, etc.)
- Example: `IS_ALREADY_ONBOARDED` flag for first-time setup
- No expiration by default (permanent storage)
- JSON values for complex data structures

### Cloudflare Assets

Configured in `wrangler.jsonc` with ASSETS binding:

- Static files served from `.open-next/assets` directory
- Automatic CDN caching
- Environment-specific URLs via `NEXT_PUBLIC_ASSET_URL`

### Public API

RESTful API in `src/features/public-api/` for external consumers:

- OpenAPI documentation with Redocly
- Type-safe client generation
- Uses oRPC with custom routes for REST endpoints
- Locale-aware responses via cookie
- No authentication required

## Best Practices for AI Agents

### When Creating Features

1. **Create feature directory structure**:

    ```
    src/features/<feature-name>/
    ├── components/
    │   ├── atoms/
    │   ├── molecules/
    │   ├── organisms/
    │   └── index.ts
    ├── hooks/
    │   └── index.ts
    ├── lib/
    │   ├── constants.ts
    │   ├── types.ts
    │   ├── utils.ts
    │   └── index.ts
    ├── server/
    │   ├── functions.ts
    │   ├── schemas.ts
    │   ├── router.ts
    │   └── index.ts
    ├── AGENTS.md
    └── index.ts
    ```

2. **Write AGENTS.md documentation** with:
    - Overview and purpose
    - Architecture and directory structure
    - Database schemas (if applicable)
    - RPC functions with examples
    - Integration points
    - Usage examples
    - Best practices and common pitfalls

3. **Define schemas first** in `server/schemas.ts` using Zod

4. **Implement server functions** in `server/functions.ts`

5. **Register router** in `src/adapters/rpc/index.ts`

6. **Create components** following atomic design pattern

7. **Add types** in `lib/types.ts` for shared TypeScript interfaces

8. **Document constants** in `lib/constants.ts` with JSDoc comments

### When Modifying Features

1. **Check AGENTS.md** for feature-specific patterns and constraints
2. **Update schemas** if changing data structures
3. **Maintain backward compatibility** or version appropriately
4. **Update documentation** in AGENTS.md if behavior changes
5. **Test both locales** (EN/AR) if affecting user-facing content
6. **Verify RPC registration** if adding new functions
7. **Clean up R2/KV** if removing data references

### When Debugging

1. **Check feature AGENTS.md** for known issues and debugging tips
2. **Verify Cloudflare context** is properly injected
3. **Inspect D1 database** with `bun d1:studio`
4. **Check R2 storage** for missing/orphaned objects
5. **Review KV values** in Cloudflare dashboard
6. **Validate schemas** with input/output examples
7. **Test RPC endpoints** with proper context
8. **Check error messages** in server logs and browser console

### Code Quality Guidelines

1. **TypeScript**: Enable strict mode, no `any` types
2. **Naming**: Use descriptive names, follow conventions (PascalCase for components, camelCase for functions)
3. **Comments**: JSDoc for public APIs, inline for complex logic
4. **Error Handling**: Use oRPC errors, provide user-friendly messages
5. **Performance**: Lazy load components, optimize queries, cache appropriately
6. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
7. **Security**: Validate inputs, sanitize outputs, check sessions
8. **Testing**: Manual testing required, automated tests encouraged

## Feature Reference

Available features and their purposes:

### Dashboard Features (Admin)

- `dashboard` - Main admin dashboard and navigation
- `dashboard-auth` - Authentication and admin user management
- `dashboard-news` - News/blog article management
- `dashboard-product` - Product catalog management
- `dashboard-gallery` - Centralized photo library
- `dashboard-static-media` - Page-specific media (KV-based)
- `dashboard-team-member` - Team member profiles
- `dashboard-page-settings` - Site-wide settings (contact, social, etc.)
- `dashboard-faqs` - FAQ management with bilingual support

### Visitor Features (Public)

- `home` - Homepage with hero, featured content
- `blog` - News article listing and detail pages
- `our-products` - Product catalog for visitors
- `about-company` - Company information and team
- `contact-us` - Contact form and information
- `production-info` - Production process and capabilities

### API Features

- `public-api` - RESTful API with OpenAPI documentation
- `sitemap` - XML sitemap generation for SEO

## Troubleshooting

### Common Issues

**Database Connection Errors**

- Verify `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_DATABASE_ID` in `.dev.vars`
- Check D1 binding name matches `DJAVACOAL_DB` in `wrangler.jsonc`
- Ensure migrations are applied with `bun d1:migrate:djavacoal`

**R2 Upload Failures**

- Verify R2 credentials in `.dev.vars`
- Check bucket name in `wrangler.jsonc` and `src/adapters/r2/constants.ts`
- Ensure presigned URL hasn't expired
- Verify CORS settings on R2 bucket

**Auth Issues**

- Check `BETTER_AUTH_SECRET` is set
- Verify `BETTER_AUTH_URL` matches your deployment URL
- Ensure session cookies are being set (check browser DevTools)
- Review Better Auth route handler configuration

**i18n Not Working**

- Verify `locale` cookie is being set
- Check `src/i18n/messages/{locale}.json` exists
- Ensure `useTranslations()` hook is used correctly
- Review `src/i18n/request.ts` configuration

**RPC Function Not Found**

- Check function is exported in `server/router.ts`
- Verify router is registered in `src/adapters/rpc/index.ts`
- Ensure function is `.callable()` not `.actionable()`
- Restart dev server after adding new functions

## Performance Optimization

### Database Queries

- Select only needed columns
- Use indexes for common filters
- Implement pagination
- Avoid N+1 queries with joins

### R2 Storage

- Use presigned URLs for direct uploads
- Implement lazy loading for images
- Optimize image sizes before upload
- Use CDN caching headers

### Client-Side

- Code splitting with dynamic imports
- Memoize expensive computations
- Debounce search inputs
- Prefetch data on hover

### Caching Strategy

- TanStack Query for client-side caching
- Cloudflare CDN for static assets
- KV for frequently accessed data
- Consider stale-while-revalidate patterns

## Security Checklist

- [ ] All admin routes require authentication
- [ ] Input validation with Zod schemas
- [ ] SQL injection prevention via Drizzle ORM
- [ ] XSS prevention via React auto-escaping
- [ ] CSRF protection via Better Auth
- [ ] Rate limiting (if exposed to public)
- [ ] Secure session cookies (httpOnly, secure)
- [ ] Password hashing via Better Auth
- [ ] File upload validation (MIME type, size)
- [ ] Environment variables not exposed to client

## Deployment Checklist

- [ ] Run `bun lint` and fix all issues
- [ ] Apply all database migrations
- [ ] Test authentication flows
- [ ] Verify environment variables in Cloudflare
- [ ] Check R2 bucket permissions
- [ ] Test both EN and AR locales
- [ ] Verify email sending works
- [ ] Test image uploads and display
- [ ] Check public API endpoints
- [ ] Review error handling
- [ ] Test on mobile devices
- [ ] Verify SEO metadata
- [ ] Check Cloudflare bindings
- [ ] Test with production data

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Drizzle ORM**: https://orm.drizzle.team/
- **Better Auth**: https://www.better-auth.com/
- **oRPC**: https://orpc.unnoq.com/
- **Mantine**: https://mantine.dev/
- **TanStack Query**: https://tanstack.com/query/latest
- **next-intl**: https://next-intl-docs.vercel.app/

## Contributing

When contributing to this project:

1. Read relevant `AGENTS.md` files for features you're working on
2. Follow established patterns and conventions
3. Update documentation when adding/changing features
4. Test thoroughly in both locales
5. Ensure backward compatibility
6. Write descriptive commit messages
7. Keep PRs focused and atomic

## License

Part of the Djavacoal project. See main project LICENSE file.
