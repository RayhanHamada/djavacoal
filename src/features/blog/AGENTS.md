# Blog Feature

## Overview

This feature provides the public-facing blog/news display for visitors of the Djavacoal website. It consumes news articles published via the `dashboard-news` feature and displays them with pagination, filtering, and detail views. Content is fetched from the Public API with full bilingual support (English/Arabic).

## Architecture

### Directory Structure

```
blog/
├── components/          # UI components organized by atomic design
│   ├── atoms/          # Basic blog UI elements
│   │   ├── arrow-icon.tsx           # Directional arrow icons
│   │   ├── back-button.tsx          # Navigation back button
│   │   ├── blog-card-skeleton.tsx   # Loading skeleton for cards
│   │   ├── blog-content.tsx         # HTML content renderer
│   │   ├── date-badge.tsx           # Date display component
│   │   ├── pagination-arrow.tsx     # Pagination arrow button
│   │   └── pagination-button.tsx    # Pagination number button
│   ├── molecules/      # Composite blog components
│   │   ├── blog-card.tsx            # Individual article card
│   │   ├── blog-detail-header.tsx   # Article detail header
│   │   ├── blog-grid-skeleton.tsx   # Loading skeleton for grid
│   │   ├── blog-grid.tsx            # Grid layout for articles
│   │   ├── blog-hero.tsx            # Blog page hero section
│   │   ├── pagination.tsx           # Pagination controls
│   │   ├── related-articles-api.tsx # Related articles from API
│   │   └── related-articles.tsx     # Related articles display
│   └── organisms/      # Complex blog sections
│       ├── blog-detail-section.tsx  # Full article view
│       └── blog-list-section.tsx    # Article list with pagination
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Article Listing**
   - Paginated list of published articles
   - Responsive grid layout
   - Loading skeletons during fetch
   - Empty state handling

2. **Article Detail**
   - Full article view with rich HTML content
   - Cover image display
   - Published date
   - Back navigation
   - Related articles section

3. **Pagination**
   - Previous/Next navigation
   - Page number selection
   - Current page highlighting
   - Responsive pagination controls

4. **Bilingual Support**
   - Automatic locale detection from cookies
   - English and Arabic content display
   - RTL support for Arabic
   - Localized date formatting

5. **SEO Optimization**
   - Dynamic metadata generation
   - OpenGraph tags
   - Structured data for articles
   - Semantic HTML

## Technical Implementation

### Data Fetching

All data is fetched from the Public API (`/api/public/news`):

```typescript
// List articles (used in blog list page)
GET /api/public/news?page=1&limit=12

// Get article detail (used in blog detail page)
GET /api/public/news/{slug}

// Get article metadata (used for SEO)
GET /api/public/news/{slug}/metadata
```

### Component Hierarchy

**Blog List Page** (`/blog`):
```
BlogListSection
├── BlogHero (title)
├── BlogGrid
│   └── BlogCard[] (article cards)
└── Pagination
    ├── PaginationArrow (prev)
    ├── PaginationButton[] (page numbers)
    └── PaginationArrow (next)
```

**Blog Detail Page** (`/blog/[slug]`):
```
BlogDetailSection
├── BlogDetailHeader
│   ├── BackButton
│   ├── Title
│   ├── DateBadge
│   └── Cover Image
├── BlogContent (HTML content)
└── RelatedArticlesApi
    └── BlogGrid
        └── BlogCard[] (related articles)
