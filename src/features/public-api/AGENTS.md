# Public API Feature

## Overview

This feature provides a RESTful public API for external consumers to access Djavacoal's public data (products, news, contact information, etc.). It uses oRPC with REST-style routes, includes OpenAPI documentation via Redocly, and supports full bilingual responses (English/Arabic) based on locale cookies.

**Key Characteristics:**
- No authentication required
- RESTful endpoints with OpenAPI spec
- Locale-aware responses via cookie
- Type-safe with Zod schemas
- Documented with Redocly

## Architecture

### Directory Structure

```
public-api/
├── hooks/              # React hooks for API consumption (if any)
├── router.ts           # oRPC router with REST endpoints
├── schemas.ts          # Zod schemas for request/response validation
├── api-client.ts       # Generated TypeScript API client
├── constants.ts        # API-related constants
├── redocly.yaml        # Redocly configuration
├── typegen.ts          # OpenAPI spec generation script
├── client/             # Generated API client files
└── server/             # Server-side utilities (if any)
```

## Features

### Available Endpoints

1. **Product Endpoints**
   - `GET /api/public/products-names` - List product names with IDs and slugs
   - `GET /api/public/products/{id}` - Get complete product details

2. **Content Endpoints**
   - `GET /api/public/home-content` - Homepage data (banners, featured products, etc.)
   - `GET /api/public/footer-content` - Footer data (social links, contact info)
   - `GET /api/public/about-company-content` - About page data (team, galleries, etc.)
   - `GET /api/public/packaging-info-content` - Packaging options data

3. **News Endpoints**
   - `GET /api/public/news` - List published news articles with pagination
   - `GET /api/public/news/{slug}` - Get article detail with full content
   - `GET /api/public/news/{slug}/metadata` - Get article SEO metadata

4. **Contact Endpoint**
   - `GET /api/public/getContactUs` - Get contact information

## Technical Implementation

### oRPC Router Configuration

Located in `router.ts`, uses custom oRPC base with middleware:

```typescript
import base from "@/lib/orpc/server";
import { injectNextCookies } from "@/lib/orpc/middlewares";

// Public API base with cookie injection
const publicBase = base.use(injectNextCookies);

export const router = {
  listProductNames: publicBase
    .route({
      method: "GET",
      path: "/products-names",
      summary: "List product names",
      description: "List product names with localization support",
      inputStructure: "detailed",
      outputStructure: "detailed",
    })
    .input(z.object({ query: LIST_PRODUCT_NAME_QUERY_INPUT_SCHEMA }))
    .output(z.object({ body: LIST_PRODUCT_NAME_BODY_OUTPUT_SCHEMA }))
    .handler(async ({ context: { env, locale }, input: { query } }) => {
      // Implementation
    }),
  // ... other endpoints
};
```

### Middleware Chain

**injectNextCookies Middleware:**
- Reads Next.js cookies from request
- Extracts locale from `locale` cookie
- Injects into oRPC context as `locale` property
- Automatically applied to all public API routes

**injectCFContext Middleware:**
- Injects Cloudflare environment bindings
- Provides access to D1, R2, KV
- Applied via base oRPC configuration

### Schema Definitions

All request/response schemas in `schemas.ts` using Zod:

```typescript
// Input schema with defaults
export const LIST_PRODUCT_NAME_QUERY_INPUT_SCHEMA = z
  .object({
    limit: z.number().min(5).default(5).describe("Maximum number of product names to return"),
  })
  .default({ limit: 5 });

// Output schema
export const LIST_PRODUCT_NAME_BODY_OUTPUT_SCHEMA = z.object({
  data: z.object({
    names: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
      })
    ),
    meta: z.object({
      total: z.number(),
    }),
  }),
});
```

### Route Handler

API routes are handled by `src/app/api/public/[...rest]/route.ts`:

```typescript
import { createOpenNextJsHandler } from "@orpc/next";
import { router } from "@/features/public-api/router";

const handler = createOpenNextJsHandler({
  router,
  path: "/api/public",
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
```

## Endpoint Details

### Product Endpoints

**List Product Names**
```
GET /api/public/products-names?limit=10
```
Response:
```json
{
  "data": {
    "names": [
      { "id": 1, "name": "Steam Coal", "slug": "steam-coal-1" }
    ],
    "meta": { "total": 1 }
  }
}
```

**Get Product Detail**
```
GET /api/public/products/{id}
```
Response includes:
- Basic product info (name, description, MOQ, capacity)
- Media (images, YouTube videos)
- Specifications (photo-based specs)
- Variants (sizes, photos)
- Packaging options

### Content Endpoints

