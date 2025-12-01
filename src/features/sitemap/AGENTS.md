# Sitemap Feature

## Overview

This feature provides comprehensive sitemap generation for the Djavacoal Next.js application. It generates XML sitemaps following the Sitemaps protocol specification, including a sitemap index and separate sitemaps for static pages and blog articles. All sitemaps are database-driven and use proper caching for optimal performance.

## Architecture

### Directory Structure

```
sitemap/
├── lib/                    # Types and constants
│   ├── types.ts           # TypeScript type definitions
│   ├── constants.ts       # Configuration constants
│   └── index.ts           # Barrel export
├── server/                # Server-side logic
│   ├── helpers.ts         # XML generation utilities
│   ├── functions.ts       # Database queries and sitemap generators
│   └── index.ts           # Barrel export
└── index.ts               # Feature barrel export
```

### Route Structure

```
app/
├── sitemap-index.xml/     # Main sitemap index (lists all sitemaps)
│   └── route.ts
├── static/
│   └── sitemap.xml/       # Static pages sitemap (from page_metadatas table)
│       └── route.ts
├── blog/
│   └── sitemap.xml/       # Blog articles sitemap (from news table)
│       └── route.ts
└── (visitor)/our-products/
    └── sitemap.xml/       # Products sitemap (from products table)
        └── route.ts
```

## Features

### Sitemap Index (`/sitemap-index.xml`)

- Lists all available sitemaps
- References `/sitemap.xml`, `/blog/sitemap.xml`, and `/our-products/sitemap.xml`
- Follows XML sitemap index protocol
- Cached for 1 hour

### Static Pages Sitemap (`/static/sitemap.xml`)

- Database-driven from `page_metadatas` table
- Includes all SEO metadata:
  - `loc`: Full URL of the page
  - `lastmod`: Last modification date (from `updated_at` column)
  - `changefreq`: Change frequency (from `sitemap_changefreq` column)
  - `priority`: Priority value 0.0-1.0 (from `sitemap_priority` column)
- Sorted by path for consistency
- XML-escaped for security

### Blog Sitemap (`/blog/sitemap.xml`)

- Only includes **published** blog articles (filters by status)
- Dynamic configuration:
  - `loc`: `/blog/{slug}` format
  - `lastmod`: Article's last update date (ISO 8601 format)
  - `changefreq`: `daily` (configurable)
  - `priority`: `0.65` (configurable)
- Sorted by update date

### Products Sitemap (`/our-products/sitemap.xml`)

- Only includes **non-hidden** products (filters by `is_hidden = false`)
- Configuration:
  - `loc`: `/our-products/{id}` format
  - `lastmod`: Product's last update date (ISO 8601 format)
  - `changefreq`: `weekly` (default)
  - `priority`: `0.8` (default)
- Sorted by order index

## Technical Implementation

### Database Integration

The feature integrates with three D1 tables:

#### `page_metadatas` Table

```typescript
{
  path: string;              // Page path (e.g., "/", "/about")
  priority: number;          // Sitemap priority (0.0-1.0)
  changefreq: string;        // Change frequency
  updatedAt: Date;           // Last modification timestamp
}
```

#### `news` Table

```typescript
{
  slug: string;              // Article slug for URL
  status: "published";       // Only published articles included
  updatedAt: Date;           // Last modification timestamp
}
```

#### `products` Table

```typescript
{
  id: number;                // Product ID for URL
  is_hidden: boolean;        // Only non-hidden products included
  order_index: number;       // Display order
  updatedAt: Date;           // Last modification timestamp
}
```

### Server Functions

Located in `server/functions.ts`:

#### `getStaticPages(db)`

Fetches all static page metadata from the database:

```typescript
const pages = await getStaticPages(db);
// Returns: StaticPageData[]
```

#### `getBlogArticles(db)`

Fetches all published blog articles:

```typescript
const articles = await getBlogArticles(db);
// Returns: BlogArticleData[]
```

#### `getProducts(db)`

Fetches all non-hidden products:

```typescript
const products = await getProducts(db);
// Returns: ProductData[]
```

#### `generateStaticPagesSitemap(pages, baseURL)`

Generates complete XML sitemap for static pages:

```typescript
const sitemap = generateStaticPagesSitemap(pages, baseURL);
// Returns: string (XML)
```

