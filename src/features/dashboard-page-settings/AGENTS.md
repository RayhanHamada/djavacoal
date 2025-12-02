# Dashboard Page Settings Feature

## Overview

This feature provides SEO metadata management for static pages in the Djavacoal application. Admins can define and manage page-level SEO settings including meta titles, descriptions, keywords, OpenGraph images, and sitemap configuration (priority, change frequency) for all application pages.

## Architecture

### Directory Structure

```
dashboard-page-settings/
├── components/          # UI components organized by atomic design
│   ├── atoms/          # Basic UI elements
│   │   ├── og-image-picker.tsx    # OpenGraph image selection component
│   │   └── page-metadata-table-cells.tsx
│   ├── molecules/      # Composite components (drawers, modals)
│   │   ├── create-page-metadata-drawer.tsx
│   │   ├── edit-page-metadata-drawer.tsx
│   │   ├── delete-page-metadata-modal.tsx
│   │   └── page-metadata-table-actions.tsx
│   └── organisms/      # Complex sections (page settings list, editor)
├── hooks/              # React hooks for page settings operations
├── lib/                # Business logic, constants, and form schemas
│   ├── constants.ts    # Validation limits, sitemap configuration
│   ├── form-schema.ts  # Mantine form validation schemas
│   └── index.ts        # Barrel exports
├── server/             # Server-side logic (RPC functions)
│   ├── functions.ts    # oRPC callable functions
│   ├── schemas.ts      # Zod schemas for input/output validation
│   ├── helpers.ts      # Server-side utility functions
│   ├── router.ts       # RPC router exports
│   └── index.ts        # Server module exports
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Page Metadata Management**
   - Create page metadata entries
   - Update existing page metadata
   - Delete page metadata entries
   - List all page metadata with pagination
   - Get single page metadata by ID

2. **SEO Fields**
   - Path: Unique page URL path
   - Meta Title: SEO title for search engines
   - Meta Description: SEO description
   - Meta Keywords: Array of keywords
   - Sitemap Priority: 0.0 - 1.0 (importance)
   - Sitemap Change Frequency: always, hourly, daily, weekly, monthly, yearly, never
   - OpenGraph Image: Optional image for social media sharing (stored in R2)

3. **OpenGraph Image Management**
   - Direct upload via FileButton (presigned URL to R2)
   - Select images from centralized gallery
   - Preview with 1200×630 aspect ratio (recommended OG image size)
   - Remove existing OG image
   - Images stored in R2 under `page-metadata/og-images/` prefix

4. **Path Validation**
   - Unique path enforcement
   - URL format validation
   - Duplicate prevention

5. **Authentication**
   - All operations require admin authentication
   - Session validation via Better Auth

## Technical Implementation

### Server-Side (RPC Functions)

All server functions are located in `server/functions.ts` and registered in the RPC router as `pageSettings`:

#### Available RPC Functions

```typescript
// List page metadata with pagination and search
rpc.pageSettings.listPageMetadata.useQuery({
  search: "/about",
  page: 1,
  limit: 20
})

// Get single page metadata by ID
rpc.pageSettings.getPageMetadataById.useQuery({ id: 123 })

// Create new page metadata
rpc.pageSettings.createPageMetadata.useMutation()

// Update existing page metadata
rpc.pageSettings.updatePageMetadata.useMutation()

// Delete page metadata
rpc.pageSettings.deletePageMetadata.useMutation()

// Generate presigned URL for OG image upload
rpc.pageSettings.generateOgImageUploadUrl.useMutation()
```

### Database Schema

Page metadata is stored in the `page_metadatas` table:

```typescript
{
  id: number;                      // Primary key (auto-increment)
  path: string;                    // Unique page path (e.g., "/about", "/products")
  metadata_title: string;          // SEO title
  metadata_description: string;    // SEO description
  metadata_keywords: string[];     // Array of keywords (stored as JSON)
  sitemap_priority: number;        // 0.0 to 1.0 (default: 0.5)
  sitemap_changefreq: ChangeFreq;  // always, hourly, daily, weekly, monthly, yearly, never
  og_image_key: string | null;     // OpenGraph image key in R2 (optional)
  created_at: Date;                // Auto-generated
  updated_at: Date;                // Auto-updated
}
```

### Helper Functions

Located in `server/helpers.ts`:

```typescript
// Find page metadata by ID
findPageMetadataById(db, id: number): Promise<PageMetadata | null>