**Home Content**
```
GET /api/public/home-content
```
Returns:
- Slide banners (image URLs)
- Who we are video URL
- Visit factory photo URL
- Featured products (4 items)
- Packaging options (3 items)

**Footer Content**
```
GET /api/public/footer-content
```
Returns:
- Social media links (Facebook, LinkedIn, Instagram, TikTok)
- Contact info (address, phone, email, maps link)

**About Company Content**
```
GET /api/public/about-company-content
```
Returns:
- Factory photo
- Reels (video IDs and URLs)
- Team members (name, position, photo)
- Factory galleries (photo URLs)
- Product galleries (photo URLs)
- About us video URL

**Packaging Info Content**
```
GET /api/public/packaging-info-content
```
Returns:
- List of packaging options with descriptions and photos

### News Endpoints

**List News**
```
GET /api/public/news?page=1&limit=12
```
Response:
```json
{
  "data": {
    "news": {
      "data": [
        {
          "id": 1,
          "slug": "article-slug",
          "title": "Article Title",
          "published_at": "2024-01-15T10:00:00Z",
          "cover_image_url": "https://..."
        }
      ],
      "page": 1,
      "limit": 12,
      "total_pages": 5
    }
  }
}
```

**Get News Detail**
```
GET /api/public/news/{slug}
```
Returns full article with:
- Title (localized)
- Content (HTML from R2)
- Cover image URL
- Published date

**Get News Metadata**
```
GET /api/public/news/{slug}/metadata
```
Returns SEO metadata:
- Meta title
- Meta description
- Cover image URL
- Published date

### Contact Endpoint

**Get Contact Us**
```
GET /api/public/getContactUs
```
Returns:
- Email address
- Phone number
- Address line
- Social media links

## OpenAPI Documentation

### Generation

Generate OpenAPI spec with:
```bash
bun run typegen
```

This creates:
- OpenAPI JSON spec
- TypeScript client types
- Redocly documentation

### Redocly Configuration

Located in `redocly.yaml`:
```yaml
openapi: 3.1.0
info:
  title: Djavacoal Public API
  version: 1.0.0
  description: Public API for Djavacoal website
paths:
  # Generated from oRPC router
```

### Documentation URL

Served at `/api-docs` (if configured) with:
- Interactive endpoint explorer
- Request/response examples
- Schema documentation
- Try-it-out functionality

## Locale Handling

### Cookie-Based Locale

API reads locale from `locale` cookie:
- Default: `en` (English)
- Supported: `en`, `ar` (Arabic)
- Set by visitor language switcher
- Automatically injected into oRPC context

### Localized Responses

All text content is localized:
```typescript
const name = locale === LOCALES.AR
  ? product[PRODUCT_COLUMNS.AR_NAME]
  : product[PRODUCT_COLUMNS.EN_NAME];
```

### Fields Localized:
- Product names and descriptions
- News article titles and content
- Packaging option descriptions
- Team member positions (if applicable)

## Data Sources

### D1 Database

Accessed via Drizzle ORM:
- Products, variants, specifications
- News articles (metadata only)
- Packaging options
- Team members

### R2 Storage

Content and media:
- News article HTML content (EN/AR)
- Product images
- Specification photos
- Team member photos

### KV Store

Page settings:
- Social media links
- Contact information
- Home page banners
- Gallery photos
- Video URLs

## Constants

Located in `constants.ts`:

```typescript
export const PUBLIC_API_BASE_PATH = "/api/public";
export const PUBLIC_API_REDOCLY_PATH = "/api-docs";
```

Also uses constants from:
- `@/adapters/d1/constants.ts` - Database column names
- `@/adapters/r2/constants.ts` - R2 prefixes and bucket name
- `@/adapters/kv/constants.ts` - KV keys
- `@/configs/constants.ts` - Locale values, cookie names

## Type Safety

### Client Generation

Generated TypeScript client in `client/`:
```typescript
import { api } from "@/features/public-api/client";

// Type-safe API calls
const products = await api.listProductNames({ query: { limit: 5 } });
const product = await api.getProductDetail({ params: { id: 1 } });
```

### Schema Validation

All inputs/outputs validated with Zod:
- Compile-time type checking
- Runtime validation
- Auto-generated OpenAPI spec
- Error messages for invalid data

## Integration Points

### Dashboard Features

Data managed by:
- `dashboard-product` - Product catalog
- `dashboard-news` - News articles
- `dashboard-page-settings` - Contact info, social links
- `dashboard-team-member` - Team member profiles
- `dashboard-gallery` - Photo galleries

### Visitor Features

Consumed by:
- `home` - Homepage data
- `blog` - News articles
- `our-products` - Product catalog
- `about-company` - Company info
- `contact-us` - Contact details
- `production-info` - Packaging info

