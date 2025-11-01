# Dashboard Feature

## Overview

This feature provides the main dashboard interface for admin users. It serves as the landing page after authentication and provides navigation to all admin management features. The dashboard displays an overview, quick stats, and access to all administrative functions.

## Architecture

### Directory Structure

```
dashboard/
├── components/          # UI components for dashboard
│   ├── atoms/          # Basic dashboard UI elements
│   ├── molecules/      # Composite components (stat cards, nav items)
│   └── organisms/      # Complex sections (dashboard layout, sidebar)
├── hooks/              # React hooks for dashboard data
├── lib/                # Dashboard-specific utilities and constants
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Dashboard Overview**
   - Welcome message with user name
   - Quick stats (products, news articles, gallery photos, etc.)
   - Recent activity feed
   - Quick action buttons

2. **Navigation**
   - Sidebar navigation to all admin features
   - Breadcrumb navigation
   - Search functionality (future)

3. **User Info**
   - Display current user information
   - Quick access to profile settings
   - Sign out functionality

4. **Responsive Design**
   - Mobile-friendly layout
   - Collapsible sidebar
   - Touch-friendly navigation

## Technical Implementation

### Components

The dashboard uses the `AdminLayout` component from `/src/components/layouts/admin-layout.tsx` which provides:

- Persistent sidebar navigation
- Top navigation bar with user menu
- Main content area
- Breadcrumb navigation
- Mobile hamburger menu

### Navigation Items

Navigation structure defined in `/src/hooks/use-menu-items.tsx`:

```typescript
const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconDashboard />
  },
  {
    label: "Page Settings",
    items: [
      { label: "SEO Metadata", href: "/dashboard/page-settings" },
      { label: "Homepage", href: "/dashboard/page-settings/homepage" },
      { label: "About Company", href: "/dashboard/page-settings/about-company" },
      { label: "Team Members", href: "/dashboard/page-settings/team-members" },
      // ...more items
    ]
  },
  {
    label: "Content",
    items: [
      { label: "News", href: "/dashboard/news" },
      { label: "Products", href: "/dashboard/products" },
      { label: "Gallery", href: "/dashboard/gallery" },
    ]
  },
  // ...more sections
];
```

### Route Protection

All dashboard routes are protected by the `(admin)` route group which uses middleware to check authentication:

```typescript
// In middleware.ts or layout.tsx
const session = await auth.api.getSession({ headers });
if (!session) {
  redirect("/auth/sign-in");
}
```

## Integration Points

### AdminLayout Component
Located at `/src/components/layouts/admin-layout.tsx`:

```typescript
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Sidebar />
      <Header />
      <Main>{children}</Main>
    </AppShell>
  );
}
```

### Authentication
Uses Better Auth session:

```typescript
const { user } = await getSession();
// Display user.name in dashboard
```

### Quick Stats
Fetches data from multiple features:

```typescript
const { data: products } = rpc.dashboardProduct.listProducts.useQuery();
const { data: news } = rpc.dashboardNews.listNews.useQuery();
const { data: photos } = rpc.gallery.listPhotos.useQuery();
// Display counts
```

## Dependencies

### External Packages
- `@mantine/core` - UI components (AppShell, Sidebar, etc.)
- `@tabler/icons-react` - Icons for navigation
- `@tanstack/react-query` - Data fetching for stats

### Internal Dependencies
- `@/components/layouts` - AdminLayout component
- `@/features/admin-auth` - Authentication check
- `@/hooks/use-menu-items` - Navigation structure
- All dashboard-* features - For stats and quick actions

## Usage

### Dashboard Page
Located at `/app/(admin)/dashboard/page.tsx`:

```typescript
import { DashboardView } from "@/features/dashboard";

export default function DashboardPage() {
  return <DashboardView />;
}
```

### Custom Dashboard Widgets
Add custom widgets to the dashboard:

```typescript
export function DashboardView() {
  return (
    <Stack>
      <WelcomeSection />
      <QuickStatsGrid />
      <RecentActivityFeed />
      <QuickActions />
    </Stack>
  );
}
```

## Best Practices for AI Agents

### When Adding Features
1. Add new navigation items to `use-menu-items` hook
2. Keep dashboard overview simple and fast-loading
3. Use skeleton loaders for stats
4. Maintain consistent icon usage
5. Consider mobile experience

### When Modifying
1. Test navigation on mobile devices
2. Ensure all routes are properly protected
3. Keep sidebar structure organized
4. Update breadcrumbs when adding pages
5. Maintain responsive design

### When Debugging
1. Check authentication session
2. Verify route protection middleware
3. Test mobile menu functionality
4. Check responsive breakpoints
5. Review navigation link hrefs

## Related Features

- **admin-auth** - Provides authentication
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
