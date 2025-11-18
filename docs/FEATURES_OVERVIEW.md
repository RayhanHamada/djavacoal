# Djavacoal Features Overview

This document provides a comprehensive overview of all features in the Djavacoal application, organized by category.

## Table of Contents

- [Dashboard Features (Admin)](#dashboard-features-admin)
- [Visitor Features (Public)](#visitor-features-public)
- [API Features](#api-features)
- [Feature Matrix](#feature-matrix)

## Dashboard Features (Admin)

These features are accessible only to authenticated admin users under the `/dashboard` route group.

### dashboard

**Purpose:** Main admin dashboard interface and navigation hub

**Key Capabilities:**
- Welcome screen with user information
- Quick stats overview (products, news, photos, etc.)
- Navigation to all admin features
- Recent activity feed
- Quick action buttons

**Routes:**
- `/dashboard` - Main dashboard page

**Documentation:** `src/features/dashboard/AGENTS.md`

---

### dashboard-auth

**Purpose:** Authentication and admin user management

**Key Capabilities:**
- First-time onboarding for initial admin
- Magic link (passwordless) authentication
- Email and password authentication
- Admin user invitation via magic link
- Password management (set, change, reset)
- Session management with Better Auth
- Admin user listing and removal

**Routes:**
- `/auth/onboarding` - First-time setup
- `/auth/sign-in` - Login page
- `/auth/reset-password` - Password reset
- `/dashboard/admins` - Admin management

**Database Tables:**
- `users` - Admin user accounts
- `sessions` - Authentication sessions
- `accounts` - Authentication providers
- `verifications` - Email verification tokens

**Documentation:** `src/features/dashboard-auth/AGENTS.md`

---

### dashboard-news

**Purpose:** News/blog article management with rich text editing

**Key Capabilities:**
- Create, update, delete news articles
- Bilingual content support (English/Arabic)
- Rich text editor for article content (HTML stored in R2)
- Cover image upload
- Tagging system (auto-creates tags)
- Status management (draft/published/unpublished)
- Scheduled publishing support
- Article search and filtering
- Slug management and validation

**Routes:**
- `/dashboard/news` - Article listing
- `/dashboard/news/create` - Create new article
- `/dashboard/news/[id]/edit` - Edit article

**Database Tables:**
- `news` - Article metadata
- `tags` - Article tags

**Storage:**
- R2: HTML content (separate EN/AR files), cover images
- D1: Metadata, slugs, status, publish dates

**Documentation:** `src/features/dashboard-news/AGENTS.md`

---

### dashboard-product

**Purpose:** Product catalog management with media and variants

**Key Capabilities:**
- Create, update, delete products
- Bilingual product information (English/Arabic)
- Multiple media types (images, YouTube videos)
- Custom video thumbnails
- Photo-based specifications
- Product variants with sizes
- Packaging options association
- Drag-and-drop product reordering
- Hide/show products
- MOQ and production capacity tracking

**Routes:**
- `/dashboard/products` - Product listing
- `/dashboard/products/create` - Create product
- `/dashboard/products/[id]/edit` - Edit product

**Database Tables:**
- `products` - Product information
- `product_medias` - Images and videos
- `product_specifications` - Specification photos
- `product_variants` - Product variants and sizes
- `packaging_options` - Packaging types
- `product_packaging_options` - Many-to-many relationship

**Storage:**
- R2: Product images, specification photos, variant photos, video thumbnails

**Documentation:** `src/features/dashboard-product/AGENTS.md`

---

### dashboard-gallery

**Purpose:** Centralized photo library for reusable media

**Key Capabilities:**
- Upload photos to R2 via presigned URLs
- Rename photos with uniqueness validation
- Search photos by name
- Sort by name or date
- Delete single or multiple photos (bulk)
- Photo preview with lightbox
- Pagination support
- File size tracking

**Routes:**
- `/dashboard/gallery` - Photo library

**Database Tables:**
- `gallery_photos` - Photo metadata

**Storage:**
- R2: Actual photo files under `gallery-photos/` prefix

**Documentation:** `src/features/dashboard-gallery/AGENTS.md`

---

### dashboard-static-media

**Purpose:** Page-specific media management (KV-based)

**Key Capabilities:**
- Upload and organize photo collections for specific pages
- Save YouTube video URLs
- Manage YouTube Shorts (reels)
- Generate presigned URLs for browser uploads
- Delete photos from R2
- Retrieve ordered photo lists with public URLs

**Routes:**
- `/dashboard/page-settings/homepage` - Homepage media
- `/dashboard/page-settings/about-company` - About page media
- `/dashboard/page-settings/production-info` - Production media
- `/dashboard/page-settings/reels` - Social media reels

**Storage:**
- R2: Photos under `static-media/` prefix
- KV: Photo key arrays, video URLs, reels array

**Common KV Keys:**
- `homepage-hero`, `homepage-gallery`, `homepage-video`
- `about-company-gallery`, `about-company-video`
- `production-gallery`, `production-video`
- `reels`

**Documentation:** `src/features/dashboard-static-media/AGENTS.md`

---

### dashboard-team-member

**Purpose:** Team member profile management

**Key Capabilities:**
- Create, update, delete team members
- Upload member photos to R2
- Bilingual support (name, position)
- Drag-and-drop reordering
- Photo preview and management

**Routes:**
- `/dashboard/page-settings/team-members` - Team member management

**Database Tables:**
- `team_members` - Member information and photos

**Storage:**
- R2: Member photos under `team-members/` prefix

**Documentation:** `src/features/dashboard-team-member/AGENTS.md`

---

### dashboard-page-settings

**Purpose:** SEO metadata management for static pages

**Key Capabilities:**
- Create, update, delete page metadata
- Manage meta titles, descriptions, keywords
- Configure sitemap settings (priority, change frequency)
- Path validation and uniqueness checking
- Pagination and search

**Routes:**
- `/dashboard/page-settings` - SEO metadata management

**Database Tables:**
- `page_metadatas` - Page-level SEO configuration

**Used By:**
- Sitemap generation
- Page-level SEO tags
- Search engine optimization

**Documentation:** `src/features/dashboard-page-settings/AGENTS.md`

---

## Visitor Features (Public)

These features are accessible to all visitors under public routes.

### home

**Purpose:** Website homepage with company highlights

**Key Capabilities:**
- Hero section with carousel
- Company introduction and statistics
- Featured products showcase
- Recent news articles
- Production capabilities overview
- Call-to-action sections
- Bilingual content support

**Routes:**
- `/` - Homepage

**Data Sources:**
- `dashboard-static-media` - Hero images, videos
- `dashboard-product` - Featured products
- `dashboard-news` - Recent articles
- i18n messages - Static content

**Documentation:** `src/features/home/AGENTS.md`

---

### blog

**Purpose:** Public blog/news article display

**Key Capabilities:**
- Paginated article listing
- Article detail view with rich HTML content
- Cover image display
- Published date formatting
- Related articles
- Bilingual content (English/Arabic)
- SEO metadata generation
- Loading skeletons
- Empty state handling

**Routes:**
- `/blog` - Article listing
- `/blog/[slug]` - Article detail

**Data Sources:**
- Public API (`/api/public/news`)

**Documentation:** `src/features/blog/AGENTS.md`

---

### our-products

**Purpose:** Public product catalog display

**Key Capabilities:**
- Product grid with images
- Product detail pages
- Media gallery (images and YouTube videos)
- Specifications display
- Variants and sizes
- Packaging options
- MOQ and production capacity
- Bilingual product information
- Contact/inquiry CTAs

**Routes:**
- `/our-products` - Product listing
- `/our-products/[id]` - Product detail

**Data Sources:**
- `dashboard-product` RPC functions

**Documentation:** `src/features/our-products/AGENTS.md`

---

### about-company

**Purpose:** Company information and team showcase

**Key Capabilities:**
- Company story and mission
- Team member profiles
- Factory gallery with lightbox
- Product galleries
- Company video
- YouTube reels/shorts
- Certificates display
- Interactive navigation sidebar
- Bilingual content

**Routes:**
- `/about-company` - About page

**Data Sources:**
- `dashboard-team-member` - Team profiles
- `dashboard-static-media` - Galleries, videos, reels
- i18n messages - Company information

**Documentation:** `src/features/about-company/AGENTS.md`

---

### contact-us

**Purpose:** Contact information and inquiry form

**Key Capabilities:**
- Contact information display (email, phone, address)
- Contact form (currently UI only, backend TBD)
- Interactive map embed
- Social media links
- Bilingual content

**Routes:**
- `/contact-us` - Contact page

**Data Sources:**
- KV Store - Contact information, social links
- i18n messages - Form labels, static content

**Documentation:** `src/features/contact-us/AGENTS.md`

---

### production-info

**Purpose:** Production process and capabilities showcase

**Key Capabilities:**
- Production process timeline
- Capacity statistics
- Quality control information
- Facilities gallery
- Production video
- Technology showcase
- Bilingual content

**Routes:**
- `/production-info` - Production information page

**Data Sources:**
- `dashboard-static-media` - Gallery, video
- i18n messages - Process descriptions, statistics

**Documentation:** `src/features/production-info/AGENTS.md`

---

## API Features

### public-api

**Purpose:** RESTful API for external data access

**Key Capabilities:**
- OpenAPI/Swagger documentation
- Type-safe client generation
- Locale-aware responses (cookie-based)
- No authentication required
- Product endpoints (list, detail)
- News endpoints (list, detail, metadata)
- Content endpoints (homepage, footer, about, packaging)
- Contact information endpoint

**Routes:**
- `/api/public/products-names` - Product list
- `/api/public/products/{id}` - Product detail
- `/api/public/news` - News list with pagination
- `/api/public/news/{slug}` - News detail
- `/api/public/news/{slug}/metadata` - News SEO metadata
- `/api/public/home-content` - Homepage data
- `/api/public/footer-content` - Footer data
- `/api/public/about-company-content` - About page data
- `/api/public/packaging-info-content` - Packaging data
- `/api/public/getContactUs` - Contact information

**Documentation:**
- OpenAPI spec available at `/api-docs` (if configured)
- `src/features/public-api/AGENTS.md`

---

### sitemap

**Purpose:** XML sitemap generation for SEO

**Key Capabilities:**
- Sitemap index generation
- Static pages sitemap (from `page_metadatas` table)
- Blog sitemap (published articles)
- Database-driven content
- Proper XML formatting
- Caching for performance
- Sorted URLs

**Routes:**
- `/sitemap-index.xml` - Main sitemap index
- `/static/sitemap.xml` - Static pages
- `/blog/sitemap.xml` - Blog articles

**Documentation:** `src/features/sitemap/AGENTS.md`

---

## Feature Matrix

| Feature | Type | Auth Required | Database | R2 Storage | KV Storage | i18n |
|---------|------|---------------|----------|------------|------------|------|
| dashboard | Admin | ✅ | - | - | - | - |
| dashboard-auth | Admin | Mixed | ✅ | - | ✅ | - |
| dashboard-news | Admin | ✅ | ✅ | ✅ | - | - |
| dashboard-product | Admin | ✅ | ✅ | ✅ | - | - |
| dashboard-gallery | Admin | ✅ | ✅ | ✅ | - | - |
| dashboard-static-media | Admin | ✅ | - | ✅ | ✅ | - |
| dashboard-team-member | Admin | ✅ | ✅ | ✅ | - | - |
| dashboard-page-settings | Admin | ✅ | ✅ | - | - | - |
| home | Visitor | ❌ | - | - | - | ✅ |
| blog | Visitor | ❌ | - | - | - | ✅ |
| our-products | Visitor | ❌ | - | - | - | ✅ |
| about-company | Visitor | ❌ | - | - | - | ✅ |
| contact-us | Visitor | ❌ | - | - | - | ✅ |
| production-info | Visitor | ❌ | - | - | - | ✅ |
| public-api | API | ❌ | ✅ | ✅ | ✅ | ✅ |
| sitemap | API | ❌ | ✅ | - | - | - |

## Feature Dependencies

### Dashboard Features Flow
```
dashboard-auth (authentication)
    ↓
dashboard (navigation hub)
    ↓
├─ dashboard-news → dashboard-gallery (images)
├─ dashboard-product → dashboard-gallery (images)
├─ dashboard-static-media (page-specific media)
├─ dashboard-team-member (team profiles)
├─ dashboard-page-settings (SEO metadata)
└─ dashboard-gallery (centralized photos)
```

### Visitor Features Flow
```
home (landing page)
    ↓
├─ blog (consumes dashboard-news via public-api)
├─ our-products (consumes dashboard-product)
├─ about-company (consumes dashboard-team-member, dashboard-static-media)
├─ contact-us (consumes KV data)
└─ production-info (consumes dashboard-static-media)
```

### Data Flow
```
Dashboard Features (Admin Management)
    ↓
Database (D1) + Storage (R2/KV)
    ↓
Public API (REST Endpoints)
    ↓
Visitor Features (Public Display)
```

## Technology Stack by Feature

### Authentication
- Better Auth (NOT NextAuth)
- Custom D1 adapter
- Magic link and email/password methods

### Database
- Cloudflare D1 (SQLite)
- Drizzle ORM
- Snake_case column names

### Storage
- R2 (S3-compatible) for media files
- KV for settings and simple key-value data
- Presigned URLs for direct browser uploads

### RPC
- oRPC for type-safe client-server communication
- TanStack Query for data fetching
- Zod for schema validation

### UI
- Mantine v8 components
- Tailwind CSS v4
- Framer Motion for animations
- React Photo View for lightboxes

### i18n
- next-intl for internationalization
- Cookie-based locale storage
- English and Arabic support

## Common Patterns

### File Upload Pattern
1. Request presigned URL from server
2. Upload directly to R2 from browser
3. Confirm upload, save metadata to D1

### RPC Pattern
1. Define Zod schemas in `server/schemas.ts`
2. Implement functions in `server/functions.ts`
3. Export router in `server/router.ts`
4. Register in `src/adapters/rpc/index.ts`
5. Use with `rpc.feature.function.useQuery()` or `.useMutation()`

### Component Organization
- Atomic Design: atoms → molecules → organisms
- Barrel exports via `index.ts` files
- TypeScript interfaces in `lib/types.ts`
- Constants in `lib/constants.ts`
- Utilities in `lib/utils.ts`

### Bilingual Content
- Store separate EN/AR fields in database
- Use `useAppLocale()` hook to get current locale
- Display appropriate field based on locale
- i18n messages for UI text

## Adding a New Feature

1. Create directory under `src/features/`
2. Set up standard folder structure (components, hooks, lib, server)
3. Create `AGENTS.md` following the guide
4. Implement server functions with RPC (if needed)
5. Register RPC router in `src/adapters/rpc/index.ts`
6. Create UI components following atomic design
7. Add routes in appropriate route group
8. Update this overview document
9. Add to feature matrix

## Documentation

Every feature must have:
- `AGENTS.md` - Comprehensive feature documentation
- JSDoc comments on public functions/components
- Code comments for complex logic
- Type definitions for all data structures
- Usage examples in AGENTS.md

## Quick Reference

**Find feature details:** Check `src/features/<feature-name>/AGENTS.md`

**RPC functions:** Look in `src/features/<feature-name>/server/functions.ts`

**Database schemas:** See `src/adapters/d1/schema.ts`

**Constants:** Check feature's `lib/constants.ts` or `server/constants.ts`

**Components:** Browse `src/features/<feature-name>/components/`

**Routes:** Check `src/app/(admin)` or `src/app/(visitor)` directories

---

**Last Updated:** 2024-11-17

**Maintainer:** Keep this document updated when adding/modifying features