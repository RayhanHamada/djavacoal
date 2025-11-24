# Dashboard Blog Settings Feature

## Overview

This feature provides a simple dashboard interface for managing sitemap settings (changefreq and priority) for blog/news articles in the Djavacoal application. These settings are stored in Cloudflare KV and applied to the blog sitemap and public API metadata responses.

## Architecture

### Directory Structure

```
dashboard-blog-settings/
├── components/          # UI components
│   └── organisms/      # Complex sections (settings form)
│       ├── blog-settings-form.tsx
│       └── index.ts
├── server/             # Server-side logic (RPC functions)
│   ├── functions.ts    # oRPC callable functions
│   ├── schemas.ts      # Zod schemas for input/output validation
│   ├── router.ts       # RPC router exports
│   └── index.ts        # Server module exports
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Blog Sitemap Settings Management**
   - Get current blog sitemap settings
   - Update sitemap changefreq (always, hourly, daily, weekly, monthly, yearly, never)
   - Update sitemap priority (0.0 - 1.0)

2. **KV Storage**
   - Settings stored in Cloudflare KV for fast access
   - Keys: `NEWS_SITEMAP_CHANGEFREQ`, `NEWS_SITEMAP_PRIORITY`
   - Default values: `changefreq: "daily"`, `priority: 0.65`

3. **Integration Points**
   - Blog sitemap generation (`/blog/sitemap.xml`)
   - Public API news metadata endpoint (`/api/public/news/{slug}/metadata`)

4. **Authentication**
   - All operations require admin authentication
   - Uses base oRPC instance with Cloudflare context injection

## Technical Implementation

### Server-Side (RPC Functions)

All server functions are located in `server/functions.ts` and registered in the RPC router as `blogSettings`:

#### Available RPC Functions

```typescript
// Get current blog settings
rpc.blogSettings.getBlogSettings.useQuery({})

// Update blog settings
rpc.blogSettings.updateBlogSettings.useMutation({
  sitemap_changefreq: "daily",
  sitemap_priority: 0.65
})
```

### KV Storage Schema

Settings are stored as simple key-value pairs:

```typescript
{
  "sitemap:news_sitemap_changefreq": "daily",  // String enum value
  "sitemap:news_sitemap_priority": "0.65"      // String number (converted to float)
}
```

### Constants

Located in `@/adapters/kv/constants.ts`:

```typescript
KV_KEYS = {
  NEWS_SITEMAP_CHANGEFREQ: "sitemap:news_sitemap_changefreq",
  NEWS_SITEMAP_PRIORITY: "sitemap:news_sitemap_priority"
}
```

Located in `server/schemas.ts`:

```typescript
SITEMAP_CHANGEFREQ_VALUES = [
  "always", "hourly", "daily", "weekly", "monthly", "yearly", "never"
] as const;

// Default values
DEFAULT_BLOG_SETTINGS = {
  sitemap_changefreq: "daily",
  sitemap_priority: 0.65
}
```

## Integration Points

### RPC Router Registration

```typescript
import { router as blogSettings } from "@/features/dashboard-blog-settings/server";

const router = {
  blogSettings,
  // ...other routers
};
```

### Route Page

Used in admin route `/dashboard/blog-settings`:

```typescript
import { BlogSettingsForm } from "@/features/dashboard-blog-settings/components";

export default function BlogSettingsPage() {
  return (
    <Container size="xl" p="xl" pb={96}>
      <BlogSettingsForm
        title="Blog Settings"
        description="Configure sitemap settings for blog/news articles"
      />
    </Container>
  );
}
```

### Blog Sitemap Generation

Settings are fetched and applied in `/app/(visitor)/blog/sitemap.xml/route.ts`:

```typescript
// Fetch blog settings from KV
const [changefreq, priority] = await Promise.all([
  env.DJAVACOAL_KV.get(KV_KEYS.NEWS_SITEMAP_CHANGEFREQ),
  env.DJAVACOAL_KV.get(KV_KEYS.NEWS_SITEMAP_PRIORITY),
]);

const blogSettings = {
  changefreq: changefreq || "daily",
  priority: priority ? parseFloat(priority) : 0.65,
};

const sitemap = generateBlogSitemap(articles, baseURL, blogSettings);
```

### Public API Integration

Settings are included in the news metadata endpoint:

```typescript
// In /api/public/news/{slug}/metadata
const [changefreq, priority] = await Promise.all([
  env.DJAVACOAL_KV.get(KV_KEYS.NEWS_SITEMAP_CHANGEFREQ),
  env.DJAVACOAL_KV.get(KV_KEYS.NEWS_SITEMAP_PRIORITY),
]);