### Route Handler

`src/app/api/public/[...rest]/route.ts` delegates to this feature's router.

## Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad request (validation error)
- `404` - Resource not found
- `500` - Internal server error

### Error Responses

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Article not found"
  }
}
```

### oRPC Errors

Defined in `@/lib/orpc/server.ts`:
- `NOT_FOUND` - Resource doesn't exist
- `BAD_REQUEST` - Invalid input
- `INTERNAL_SERVER_ERROR` - Database/R2 error

## Performance Optimization

### Database Queries

- Select only needed columns
- Use indexes for filtering
- Limit result sets
- Order by relevant fields

### Caching

- Next.js automatic caching
- Cloudflare CDN caching
- Revalidation strategies
- Static asset optimization

### R2 Content Delivery

- CDN edge caching
- Optimized image sizes
- Lazy loading
- Presigned URLs

## Security Considerations

### Public Access

- No authentication required
- Rate limiting (if configured)
- CORS headers (if needed)
- Input validation via Zod

### Data Filtering

- Only published news articles visible
- Only non-hidden products visible
- Published dates must be in past
- Sensitive data excluded from responses

### SQL Injection Prevention

- Drizzle ORM parameterized queries
- Type-safe query builders
- No raw SQL strings

## Best Practices for AI Agents

### When Adding Endpoints

1. Define Zod schemas in `schemas.ts` first
2. Add route to `router.ts` with OpenAPI metadata
3. Use `publicBase` with REST-style routes
4. Implement locale-aware responses
5. Regenerate OpenAPI spec with `bun run typegen`
6. Document in this AGENTS.md file

### When Modifying Endpoints

1. Update Zod schemas for new fields
2. Test with both EN and AR locales
3. Verify backward compatibility
4. Update OpenAPI documentation
5. Regenerate client types

### When Debugging

1. Check locale cookie value in request
2. Verify oRPC middleware chain
3. Inspect D1 query results
4. Check R2 content keys
5. Validate against Zod schemas
6. Use OpenAPI docs for testing

## Environment Variables

Uses standard Cloudflare bindings:
- `DJAVACOAL_DB` - D1 database
- `DJAVACOAL_BUCKET` - R2 bucket
- `DJAVACOAL_KV` - KV namespace
- `NEXT_PUBLIC_ASSET_URL` - Asset base URL
- `S3_API` - R2 S3-compatible endpoint
- `R2_ACCESS_KEY_ID` - R2 access key
- `R2_SECRET_ACCESS_KEY` - R2 secret key

## Testing

### Manual Testing

Use Redocly documentation:
1. Navigate to `/api-docs`
2. Select endpoint
3. Click "Try it out"
4. Set locale cookie
5. Execute request
6. Verify response

### Automated Testing

```typescript
// Example test
import { router } from "@/features/public-api/router";

const result = await router.listProductNames({
  context: { env: mockEnv, locale: "en" },
  input: { query: { limit: 5 } },
});

expect(result.body.data.names).toHaveLength(5);
```

## Dependencies

### External Packages
- `@orpc/next` - oRPC Next.js integration
- `@orpc/server` - oRPC server utilities
- `zod` - Schema validation
- `drizzle-orm` - Database ORM
- `@aws-sdk/client-s3` - R2 client

### Internal Dependencies
- `@/lib/orpc/server` - Base oRPC configuration
- `@/lib/orpc/middlewares` - Middleware (cookies, CF context)
- `@/adapters/d1` - Database access
- `@/adapters/r2` - R2 storage
- `@/adapters/kv` - KV store
- `@/configs` - Constants and configuration

## Related Features

- **dashboard-product** - Manages products displayed in API
- **dashboard-news** - Manages news articles in API
- **dashboard-page-settings** - Manages content in API
- **blog** - Consumes news endpoints
- **home** - Consumes homepage endpoints
- **our-products** - Consumes product endpoints
- **about-company** - Consumes about endpoints

## Future Enhancements

- [ ] API versioning (v1, v2, etc.)
- [ ] Rate limiting per IP
- [ ] API key authentication for partners
- [ ] Webhook support for content updates
- [ ] GraphQL endpoint alternative
- [ ] Real-time updates via WebSockets
- [ ] Advanced filtering and sorting
- [ ] Full-text search
- [ ] CSV/JSON export endpoints
- [ ] API usage analytics

## Documentation References

- **oRPC Docs**: https://orpc.unnoq.com
- **OpenAPI Spec**: https://swagger.io/specification/
- **Redocly**: https://redocly.com/docs/
- **Zod**: https://zod.dev

## License

Part of the Djavacoal project. See main project LICENSE file.