// Check if path is available (excluding optional ID)
isPathAvailable(db, path: string, excludeId?: number): Promise<boolean>
```

## Constants

Located in `@/adapters/d1/constants.ts`:

```typescript
PAGE_METADATA_COLUMNS = {
  PATH: "path",
  METADATA_TITLE: "metadata_title",
  METADATA_DESCRIPTION: "metadata_description",
  METADATA_KEYWORDS: "metadata_keywords",
  SITEMAP_PRIORITY: "sitemap_priority",
  SITEMAP_CHANGEFREQ: "sitemap_changefreq",
  OG_IMAGE_KEY: "og_image_key"
}

// Valid change frequency values
type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
```

### R2 Storage

OpenGraph images uploaded directly are stored in R2 with a dedicated prefix:

```typescript
// Located in @/adapters/r2/constants.ts
PAGE_METADATA_OG_PREFIX = "page-metadata/og-images"
```

## Database Migration

When changes are made to the database schema (e.g., adding `og_image_key` column), apply migrations:

```bash
# Generate migration from schema changes (already done)
bun d1:generate

# Apply migration to remote D1 database (choose based on environment)
bun d1:migrate:development  # For development environment
bun d1:migrate:production   # For production environment
```

**Migration file**: `src/adapters/d1/migrations/0020_dusty_squirrel_girl.sql`
```sql
ALTER TABLE `page_metadatas` ADD `og_image_key` text;
```

## Integration Points

### RPC Router Registration
```typescript
import { router as pageSettings } from "@/features/dashboard-page-settings/server";

const router = {
  pageSettings,
  // ...other routers
};
```

### Route Page
Used in admin route `/dashboard/page-settings`:

```typescript
import { PageSettingsListView } from "@/features/dashboard-page-settings";

export default function PageSettingsPage() {
  return <PageSettingsListView />;
}
```

### Sitemap Generation
Page metadata is used in `/app/sitemap.xml/route.ts`:

```typescript
import { getDB } from "@/adapters/d1/db";
import { pageMetadatas } from "@/adapters/d1/schema";

export async function GET() {
  const db = getDB(env.DJAVACOAL_DB);
  
  const pages = await db.select().from(pageMetadatas);
  
  const urls = pages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastModified: page.updated_at,
    changeFrequency: page.sitemap_changefreq,
    priority: page.sitemap_priority
  }));
  
  // Generate XML sitemap...
}
```

### Page-Level SEO
Page components can fetch their metadata:

```typescript
// In page component or layout
const metadata = await getPageMetadata("/about");

export const metadata: Metadata = {
  title: metadata.metadata_title,
  description: metadata.metadata_description,
  keywords: metadata.metadata_keywords
};
```

## Dependencies

### External Packages
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` - Database operations
- `zod` - Schema validation
- `@mantine/core`, `@mantine/hooks` - UI components
- `@mantine/form` - Form management

### Internal Dependencies
- `@/adapters/d1` - Database access and constants
- `@/features/dashboard-auth` - Authentication
- `@/features/dashboard-gallery` - Gallery photos for OG image selection
- `@/lib/orpc/server` - RPC base configuration
- `@/lib/rpc` - Client-side RPC client

## Usage Examples

### Creating Page Metadata with OpenGraph Image

```typescript
const createMutation = rpc.pageSettings.createPageMetadata.useMutation();

await createMutation.mutateAsync({
  path: "/about-company",
  metadata_title: "About Djavacoal - Leading Coal Supplier",
  metadata_description: "Learn about Djavacoal's history and mission",
  metadata_keywords: ["about", "company", "coal", "supplier"],
  sitemap_priority: 0.8,
  sitemap_changefreq: "monthly",
  og_image_key: "gallery/abc123-og-image.jpg" // Optional R2 key
});
```

### Listing Page Metadata

```typescript
const { data, isLoading } = rpc.pageSettings.listPageMetadata.useQuery({
  search: "",
  page: 1,
  limit: 20
});

// data.items: PageMetadata[] (includes og_image_key)
// data.total: number
// data.page: number
// data.pageSize: number
```

### Updating Page Metadata

```typescript
const updateMutation = rpc.pageSettings.updatePageMetadata.useMutation();

await updateMutation.mutateAsync({
  id: 123,
  path: "/about-company",
  metadata_title: "Updated Title",
  metadata_description: "Updated description",
  metadata_keywords: ["about", "company"],
  sitemap_priority: 0.9,
  sitemap_changefreq: "weekly",
  og_image_key: "gallery/new-og-image.jpg" // null to remove
});
```

### Using the OgImagePicker Component

The `OgImagePicker` component supports two methods for selecting OpenGraph images:

1. **Direct Upload**: Upload images directly via FileButton (uses presigned URL)
2. **Gallery Selection**: Choose from existing images in the centralized gallery

