# Dashboard Feature

## Overview

This feature provides the main dashboard interface for admin users. It serves as the landing page after authentication and provides navigation to all admin management features. The dashboard displays an overview, quick stats, and access to all administrative functions.

## Architecture

### Directory Structure

```
dashboard/
├── components/          # UI components following atomic design
│   ├── atoms/          # Basic UI elements
│   │   ├── counter-card.tsx        # Stat counter card with count and icon
│   │   ├── dashboard-logo.tsx      # Dashboard logo with gradient
│   │   ├── navigation-item.tsx     # Single navigation menu item
│   │   ├── theme-icon.tsx          # Theme toggle icon
│   │   └── index.ts               # Barrel export
│   ├── molecules/      # Composite components
│   │   ├── dashboard-header.tsx    # Top header with logo and theme toggle
│   │   ├── navigation-footer.tsx   # User profile menu in sidebar
│   │   ├── navigation-list.tsx     # List of navigation items
│   │   ├── welcome-header.tsx      # Welcome message with user name
│   │   └── index.ts               # Barrel export
│   └── organisms/      # Complex sections
│       ├── dashboard-shell.tsx     # Main layout shell with AppShell
│       ├── dashboard-sidebar.tsx   # Navigation sidebar
│       ├── dashboard-stats.tsx     # Grid of stat counter cards
│       └── index.ts               # Barrel export
├── hooks/              # React hooks
│   ├── use-current-user.ts        # Get current user session
│   └── index.ts                   # Barrel export
├── lib/                # Utilities and configuration
│   ├── constants.ts               # Dashboard stats config
│   ├── navigation-config.ts       # Navigation menu structure
│   ├── types.ts                   # TypeScript types
│   └── index.ts                   # Barrel export
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Dashboard Overview**
   - Welcome message with authenticated user's name
   - Counter cards showing:
     - Articles count (links to news management)
     - Products count (links to product management)
     - Packaging Options count (links to packaging options)
     - Team Members count (links to team members)
   - Responsive 2-column grid layout
   - Hover effects on cards with elevation
   - Skeleton loading states

2. **Navigation**
   - Hierarchical sidebar navigation with collapsible sections
   - Navigation items with icons and descriptions
   - Footer menu with user profile and sign out
   - Theme toggle (light/dark mode)

3. **User Info**
   - Display current user name and email
   - Role badge (admin/superadmin)
   - Profile link
   - Sign out functionality

4. **Responsive Design**
   - Mobile-friendly layout with AppShell
   - 1-column grid on mobile, 2-column on desktop
   - Touch-friendly navigation
   - Optimized for various screen sizes

## Technical Implementation

### Atomic Design Pattern

This feature strictly follows atomic design principles:

**Atoms** - Basic building blocks:
- `CounterCard` - Clickable stat card with icon, label, and count
- `DashboardLogo` - Gradient-themed logo icon
- `NavigationItem` - Single nav item with optional children
- `ThemeIcon` - Toggle between sun/moon icons

**Molecules** - Composite components:
- `DashboardHeader` - Combines logo and theme toggle
- `NavigationFooter` - User menu with profile and sign out
- `NavigationList` - List of navigation items with scroll
- `WelcomeHeader` - Title and subtitle with user name

**Organisms** - Complex sections:
- `DashboardShell` - Complete layout with AppShell, header, sidebar, and PhotoProvider
- `DashboardSidebar` - Navigation list with footer
- `DashboardStats` - Grid of counter cards with data

### Component Examples

#### CounterCard (Atom)
```typescript
<CounterCard
  label="Articles"
  count={42}
  icon={IconArticle}
  color="grape"
  href="/dashboard/news"
  loading={false}
/>
```

#### WelcomeHeader (Molecule)
```typescript
<WelcomeHeader
  userName="John Doe"
  subtitle="Overview of your content"
/>
```

#### DashboardStats (Organism)
```typescript
const stats = [
  { label: "Articles", count: 42, icon: IconArticle, color: "grape", href: "/dashboard/news" },
  // ... more stats
];
<DashboardStats stats={stats} />
```

### Navigation Configuration

Navigation structure defined in `lib/navigation-config.ts`:

```typescript
export const navigationConfig: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: IconHome,
    href: "/dashboard",
    description: "Back to Dashboard Home",
  },
  {
    label: "Products",
    icon: IconBrandProducthunt,
    description: "Product management",
    children: [
      {
        label: "Manage Packaging Options",
        icon: IconPackage,
        href: "/dashboard/products/packaging-options",
      },
      {
        label: "Manage Products",
        icon: IconList,
        href: "/dashboard/products",
      },
    ],
  },
  // ... more items
];
```

### Dashboard Stats Configuration

Stats cards defined in `lib/constants.ts`:

```typescript
export const DASHBOARD_STATS_CONFIG = [
  {
    label: "Articles",
    icon: IconArticle,
    color: "grape",
    href: "/dashboard/news",
  },
  // ... more stats
] as const;
```

### Route Protection

All dashboard routes are in the `(admin)` route group with layout-based authentication check using Better Auth.

## Integration Points

### DashboardShell Component
The main layout wrapper using Mantine's AppShell:

```typescript
import { DashboardShell } from "@/features/dashboard/components/organism";

export default function AdminLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
```

### Authentication
Uses Better Auth client for session management:

```typescript
import { client } from "@/features/dashboard-auth/lib/better-auth-client";