#### `generateBlogSitemap(articles, baseURL)`

Generates complete XML sitemap for blog articles:

```typescript
const sitemap = generateBlogSitemap(articles, baseURL);
// Returns: string (XML)
```

#### `generateProductsSitemap(products, baseURL)`

Generates complete XML sitemap for products:

```typescript
const sitemap = generateProductsSitemap(products, baseURL);
// Returns: string (XML)
```

#### `generateSitemapEntry(entry)`

Generates a single `<url>` entry with all optional fields:

```typescript
const entry: SitemapEntry = {
  loc: "https://example.com/page",
  lastmod: "2024-11-17T10:00:00Z",
  changefreq: "weekly",
  priority: 0.8
};
const xml = generateSitemapEntry(entry);
```

### Helper Functions

Located in `server/helpers.ts`:

#### `escapeXml(unsafe)`

Escapes special XML characters to prevent injection:

```typescript
const safe = escapeXml("Title & Description <test>");
// Returns: "Title &amp; Description &lt;test&gt;"
```

#### `formatLastMod(date)`

Formats a Date object to ISO 8601 format:

```typescript
const lastmod = formatLastMod(new Date());
// Returns: "2024-11-17T10:00:00.000Z"
```

#### XML Header/Footer Generators

```typescript
generateSitemapHeader()         // Returns: <?xml version...><urlset>
generateSitemapFooter()         // Returns: </urlset>
generateSitemapIndexHeader()    // Returns: <?xml version...><sitemapindex>
generateSitemapIndexFooter()    // Returns: </sitemapindex>
```

### Constants

Located in `lib/constants.ts`:

#### `SITEMAP_CACHE_HEADERS`

Standard cache headers for all sitemap responses:

```typescript
{
  "Content-Type": "application/xml",
  "Cache-Control": "public, max-age=3600, s-maxage=3600"
}
```

#### `BLOG_SITEMAP_CONFIG`

Blog-specific sitemap configuration:

```typescript
{
  priority: 0.65,
  changefreq: "daily"
}
```

#### `PRODUCTS_SITEMAP_CONFIG`

Products-specific sitemap configuration:

```typescript
{
  priority: 0.8,
  changefreq: "weekly"
}
```

### Types

Located in `lib/types.ts`:

#### `SitemapEntry`

Complete sitemap URL entry with all optional fields:

```typescript
type SitemapEntry = {
  loc: string;
  lastmod?: string | null;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};
```

#### `StaticPageData`

Data structure from `page_metadatas` table:

```typescript
type StaticPageData = {
  path: string;
  priority: number | null;
  changefreq: string | null;
  updatedAt: Date | null;
};
```

#### `BlogArticleData`

Data structure from `news` table:

```typescript
type BlogArticleData = {
  slug: string;
  updatedAt: Date | null;
};
```

#### `ProductData`

Data structure from `products` table:

```typescript
type ProductData = {
  id: number;
  updatedAt: Date | null;
};
```

## Route Handler Implementation

All route handlers follow a consistent pattern:

```typescript
export async function GET(_request: Request) {
  // 1. Validate base URL
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseURL) {
    return new Response("Base URL not configured", { status: 500 });
  }

  try {
    // 2. Get Cloudflare context and database
    const { env } = await getCloudflareContext({ async: true });
    const db = getDB(env.DJAVACOAL_DB);

    // 3. Fetch data from database
    const data = await getDataFunction(db);

    // 4. Generate sitemap XML
    const sitemap = generateSitemapFunction(data, baseURL);

    // 5. Return with cache headers
    return new Response(sitemap, {
      headers: SITEMAP_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
```

## Performance Considerations

### Caching

All sitemaps are cached for 1 hour (3600 seconds) via:
- `max-age=3600`: Browser cache
- `s-maxage=3600`: CDN/proxy cache

This reduces database queries and improves response times.

### Database Queries

- Static pages: Single query with sorting by path
- Blog articles: Single query filtering published articles, sorted by update date
- No N+1 queries or complex joins

### XML Generation

- String concatenation for optimal performance
- No XML DOM manipulation
- Proper escaping prevents security issues

## Usage in Application

### Robots.txt Integration

Reference the sitemap index in your `robots.ts`:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}sitemap-index.xml`,
  };
}
```

### Search Engine Submission