```

### Component Organization

Following Atomic Design principles:

**Atoms** - Basic building blocks:
- `ArrowIcon` - Directional arrows for navigation
- `BackButton` - Navigate back to article list
- `BlogCardSkeleton` - Loading placeholder for article cards
- `BlogContent` - Renders sanitized HTML content
- `DateBadge` - Displays formatted publish date
- `PaginationArrow` - Arrow buttons for pagination
- `PaginationButton` - Individual page number buttons

**Molecules** - Composite components:
- `BlogCard` - Article preview card with image, title, excerpt, date
- `BlogDetailHeader` - Article header with title, date, cover image
- `BlogGrid` - Responsive grid layout for article cards
- `BlogGridSkeleton` - Loading state for article grid
- `BlogHero` - Hero section with page title
- `Pagination` - Complete pagination controls
- `RelatedArticles` - Display related articles
- `RelatedArticlesApi` - Fetch and display related articles from API

**Organisms** - Complex sections:
- `BlogDetailSection` - Complete article detail view
- `BlogListSection` - Complete article list with pagination

## Styling

### CSS Organization

Custom styles in `blog-content.css`:
- Typography for article content
- Image styling
- List formatting
- Code block styling
- Quote styling
- Table styling

### Responsive Design

- Mobile-first approach
- Grid adapts to screen size (1-3 columns)
- Touch-friendly pagination controls
- Optimized images for different viewports

### RTL Support

- Automatic direction switching for Arabic
- Mirrored layouts in RTL mode
- Proper text alignment
- Correct arrow directions

## Integration Points

### Public API

Consumes endpoints from `src/features/public-api/`:
- `GET /api/public/news` - List articles with pagination
- `GET /api/public/news/{slug}` - Get article detail
- `GET /api/public/news/{slug}/metadata` - Get SEO metadata

### Dashboard News

Articles displayed here are managed via `dashboard-news` feature:
- Only published articles are visible
- Articles must have `published_at` date in the past
- Content is fetched from R2 storage
- Images are served via Cloudflare R2

### i18n

Uses `next-intl` for internationalization:
- Page titles and labels from translation files
- Date formatting based on locale
- Content language from API based on locale cookie

### Routes

- `/blog` - Article list page
- `/blog/[slug]` - Article detail page

## Data Flow

1. **User visits `/blog`**
   - Page component reads `page` query param
   - Calls Public API with page number
   - Receives paginated article list
   - Renders `BlogListSection` with articles
   - Shows pagination controls

2. **User clicks article**
   - Navigate to `/blog/[slug]`
   - Calls Public API with slug
   - Receives article content from R2
   - Renders `BlogDetailSection` with full article
   - Fetches related articles

3. **SEO metadata generation**
   - Next.js calls `generateMetadata` function
   - Fetches metadata from Public API
   - Returns OpenGraph tags, title, description
   - Used for social media sharing

## Constants

No feature-specific constants. Uses:
- `LOCALES` from `@/configs/constants.ts` (EN/AR)
- `COOKIE_NAME` from `@/configs/constants.ts` (locale cookie)
- Public API endpoints from `@/features/public-api/`

## Dependencies

### External Packages
- `next-intl` - Internationalization
- `framer-motion` - Animations (optional)
- `@mantine/core` - UI components (if used)

### Internal Dependencies
- `@/features/public-api` - Data fetching
- `@/configs` - Constants (locales, cookie names)
- `@/components` - Global components (layouts, navigation)

## Usage Examples

### Displaying Article List

```typescript
import { BlogListSection } from "@/features/blog";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  
  return <BlogListSection initialPage={page} />;
}
```

### Displaying Article Detail

```typescript
import { BlogDetailSection } from "@/features/blog";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <BlogDetailSection slug={params.slug} />;
}
```

### Generating Metadata

```typescript
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/news/${params.slug}/metadata`
  );
  const data = await response.json();
  
  return {
    title: data.meta_title,
    description: data.meta_description,
    openGraph: {
      images: [data.cover_image_url],
    },
  };
}
```

## Error Handling

### Client-Side
- Loading states with skeleton components
- Empty state when no articles found
- Error boundaries for failed fetches
- Graceful degradation for missing images

### Server-Side
- 404 page for non-existent articles
- Error pages for API failures
- Fallback content when API is unavailable

## Performance Optimization

### Loading Strategies
- Skeleton components during data fetch
- Progressive image loading
- Lazy loading for related articles
- Pagination to limit data fetched

### Caching
- Next.js automatic caching for static content
- Revalidation based on publish frequency
- CDN caching via Cloudflare

### Images
- Optimized image formats (WebP)
- Responsive image sizes
- Lazy loading below fold
- R2 CDN delivery

## Best Practices for AI Agents

### When Adding Features
1. Follow atomic design pattern for new components
2. Use Public API for all data fetching
3. Implement loading states with skeletons
4. Support both EN and AR locales
5. Add proper TypeScript types

### When Modifying
1. Test with both English and Arabic content
2. Verify RTL layout in Arabic mode
3. Check responsive design on all screen sizes
4. Ensure pagination works correctly
5. Test with various content lengths

### When Debugging
1. Check Public API responses in Network tab
2. Verify locale cookie is set correctly
3. Inspect article status and publish dates
4. Check R2 content keys match database
5. Validate HTML content renders properly

## SEO Considerations

Articles include:
- Dynamic meta titles and descriptions
- OpenGraph images (cover photos)
- Structured data (Article schema)
- Canonical URLs
- Sitemap integration

## Related Features

- **dashboard-news** - Creates and manages articles displayed here
- **public-api** - Provides REST endpoints for data fetching
- **home** - May display featured/recent articles
- **about-company** - May link to news/press releases

## Future Enhancements

- [ ] Article search functionality
- [ ] Tag-based filtering
- [ ] Category/section filtering
- [ ] Author pages
- [ ] Comments system
- [ ] Social sharing buttons
- [ ] Reading progress indicator
- [ ] Estimated reading time
- [ ] Article bookmarking
- [ ] Newsletter subscription
- [ ] RSS feed

## License

Part of the Djavacoal project. See main project LICENSE file.