const { data: session } = client.useSession();
const userName = session?.user?.name;
```

### Hook: useCurrentUser
Simplified hook for getting current user:

```typescript
import { useCurrentUser } from "@/features/dashboard/hooks";

const { user, isLoading } = useCurrentUser();
```

### Stat Counts via RPC
Fetches counts from multiple features using TanStack Query:

```typescript
import { rpc } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

const { data: newsCount, isLoading } = useQuery(
  rpc.dashboardNews.getNewsCount.queryOptions()
);
// newsCount = { count: 42 }
```

### RPC Endpoints Required
- `rpc.dashboardNews.getNewsCount()` - Returns `{ count: number }`
- `rpc.dashboardProduct.getProductCount()` - Returns `{ count: number }`
- `rpc.dashboardProduct.getPackagingOptionCount()` - Returns `{ count: number }`
- `rpc.dashboardTeamMember.getTeamMemberCount()` - Returns `{ count: number }`

## Dependencies

### External Packages
- `@mantine/core` - UI components (AppShell, Sidebar, etc.)
- `@tabler/icons-react` - Icons for navigation
- `@tanstack/react-query` - Data fetching for stats

### Internal Dependencies
- `@/components/layouts` - AdminLayout component
- `@/features/dashboard-auth` - Authentication check
- `@/hooks/use-menu-items` - Navigation structure
- All dashboard-* features - For stats and quick actions

## Usage

### Dashboard Page
Located at `/app/(admin)/dashboard/page.tsx`:

```typescript
import type { DashboardStatCard } from "@/features/dashboard/lib/types";
import { Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/features/dashboard-auth/lib/better-auth-client";
import { WelcomeHeader } from "@/features/dashboard/components/molecules/welcome-header";
import { DashboardStats } from "@/features/dashboard/components/organism/dashboard-stats";
import { DASHBOARD_STATS_CONFIG } from "@/features/dashboard/lib/constants";
import { rpc } from "@/lib/rpc";

export default function DashboardPage() {
  const { data: session } = client.useSession();

  // Fetch all counts
  const { data: newsCount, isLoading: newsLoading } = useQuery(
    rpc.dashboardNews.getNewsCount.queryOptions()
  );
  // ... fetch other counts

  // Map config to stats with actual counts
  const stats: DashboardStatCard[] = DASHBOARD_STATS_CONFIG.map((config, index) => ({
    ...config,
    count: countsArray[index]?.count ?? 0,
    loading: loadingArray[index],
  }));

  return (
    <Stack gap="xl" maw={1200} mx="auto">
      <WelcomeHeader userName={session?.user?.name} />
      <DashboardStats stats={stats} />
    </Stack>
  );
}
```

### Adding New Stat Cards
1. Add RPC function to feature's server functions:
```typescript
export const getFeatureCount = base
  .handler(async ({ context: { env }, errors }) => {
    const db = getDB(env.DJAVACOAL_DB);
    const [{ total }] = await db.select({ total: count() }).from(table);
    return { count: total };
  })
  .callable();
```

2. Register in feature's router:
```typescript
export const router = {
  getFeatureCount,
  // ... other functions
};
```

3. Add to `DASHBOARD_STATS_CONFIG`:
```typescript
{
  label: "New Feature",
  icon: IconNew,
  color: "indigo",
  href: "/dashboard/new-feature",
}
```

4. Fetch in dashboard page and add to stats array

## Best Practices for AI Agents

### When Adding Components
1. **Follow Atomic Design**: Place components in correct folder (atoms/molecules/organisms)
2. **Type Safety**: Always define prop types using TypeScript interfaces/types
3. **Naming**: Use descriptive names that match their purpose
4. **Exports**: Add to barrel exports (`index.ts`) in component folders
5. **Client Components**: Add `"use client"` directive when needed

### When Adding Navigation Items
1. Update `lib/navigation-config.ts` with new items
2. Use consistent icon sizing (18-20px for icons)
3. Provide descriptions for top-level items
4. Group related items under parent items
5. Keep hrefs consistent with route structure

### When Adding Stat Cards
1. Create RPC count function in feature's server functions
2. Register in feature's router
3. Add to `DASHBOARD_STATS_CONFIG` with appropriate color
4. Fetch in dashboard page using TanStack Query
5. Map to stats array with loading states

### When Modifying Styles
1. Use Mantine's design tokens (`var(--mantine-color-*)`)
2. Prefer `styles` prop over deprecated `sx` prop
3. Use Mantine's spacing scale (`gap`, `p`, `m`)
4. Test hover/focus states
5. Maintain responsive design with breakpoints

### When Debugging
1. Check Better Auth session is valid
2. Verify RPC endpoints are registered
3. Test loading states with slow network
4. Check TypeScript errors in IDE
5. Test on mobile viewport sizes
6. Verify navigation links are correct
7. Check console for React Query errors

## Related Features

- **dashboard-auth** - Provides authentication
- All **dashboard-*** features - Accessible from dashboard
- **components/layouts/admin-layout** - Layout wrapper

## Future Enhancements

- [ ] Dashboard customization (widget arrangement)
- [ ] Real-time notifications
- [ ] Activity timeline
- [ ] Quick search across all features
- [ ] Keyboard shortcuts
- [ ] Dashboard themes/dark mode
- [ ] Export functionality
- [ ] Role-based dashboard views
- [ ] Dashboard analytics
- [ ] Favorite/pinned pages

## License

Part of the Djavacoal project. See main project LICENSE file.