Submit the sitemap index to search engines:
- Google Search Console: `https://yourdomain.com/sitemap-index.xml`
- Bing Webmaster Tools: `https://yourdomain.com/sitemap-index.xml`

### Manual Testing

Test all sitemaps locally:

```bash
# Sitemap index
curl http://localhost:3000/sitemap-index.xml

# Static pages sitemap
curl http://localhost:3000/static/sitemap.xml

# Blog sitemap
curl http://localhost:3000/blog/sitemap.xml
```

## Extending the Feature

### Adding a New Sitemap

1. Create a new sitemap route:

```typescript
// app/products/sitemap.xml/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDB } from "@/adapters/d1/db";
import { SITEMAP_CACHE_HEADERS } from "@/features/sitemap/lib/constants";

export async function GET(_request: Request) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseURL) {
    return new Response("Base URL not configured", { status: 500 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDB(env.DJAVACOAL_DB);
    
    // Add your database query
    const products = await getProducts(db);
    
    // Generate sitemap
    const sitemap = generateProductsSitemap(products, baseURL);
    
    return new Response(sitemap, {
      headers: SITEMAP_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("Error generating products sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
```

2. Add query function to `server/functions.ts`:

```typescript
export async function getProducts(
  db: ReturnType<typeof getDB>
): Promise<ProductData[]> {
  return await db
    .select({
      slug: products[PRODUCT_COLUMNS.SLUG],
      updatedAt: products[COMMON_COLUMNS.UPDATED_AT],
    })
    .from(products)
    .where(eq(products[PRODUCT_COLUMNS.IS_HIDDEN], false));
}

export function generateProductsSitemap(
  products: ProductData[],
  baseURL: string
): string {
  let sitemap = generateSitemapHeader();

  for (const product of products) {
    const entry: SitemapEntry = {
      loc: new URL(`/products/${product.slug}`, baseURL).toString(),
      lastmod: formatLastMod(product.updatedAt),
      changefreq: "weekly",
      priority: 0.7,
    };
    sitemap += generateSitemapEntry(entry);
  }

  sitemap += generateSitemapFooter();
  return sitemap;
}
```

3. Update sitemap index to include new sitemap:

```typescript
// app/sitemap-index.xml/route.ts
const productsSitemap = new URL("/products/sitemap.xml", baseURL).toString();

const sitemapIndex = `${generateSitemapIndexHeader()}
    <sitemap>
        <loc>${staticSitemap}</loc>
    </sitemap>
    <sitemap>
        <loc>${blogSitemap}</loc>
    </sitemap>
    <sitemap>
        <loc>${productsSitemap}</loc>
    </sitemap>${generateSitemapIndexFooter()}`;
```

## Best Practices

1. **Always escape XML content**: Use `escapeXml()` for user-generated content
2. **Filter by publication status**: Only include public content
3. **Use proper date formatting**: ISO 8601 format for `lastmod`
4. **Set appropriate cache headers**: Balance freshness with performance
5. **Handle errors gracefully**: Return proper HTTP status codes
6. **Keep sitemaps focused**: Separate concerns (static, dynamic content)
7. **Validate URLs**: Ensure all URLs are absolute and well-formed

## SEO Considerations

- **Priority values**: Use meaningful priorities (0.0-1.0) relative to site importance
- **Change frequency**: Set realistic update frequencies
- **Last modified dates**: Always include when available for better crawl efficiency
- **Sitemap size**: Keep individual sitemaps under 50,000 URLs
- **Update frequency**: Regenerate on content changes (cached responses handle traffic)

## Troubleshooting

### Sitemap returns 500 error

Check:
1. `NEXT_PUBLIC_BASE_URL` environment variable is set
2. Cloudflare context is available
3. Database connection is working
4. Database tables exist and have data

### Missing or incorrect URLs

Check:
1. Database query filters (e.g., published status)
2. URL construction logic
3. Base URL configuration

### XML parsing errors

Check:
1. All content is properly escaped with `escapeXml()`
2. XML structure is well-formed
3. No unescaped special characters (&, <, >, ", ')

## Related Features

- **SEO Metadata**: Page metadata stored in `page_metadatas` table
- **Blog**: News articles published through dashboard
- **Database**: D1 tables for sitemap data
- **Cloudflare**: Context and bindings for database access
