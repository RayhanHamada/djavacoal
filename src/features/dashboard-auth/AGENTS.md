# Dashboard Auth Feature

## Overview

This feature provides complete authentication and user management functionality for the Djavacoal admin dashboard. It uses Better Auth (NOT NextAuth) with custom D1 adapter, supporting magic link invitations, password-based login, and comprehensive admin user management.

## Architecture

### Directory Structure

```
dashboard-auth/
├── components/          # UI components for authentication flows
│   ├── atoms/          # Basic auth UI elements
│   ├── molecules/      # Composite auth components
│   └── organisms/      # Complex auth sections
├── hooks/              # React hooks for auth state and mutations
├── lib/                # Auth configuration and utilities
│   ├── better-auth-server.ts  # Better Auth server instance
│   └── constants.ts    # Auth-related constants
└── server/             # Server-side logic (RPC functions)
    ├── functions.tsx   # oRPC callable functions
    ├── schema.ts       # Zod schemas for input/output validation
    ├── router.ts       # RPC router exports
    └── actions.ts      # Server Actions (if any)
```

## Features

### Core Functionality

1. **Onboarding**
   - First-time admin user setup
   - Name, email, and password registration
   - One-time initialization check

2. **Authentication Methods**
   - Magic link (passwordless) authentication
   - Email and password authentication
   - Session management with Better Auth

3. **Admin Management**
   - List all admin users (with pagination and search)
   - Invite new admins via magic link
   - Remove admin users
   - Self-service profile updates

4. **Password Management**
   - Check if user needs to set password (invited via magic link)
   - Set initial password for magic link users
   - Change password with current password verification
   - Reset password via email

5. **Session Management**
   - Automatic session validation
   - Redirect authenticated/unauthenticated users
   - Session-based authorization

## Technical Implementation

### Better Auth Configuration

Located in `lib/better-auth-server.ts`, configured with:

```typescript
export function getAuth(env: CloudflareEnv) {
  return betterAuth({
    database: betterAuthAdapter(env.DJAVACOAL_DB),
    
    // Custom table/column mapping for D1
    user: { modelName: "users", fields: {...} },
    session: { modelName: "sessions", fields: {...} },
    account: { modelName: "accounts", fields: {...} },
    verification: { modelName: "verifications", fields: {...} },
    
    // Authentication methods
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      resetPasswordTokenExpiresIn: 24 * 60 * 60 * 1000, // 24 hours
      async sendResetPassword({ user, url }) {
        await sendRequestResetPasswordEmail({ to: user.email, link: url });
      },
    },
    
    // Plugins
    plugins: [
      magicLink({
        expiresIn: 60 * 60 * 24, // 24 hours
        async sendMagicLink({ email, url }) {
          await sendInvitationEmail({ to: email, link: url });
        },
      }),
      admin(), // Admin role management
    ],
  });
}
```

### Server-Side (RPC Functions)

All server functions are located in `server/functions.tsx` and registered in the RPC router as `admins`:

#### Available RPC Functions

```typescript
// Onboarding
rpc.admins.setupFirstUser.useMutation()
rpc.admins.redirectJoinedUser.useQuery()

// Session checks
rpc.admins.redirectUnauthenticatedUser.useQuery()
rpc.admins.redirectAuthenticatedUser.useQuery()

// Admin management
rpc.admins.listAllAdmins.useQuery({ page, limit, search })
rpc.admins.inviteAdmin.useMutation()
rpc.admins.removeAdmin.useMutation()

// Password management
rpc.admins.checkNeedsPassword.useQuery()
rpc.admins.setPassword.useMutation()
rpc.admins.updateMyName.useMutation()
rpc.admins.changeMyPassword.useMutation()

// Email sending (typically called internally)
rpc.admins.sendInvitationEmail.useMutation()
rpc.admins.sendRequestResetPasswordEmail.useMutation()
```

### Database Schema

Authentication tables follow Better Auth schema with custom D1 mapping:

#### `users` table
```typescript
{
  id: string;              // Primary key (nanoid)
  name: string;
  email: string;           // Unique
  email_verified: boolean;
  image: string | null;
  role: string;            // "admin"
  banned: boolean;
  ban_reason: string | null;
  ban_expires: number | null;
  created_at: Date;
  updated_at: Date;
}
```

