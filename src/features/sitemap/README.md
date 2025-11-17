# Sitemap Feature

Database-driven XML sitemap generation for SEO optimization.

## Quick Start

### Access Sitemaps

- Sitemap Index: `https://yourdomain.com/sitemap-index.xml`
- Static Pages: `https://yourdomain.com/static/sitemap.xml`
- Blog Articles: `https://yourdomain.com/blog/sitemap.xml`

### Configuration

Blog sitemap settings in `lib/constants.ts`:

```typescript
export const BLOG_SITEMAP_CONFIG = {
  priority: 0.65,
  changefreq: "daily",
} as const;
```

Cache duration: 1 hour (3600 seconds)

## Files

- `lib/` - Types and constants
- `server/` - Database queries and XML generation
- Route handlers in `app/` directory

See [AGENTS.md](./AGENTS.md) for comprehensive documentation.
