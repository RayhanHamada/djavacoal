# Dashboard News Feature

## Overview

This feature provides comprehensive news/blog article management for the Djavacoal admin dashboard. It supports bilingual content (English and Arabic), rich text editing, image uploads, tagging, status management (draft/published/unpublished), and scheduling. Content is stored in Cloudflare R2 with metadata in D1.

## Architecture

### Directory Structure

```
dashboard-news/
├── components/          # UI components organized by atomic design
│   ├── atoms/          # Basic news UI elements
│   ├── lib/            # Component-specific utilities (table columns)
│   ├── molecules/      # Composite news components (filters, status badges)
│   ├── organisms/      # Complex news sections (article list, editor)
│   └── pages/          # Page-level components
├── hooks/              # React hooks for news operations
├── lib/                # Feature library (constants, form schemas)
│   ├── constants.ts    # Validation limits, status values, field errors
│   ├── form-schemas.ts # Mantine form validation schemas
│   └── index.ts        # Barrel exports
├── server/             # Server-side logic (RPC functions)
│   ├── functions.ts    # oRPC callable functions
│   ├── schemas.ts      # Zod schemas for input/output validation
│   ├── router.ts       # RPC router exports
│   └── index.ts        # Server module exports
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Article Management**
   - Create articles with bilingual content (English/Arabic)
   - Update existing articles
   - Delete articles (with R2 cleanup)
   - List articles with advanced filtering
   - Get single article with full content

2. **Content Storage**
   - HTML content stored in R2 (separate files for EN/AR)
   - Metadata in D1 database
   - Images uploaded to R2 with presigned URLs
   - Unique slug validation

3. **Status Management**
   - Draft: Work in progress, not visible
   - Published: Live and visible to public
   - Unpublished: Previously published, now hidden
   - Status transition validation
   - Publish date tracking

4. **Tagging System**
   - Auto-create tags from article metadata
   - Tag-based filtering
   - Tag search and listing
   - Bulk tag creation

5. **Filtering & Search**
   - Title search
   - Filter by tags (multiple)
   - Filter by status
   - Filter by published date range
   - Filter by created date range
   - Filter by pinned to home (toggle)
   - Pagination

6. **Scheduling**
   - Set future publish dates
   - Migration mode for importing old articles with past dates
   - Fresh mode for new articles

7. **Pin to Home**
   - Pin/unpin articles to display on homepage carousel
   - Maximum 7 articles can be pinned at once
   - Only published (non-scheduled) articles can be pinned
   - Auto-unpin when article is unpublished or moved to draft
   - Pinned badge displayed in table
   - Filter to show only pinned articles

## Technical Implementation

### Server-Side (RPC Functions)

All server functions are located in `server/functions.ts` and registered in the RPC router as `dashboardNews`:

#### Available RPC Functions

```typescript
// List articles with filters
rpc.dashboardNews.listNews.useQuery({
  page: 1,
  limit: 20,
  titleSearch: "product",
  tags: ["manufacturing", "quality"],
  status: "published" | "draft" | "unpublished" | "all",
  publishedFrom: new Date("2024-01-01"),
  publishedTo: new Date("2024-12-31"),
  createdFrom: new Date("2024-01-01"),
  createdTo: new Date("2024-12-31")
})

// Get single article with full content
rpc.dashboardNews.getNewsById.useQuery({ id: 123 })

// Create new article
rpc.dashboardNews.createNews.useMutation()

// Update existing article
rpc.dashboardNews.updateNews.useMutation()

// Delete article
rpc.dashboardNews.deleteNews.useMutation()

// Change article status
rpc.dashboardNews.changeStatus.useMutation()

// Toggle pin to home
rpc.dashboardNews.togglePinToHome.useMutation()

// Check if slug is available
rpc.dashboardNews.checkSlugAvailability.useQuery({
  slug: "new-product-launch",
  excludeId: 123 // optional
})

// Generate presigned URL for image upload
rpc.dashboardNews.generateImageUploadUrl.useMutation()