return {
  body: {
    data: {
      // ...other metadata
      sitemap_changefreq: changefreq || "daily",
      sitemap_priority: priority ? parseFloat(priority) : 0.65,
    },
  },
};
```

## Dependencies

### External Packages
- `@tanstack/react-query` - Data fetching and caching
- `zod` - Schema validation
- `@mantine/core` - UI components (Select, NumberInput, Button)
- `@mantine/notifications` - Toast notifications

### Internal Dependencies
- `@/adapters/kv/constants` - KV key constants
- `@/lib/orpc/server` - RPC base configuration
- `@/lib/rpc` - Client-side RPC client
- `@/features/sitemap` - Sitemap generation functions

## Usage Examples

### Viewing Current Settings

```typescript
const { data, isLoading } = rpc.blogSettings.getBlogSettings.useQuery({});

// data.sitemap_changefreq: "daily"
// data.sitemap_priority: 0.65
```

### Updating Settings

```typescript
const updateMutation = rpc.blogSettings.updateBlogSettings.useMutation({
  onSuccess: () => {
    notifications.show({
      title: "Success",
      message: "Blog settings saved successfully",
      color: "green",
    });
  },
});

await updateMutation.mutateAsync({
  sitemap_changefreq: "weekly",
  sitemap_priority: 0.8,
});
```

## Sitemap Configuration Guide

### Priority Values
- `0.9-1.0` - Very important (homepage, main landing pages)
- `0.7-0.8` - Important content (popular blog posts)
- `0.5-0.6` - Standard content (regular blog posts)
- `0.3-0.4` - Less important (archive pages)

### Change Frequency Values
- `always` - Content changes every time accessed (real-time data)
- `hourly` - Breaking news, live feeds
- `daily` - **Default for blogs** - Daily blog posts
- `weekly` - Weekly updated content
- `monthly` - Occasional updates
- `yearly` - Rarely updated
- `never` - Archived content

**Recommended for blogs**: `changefreq: "daily"`, `priority: 0.65`

## Error Handling

### Server-Side
- `INTERNAL_SERVER_ERROR` - KV read/write operation failed
- Validation errors handled by Zod schemas

### Client-Side
- Network errors shown via Mantine notifications
- Form validation errors displayed inline
- Priority range validation (0.0 - 1.0)
- Required field validation

## Best Practices for AI Agents

### When Adding Features
1. Always provide default values if KV keys are missing
2. Convert string values from KV to proper types (parseFloat)
3. Use consistent KV key naming convention (`sitemap:` prefix)
4. Update both sitemap generation AND public API endpoints
5. Validate changefreq enum values

### When Modifying
1. Check both KV read and write operations
2. Update schemas in both `server/schemas.ts` and form validation
3. Maintain consistency with sitemap XML protocol
4. Ensure settings are cached appropriately
5. Test sitemap generation after changes

### When Debugging
1. Check RPC registration in `/src/adapters/rpc/index.ts`
2. Verify KV keys match constants
3. Test sitemap.xml generation at `/blog/sitemap.xml`
4. Check public API at `/api/public/news/{slug}/metadata`
5. Review Cloudflare KV dashboard for stored values

## SEO Best Practices

1. **Realistic Change Frequency**: Set changefreq to match actual update patterns
2. **Consistent Priority**: Use same priority for all blog posts (0.6-0.7 range)
3. **Don't Over-Optimize**: Higher values don't guarantee better ranking
4. **Match Content Type**: Daily changefreq is appropriate for blogs
5. **Monitor Impact**: Track crawl rates in Google Search Console

## Common Change Frequency Patterns

```typescript
const commonPatterns = {
  // Active news blog (updated multiple times daily)
  activeNews: { changefreq: "daily", priority: 0.7 },
  
  // Regular blog (new posts weekly)
  regularBlog: { changefreq: "weekly", priority: 0.65 },
  
  // Archive blog (old posts rarely updated)
  archiveBlog: { changefreq: "monthly", priority: 0.5 },
  
  // Corporate blog (occasional updates)
  corporateBlog: { changefreq: "monthly", priority: 0.6 },
};
```

## Related Features

- **sitemap** - Consumes these settings for XML generation
- **public-api** - Exposes settings in metadata endpoint
- **dashboard-news** - News articles affected by these settings
- **dashboard-auth** - Provides authentication

## Future Enhancements

- [ ] Per-article custom changefreq/priority (override defaults)
- [ ] Analytics integration (track actual update frequency)
- [ ] Automatic changefreq adjustment based on publish patterns
- [ ] Preview sitemap changes before saving
- [ ] History of sitemap settings changes
- [ ] Bulk operations for multiple content types
- [ ] SEO recommendations based on content type
- [ ] Integration with Google Search Console API

## License

Part of the Djavacoal project. See main project LICENSE file.