```tsx
import { OgImagePicker } from "@/features/dashboard-page-settings/components/atoms";

<OgImagePicker
  value={form.getValues().og_image_key}
  onChange={(key) => form.setFieldValue("og_image_key", key)}
  disabled={isLoading}
/>
```

### Deleting Page Metadata

```typescript
const deleteMutation = rpc.pageSettings.deletePageMetadata.useMutation();

await deleteMutation.mutateAsync({ id: 123 });
```

### Direct Upload of OpenGraph Image

The `generateOgImageUploadUrl` function generates a presigned URL for uploading images directly to R2:

```typescript
// Step 1: Get presigned URL
const { uploadUrl, key } = await client.pageSettings.generateOgImageUploadUrl({
  fileName: "my-og-image.jpg",
  contentType: "image/jpeg",
  fileSize: 1024 * 500, // 500KB
});

// Step 2: Upload file directly to R2
await fetch(uploadUrl, {
  method: "PUT",
  body: file,
  headers: { "Content-Type": file.type },
});

// Step 3: Save the key with page metadata
await updateMutation.mutateAsync({
  id: 123,
  og_image_key: key, // e.g., "page-metadata/og-images/abc123"
  // ...other fields
});
```

## Sitemap Configuration Guide

### Priority Values
- `1.0` - Homepage
- `0.8` - Important pages (About, Products)
- `0.6` - Secondary pages (Contact, Production Info)
- `0.5` - Default value
- `0.3` - Less important pages

### Change Frequency Values
- `always` - Content changes every time accessed
- `hourly` - News, real-time data
- `daily` - Blog posts, frequently updated content
- `weekly` - Regular updates (products, team)
- `monthly` - Occasional updates (about, history)
- `yearly` - Rarely updated (legal pages)
- `never` - Archived content

## Error Handling

### Server-Side
- `NOT_FOUND` - Page metadata doesn't exist
- `BAD_REQUEST` - Path already exists, invalid input
- `UNAUTHORIZED` - No valid session
- `INTERNAL_SERVER_ERROR` - Database operation failed

### Client-Side
- Network errors shown via Mantine notifications
- Form validation errors displayed inline
- Path uniqueness validation
- Priority range validation (0.0 - 1.0)

## Best Practices for AI Agents

### When Adding Features
1. Always validate path uniqueness before creation
2. Use proper sitemap values (priority 0-1, valid changefreq)
3. Store keywords as JSON array, not comma-separated string
4. Match path format to actual route paths
5. Export new components through barrel files

### When Modifying
1. Check both database uniqueness and route existence
2. Update schemas in both `server/schemas.ts` and form validation
3. Maintain consistency with Next.js metadata API
4. Verify sitemap generation still works
5. Ensure authentication in all server operations

### When Debugging
1. Check RPC registration in `/src/adapters/rpc/index.ts`
2. Verify path format matches actual routes
3. Test sitemap.xml generation
4. Check JSON array storage for keywords
5. Review D1 database for data integrity

## SEO Best Practices

1. **Unique Titles**: Each page should have unique meta title
2. **Description Length**: 150-160 characters for descriptions
3. **Keywords**: 5-10 relevant keywords per page
4. **Priority**: Reserve 1.0 for homepage only
5. **Change Frequency**: Match actual update frequency

## Common Page Paths

Typical pages to configure:

```typescript
const commonPages = [
  { path: "/", priority: 1.0, changefreq: "daily", og_image_key: "gallery/home-og.jpg" },
  { path: "/about-company", priority: 0.8, changefreq: "monthly", og_image_key: null },
  { path: "/our-products", priority: 0.9, changefreq: "weekly", og_image_key: "gallery/products-og.jpg" },
  { path: "/production-info", priority: 0.7, changefreq: "monthly", og_image_key: null },
  { path: "/contact-us", priority: 0.6, changefreq: "yearly", og_image_key: null },
  // Dynamic routes handled separately
];
```

## Related Features

- **dashboard-news** - News articles have their own SEO metadata
- **dashboard-product** - Products may have dynamic SEO
- **dashboard-gallery** - Provides images for OG image selection
- **sitemap.xml** - Consumes this metadata
- **dashboard-auth** - Provides authentication

## Future Enhancements

- [x] Open Graph image (og:image) - Implemented via gallery picker
- [ ] Twitter Card metadata
- [ ] Canonical URL management
- [ ] Robots meta tags (noindex, nofollow)
- [ ] Structured data / Schema.org
- [ ] Language alternates (hreflang)
- [ ] Automatic meta description generation
- [ ] SEO score/analysis
- [ ] Bulk import/export
- [ ] Preview how page appears in search results

## License

Part of the Djavacoal project. See main project LICENSE file.