// Tag management
rpc.dashboardNews.listTags.useQuery({ limit: 100, search: "quality" })
rpc.dashboardNews.createTag.useMutation()
rpc.dashboardNews.bulkCreateTags.useMutation()
```

### Database Schema

#### `news` table
```typescript
{
  id: number;                    // Primary key (auto-increment)
  slug: string;                  // Unique URL slug
  image_key: string | null;      // R2 image key
  metadata_title: string;        // SEO title
  metadata_description: string;  // SEO description
  metadata_tag_list: string[];   // Tags (JSON array)
  en_title: string;              // English title
  en_content_key: string;        // R2 key for English HTML
  ar_title: string;              // Arabic title
  ar_content_key: string;        // R2 key for Arabic HTML
  status: "draft" | "published" | "unpublished";
  is_pinned_to_home: boolean;    // Whether pinned to homepage carousel
  published_at: Date | null;     // When article was published
  published_by: string | null;   // Admin user ID who published
  created_at: Date;              // Auto-generated
  created_by: string;            // Admin user ID
  updated_at: Date;              // Auto-updated
  updated_by: string;            // Admin user ID
}
```

#### `tags` table
```typescript
{
  id: number;              // Primary key (auto-increment)
  name: string;            // Tag display name
  slug: string;            // Unique URL-safe slug
  created_at: Date;        // Auto-generated
  updated_at: Date;        // Auto-updated
}
```

### Content Storage

- **HTML Content**: Stored in R2 under `news-content/` prefix
  - English: `news-content/{nanoid}-en.html`
  - Arabic: `news-content/{nanoid}-ar.html`
- **Images**: Stored in R2 under `news-images/` prefix
  - `news-images/{nanoid}-{filename}`

## Status Management

### Status Transitions

```
Draft → Published → Unpublished
  ↓         ↓            ↓
Draft     Draft        Published
```

Rules:
- Cannot go from Draft directly to Unpublished (must be published first)
- Publishing sets `published_at` and `published_by`
- Unpublishing keeps `published_at` and `published_by`
- Returning to Draft clears `published_at` and `published_by`

### Scheduling

```typescript
// Fresh mode: New article with future publish date
createNews({
  status: "published",
  publishedAt: new Date("2024-12-31"), // Future date
  mode: "fresh"
});

// Migration mode: Import old article with past date
createNews({
  status: "published",
  publishedAt: new Date("2020-01-01"), // Past date
  mode: "migration"
});
```

## Constants

Located in `@/adapters/d1/constants.ts` and `@/adapters/r2/constants.ts`:

```typescript
// Status values
NEWS_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  UNPUBLISHED: "unpublished"
}

// R2 prefixes
NEWS_CONTENT_PREFIX = "news-content"
NEWS_IMAGES_PREFIX = "news-images"

// Database columns
NEWS_COLUMNS = {
  SLUG: "slug",
  IMAGE_KEY: "image_key",
  METADATA_TITLE: "metadata_title",
  METADATA_DESCRIPTION: "metadata_description",
  METADATA_TAG_LIST: "metadata_tag_list",
  EN_TITLE: "en_title",
  EN_CONTENT_KEY: "en_content_key",
  AR_TITLE: "ar_title",
  AR_CONTENT_KEY: "ar_content_key",
  STATUS: "status",
  IS_PINNED_TO_HOME: "is_pinned_to_home",
  PUBLISHED_AT: "published_at",
  PUBLISHED_BY: "published_by"
}
```

Located in `lib/constants.ts`:

```typescript
// Maximum number of articles that can be pinned to home
MAX_PINNED_NEWS = 7

// Pin to home error messages
PIN_TO_HOME_ERRORS = {
  NOT_PUBLISHED: "Only published articles can be pinned to home",
  SCHEDULED: "Scheduled articles cannot be pinned to home",
  MAX_REACHED: "Maximum number of pinned articles reached (7)"
}
```

### Pin to Home Feature

#### Business Rules

1. **Eligibility**: Only articles with status `published` AND `published_at <= now` can be pinned
2. **Limit**: Maximum 7 articles can be pinned at any time
3. **Auto-unpin**: When an article is unpublished or moved to draft, it is automatically unpinned

#### RPC Function

```typescript
// Toggle pin status
rpc.dashboardNews.togglePinToHome.useMutation({
  onSuccess: (data) => {
    // data.isPinnedToHome: boolean - new pin state
  },
  onError: (error) => {
    // Handle errors:
    // - NOT_PUBLISHED: Article not published
    // - SCHEDULED: Article is scheduled for future
    // - MAX_REACHED: 7 articles already pinned
  }
});
```

#### UI Components

- **NewsPinnedBadge** (atom): Orange badge shown in status column for pinned articles
- **NewsTableActions**: "Pin to Home" / "Unpin from Home" menu item (published non-scheduled only)
- **NewsFilters**: "Show Pinned to Home Only" toggle that resets other filters

## Integration Points

### RPC Router Registration
```typescript
import { router as dashboardNews } from "@/features/dashboard-news/server";

const router = {
  dashboardNews,
  // ...other routers
};
```

### Route Page
Used in admin route `/dashboard/news`:

```typescript
import { NewsListView } from "@/features/dashboard-news";