#### `sessions` table
```typescript
{
  id: string;              // Primary key
  user_id: string;         // Foreign key to users
  token: string;           // Session token
  expires_at: Date;
  ip_address: string | null;
  user_agent: string | null;
  impersonated_by: string | null;
  created_at: Date;
  updated_at: Date;
}
```

#### `accounts` table
```typescript
{
  id: string;              // Primary key
  user_id: string;         // Foreign key to users
  account_id: string;
  provider_id: string;     // "credential" for email/password
  access_token: string | null;
  refresh_token: string | null;
  access_token_expires_at: Date | null;
  refresh_token_expires_at: Date | null;
  scope: string | null;
  id_token: string | null;
  password: string | null; // Hashed password
  created_at: Date;
  updated_at: Date;
}
```

#### `verifications` table
```typescript
{
  id: string;              // Primary key
  identifier: string;      // Email or user ID
  value: string;           // Verification token
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}
```

## Constants

Located in `lib/constants.ts`:

```typescript
// Email configuration
AUTH_APP_NAME = "Djavacoal Admin"
EMAIL_SENDER_NAME = "Djavacoal Admin"
EMAIL_SUBJECT.INVITATION = "You're invited to join Djavacoal Admin"
EMAIL_SUBJECT.RESET_PASSWORD = "Reset your Djavacoal Admin password"

// Token expiry
RESET_PASSWORD_TOKEN_EXPIRY_IN = 24 * 60 * 60 * 1000 // 24 hours
MAGIC_LINK_EXPIRY_IN = 24 * 60 * 60 // 24 hours (seconds)
```

## Integration Points

### RPC Router Registration
The feature router must be registered in `/src/adapters/rpc/index.ts`:

```typescript
import { router as admins } from "@/features/dashboard-auth/server/router";

const router = {
  admins,
  // ...other routers
};
```

### Better Auth Route Handler
API route at `/app/api/auth/[...all]/route.ts`:

```typescript
import { getAuth } from "@/features/dashboard-auth/lib/better-auth-server";
import { toNextJsHandler } from "better-auth/next-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const auth = getAuth(env);
  return toNextJsHandler(auth)(request);
}
// POST, PUT, DELETE handlers similar...
```

### Email Templates
React Email templates in `/src/templates/emails/`:

- `AdminInvitationEmail.tsx` - Magic link invitation
- `AdminResetPasswordEmail.tsx` - Password reset link

### Email Service
Uses Resend for email delivery:

```typescript
const emailService = getResend(env.RESEND_API_KEY);
await emailService.emails.send({
  to: email,
  react: <AdminInvitationEmail email={email} link={link} />,
  from: `${EMAIL_SENDER_NAME} <${env.SENDER_EMAIL}>`,
  subject: EMAIL_SUBJECT.INVITATION,
});
```

## Authentication Flows

### Onboarding Flow
```typescript
// 1. Check if any user exists
const { data } = rpc.admins.redirectJoinedUser.useQuery();

// 2. If no users exist, show onboarding form
if (!data?.onboarded) {
  // Show onboarding form
}

// 3. Submit first admin user
rpc.admins.setupFirstUser.useMutation({
  onSuccess: () => {
    // Redirect to sign-in
  }
});
```

### Magic Link Invitation Flow
```typescript
// 1. Admin invites new user
rpc.admins.inviteAdmin.useMutation({
  onSuccess: () => {
    // Magic link email sent
    // User receives email with link
  }
});

// 2. User clicks magic link
// Better Auth handles verification

// 3. User is signed in automatically
// Redirect to /dashboard

// 4. User may need to set password
const { data } = rpc.admins.checkNeedsPassword.useQuery();
if (data?.needsPassword) {
  // Show set password form
  rpc.admins.setPassword.useMutation();
}
```

### Password Reset Flow
```typescript
// 1. User requests password reset
await client.forgetPassword({
  email: "admin@example.com",
  redirectTo: "/auth/reset-password"
});

// 2. User receives email with reset link

// 3. User clicks link and sets new password
await client.resetPassword({
  newPassword: "newpass123",
  token: "token-from-url"
});
```

### Sign In Flow
```typescript
// Email and password sign-in
await client.signIn.email({
  email: "admin@example.com",
  password: "password123",
  callbackURL: "/dashboard"
});
```

## Error Handling