export default function NewsPage() {
  return <NewsListView />;
}
```

### R2 Storage
- Content: `uploadTextContent()` / `getTextContent()`
- Images: Presigned URLs for browser upload
- Cleanup: `deleteObject()` on article deletion

### Auto-Tag Creation
Tags are automatically created when referenced in article metadata:

```typescript
// When creating/updating article with new tags
if (input.metadataTags.length > 0) {
  const nameSlugPairs = input.metadataTags.map(name => ({
    name,
    slug: sluggify(name) // lowercase, replace non-alphanumeric
  }));
  
  await db.insert(tags)
    .values(nameSlugPairs)
    .onConflictDoNothing(); // Ignore if already exists
}
```

## Dependencies

### External Packages
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` - Database operations
- `nanoid` - Unique ID generation
- `zod` - Schema validation
- `@mantine/core`, `@mantine/hooks` - UI components
- Rich text editor (TipTap, Lexical, or similar)

### Internal Dependencies
- `@/adapters/d1` - Database access and constants
- `@/adapters/r2` - R2 storage operations
- `@/features/dashboard-auth` - Authentication
- `@/lib/orpc/server` - RPC base configuration
- `@/lib/rpc` - Client-side RPC client

## Usage Examples

### Creating an Article

```typescript
const createMutation = rpc.dashboardNews.createNews.useMutation();

await createMutation.mutateAsync({
  slug: "new-product-announcement",
  imageKey: "news-images/xyz123",
  metadataTitle: "New Product Announcement",
  metadataDescription: "We're launching a new product",
  metadataTags: ["products", "announcements"],
  enTitle: "New Product Announcement",
  enContent: "<p>We are excited to announce...</p>",
  arTitle: "إعلان منتج جديد",
  arContent: "<p>يسعدنا أن نعلن...</p>",
  status: "published",
  publishedAt: new Date(), // Optional, defaults to now
  mode: "fresh"
});
```

### Filtering Articles

```typescript
const { data } = rpc.dashboardNews.listNews.useQuery({
  page: 1,
  limit: 20,
  titleSearch: "",
  tags: ["manufacturing"],
  status: "published",
  publishedFrom: new Date("2024-01-01"),
  publishedTo: new Date("2024-12-31")
});
```

### Changing Status

```typescript
const statusMutation = rpc.dashboardNews.changeStatus.useMutation();

// Publish draft
await statusMutation.mutateAsync({
  id: 123,
  status: "published"
});

// Unpublish article
await statusMutation.mutateAsync({
  id: 123,
  status: "unpublished"
});
```

## Error Handling

### Server-Side
- `NOT_FOUND` - Article doesn't exist
- `BAD_REQUEST` - Slug already exists, invalid status transition, tag already exists
- `UNAUTHORIZED` - No valid session
- `INTERNAL_SERVER_ERROR` - Database, R2, or email operation failed

### Client-Side
- Network errors shown via Mantine notifications
- Form validation errors displayed inline
- Status transition errors explained to user
- R2 upload failures handled gracefully

## Best Practices for AI Agents

### When Adding Features
1. Always store HTML content in R2, not database
2. Use separate R2 keys for English and Arabic content
3. Auto-create tags, don't require manual creation
4. Validate slugs for uniqueness before creation
5. Track who published and when

### When Modifying
1. Update both EN and AR content together
2. Maintain audit trail (created_by, updated_by)
3. Clean up R2 objects when deleting articles
4. Validate status transitions server-side
5. Handle timezone for publish dates

### When Debugging
1. Check R2 content keys in database vs actual R2 objects
2. Verify tag JSON array structure in database
3. Check status transition logic
4. Review publish date handling for past/future dates
5. Ensure session validation in all operations

## SEO Considerations

Articles include dedicated SEO fields:
- `metadata_title` - SEO title (may differ from `en_title`)
- `metadata_description` - Meta description
- `metadata_tag_list` - Keywords/tags
- `slug` - URL-friendly identifier

## i18n Support

All user-facing content is bilingual:
- `en_title` / `ar_title` - Article titles
- `en_content_key` / `ar_content_key` - HTML content in R2
- Tag names are language-neutral (can add translation later)

## Related Features

- **dashboard-gallery** - Photos used in articles
- **dashboard-auth** - Authentication and user tracking
- **home** / **our-products** - May display published articles
- **dashboard-page-settings** - SEO metadata patterns

## Future Enhancements

- [ ] Article categories/sections
- [ ] Author management (beyond admin users)
- [ ] Article versions/revisions
- [ ] Content preview before publish
- [ ] Social media sharing metadata
- [ ] Article analytics (views, engagement)
- [ ] Related articles suggestions
- [ ] Article templates
- [ ] Markdown support
- [ ] Content translation workflow

## License

Part of the Djavacoal project. See main project LICENSE file.