### Server-Side
- `BAD_REQUEST` - Invalid input, user already exists, cannot remove self
- `NOT_FOUND` - User not found
- `UNAUTHORIZED` - No valid session
- `INTERNAL_SERVER_ERROR` - Database or email service errors

### Client-Side
- Network errors shown via Mantine notifications
- Form validation errors displayed inline
- Better Auth client errors handled gracefully
- Redirect on successful authentication

## Dependencies

### External Packages
- `better-auth` - Authentication framework with D1 adapter
- `better-auth/plugins` - Admin and magic link plugins
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` - Database operations
- `resend` - Email delivery service
- `@react-email/components` - Email template components
- `zod` - Schema validation

### Internal Dependencies
- `@/adapters/d1` - Database access and constants
- `@/adapters/better-auth` - Custom D1 adapter for Better Auth
- `@/adapters/email-service` - Resend client wrapper
- `@/lib/orpc/server` - RPC base configuration
- `@/lib/rpc` - Client-side RPC client
- `@/templates/emails` - Email templates

## Usage Examples

### Protecting Routes

```typescript
// In a route handler or server component
import { getAuth } from "@/features/dashboard-auth/lib/better-auth-server";
import { headers } from "next/headers";

const auth = getAuth(env);
const header = await headers();
const session = await auth.api.getSession({ headers: header });

if (!session) {
  // Redirect to sign-in
}
```

### Listing Admins

```typescript
const { data, isLoading } = rpc.admins.listAllAdmins.useQuery({
  page: 1,
  limit: 10,
  search: "john"
});

// data.admins: Admin[]
// data.total: number
// data.page: number
// data.pageSize: number
```

### Inviting an Admin

```typescript
const inviteMutation = rpc.admins.inviteAdmin.useMutation({
  onSuccess: () => {
    notifications.show({
      title: "Success",
      message: "Invitation sent successfully",
    });
  },
  onError: (error) => {
    notifications.show({
      title: "Error",
      message: error.message,
      color: "red",
    });
  },
});

inviteMutation.mutate({
  email: "newadmin@example.com",
  name: "New Admin",
});
```

## Best Practices for AI Agents

### When Adding Features
1. Always use `getAuth(env)` to get Better Auth instance
2. Validate sessions in protected operations
3. Use Better Auth API methods (not direct database access for auth operations)
4. Add new RPC functions to `server/functions.tsx`
5. Update router in `server/router.ts`

### When Modifying
1. Never modify Better Auth core configuration without understanding D1 adapter
2. Keep email templates in `/src/templates/emails/`
3. Update type definitions if changing auth schemas
4. Test with Cloudflare bindings (not Node.js env vars)
5. Ensure password operations use Better Auth's built-in security

### When Debugging
1. Check Better Auth route handler in `/app/api/auth/[...all]/route.ts`
2. Verify Cloudflare context is correctly passed to `getAuth(env)`
3. Check D1 database for auth tables structure
4. Review email service logs for delivery issues
5. Ensure session cookies are set correctly

## Security Considerations

1. **Password Hashing**: Handled automatically by Better Auth
2. **Session Tokens**: Secure, httpOnly cookies
3. **Magic Links**: Expire after 24 hours
4. **Password Reset**: Tokens expire after 24 hours
5. **Admin-Only Operations**: Session validation in all admin operations
6. **Self-Protection**: Users cannot remove themselves

## Environment Variables

Required for authentication:

```bash
# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_BASE_PATH=/api/auth

# Email Service
RESEND_API_KEY=re_your_api_key
SENDER_EMAIL=noreply@yourdomain.com

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000/
```

## Related Features

- **dashboard** - Admin dashboard requiring authentication
- All **dashboard-*** features - Require admin authentication
- **admin-layout** - Layout component checking authentication state

## Future Enhancements

Potential improvements for this feature:
- [ ] Two-factor authentication (2FA)
- [ ] OAuth providers (Google, Microsoft)
- [ ] Session activity logs
- [ ] Account lockout after failed attempts
- [ ] Email verification for existing users
- [ ] Role-based permissions (beyond admin)
- [ ] Password strength requirements
- [ ] Session device management
- [ ] Audit logs for admin actions
- [ ] Bulk admin invitations

## License

Part of the Djavacoal project. See main project LICENSE file.
