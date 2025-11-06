# Home Feature

## Overview

This feature provides the homepage experience for visitors of the Djavacoal website. It displays hero sections, company highlights, featured products, recent news, production capabilities, and calls-to-action. Content is managed through various dashboard features and displayed dynamically.

## Architecture

### Directory Structure

```
home/
├── components/          # UI components for homepage
│   ├── atoms/          # Basic homepage UI elements (buttons, icons, headings)
│   ├── molecules/      # Composite components (cards, CTAs)
│   └── organisms/      # Complex sections (hero, product grid, features)
├── hooks/              # React hooks for homepage data (currently empty)
└── lib/                # Homepage-specific utilities and constants
    ├── constants.ts    # Centralized data (products, features, slides)
    ├── types.ts        # Shared TypeScript types
    └── utils.ts        # Utility functions (chunkArray, etc.)
```

### Code Organization Principles

**Atomic Design Pattern:**
- **Atoms**: Smallest reusable components (BannerButton, SectionHeading, StatCard, etc.)
- **Molecules**: Combinations of atoms (ProductCard, FeatureCard, CertificateCard, etc.)
- **Organisms**: Full page sections (BannerSection, DiscoverOurProductSection, etc.)

**Clean Code Practices:**
- Extract hardcoded data into constants for maintainability
- Use shared types for consistency across components
- Proper JSDoc comments for component documentation
- Consistent naming conventions (PascalCase for components)
- Export patterns through index.ts barrel files

## Features

### Core Functionality

1. **Hero Section**
   - Full-width hero with images/carousel
   - Company tagline and description
   - Primary call-to-action buttons
   - Managed via dashboard-static-media

2. **Company Highlights**
   - Brief company introduction
   - Key statistics (years in business, production capacity, etc.)
   - Trust indicators (certifications, partnerships)

3. **Featured Products**
   - Showcase of main products
   - Images and brief descriptions
   - Links to product pages
   - Managed via dashboard-product

4. **Recent News**
   - Latest news articles
   - Thumbnail images
   - Publication dates
   - Links to full articles
   - Managed via dashboard-news

5. **Production Capabilities**
   - Production process overview
   - Video or photo gallery
   - Quality assurance highlights
   - Managed via dashboard-static-media

6. **Call-to-Actions**
   - Contact buttons
   - Quote request forms
   - Social media links
   - Newsletter signup

## Technical Implementation

### Data Fetching

Homepage components fetch data from multiple sources:

```typescript
// Hero images
const { data: heroPhotos } = rpc.staticMedia.getPhotoList.useQuery({
  kvKey: "homepage-hero"
});

// Featured products
const { data: products } = rpc.dashboardProduct.listProducts.useQuery({
  page: 1,
  limit: 6,
  name_search: ""
});

// Recent news
const { data: news } = rpc.dashboardNews.listNews.useQuery({
  page: 1,
  limit: 3,
  status: "published"
});

// Production video
const { data: video } = rpc.staticMedia.getYouTubeUrl.useQuery({
  kvKey: "homepage-video"
});
```

### SEO Optimization

Homepage includes comprehensive SEO metadata:

```typescript
export const metadata: Metadata = {
  title: "Djavacoal - Premium Indonesian Coal Supplier",
  description: "Leading supplier of high-quality Indonesian coal...",
  keywords: ["coal", "Indonesian coal", "coal supplier", "energy"],
  openGraph: {
    title: "Djavacoal - Premium Indonesian Coal Supplier",
    description: "Leading supplier of high-quality Indonesian coal...",
    images: ["/og-image.jpg"],
  },
};
```

### Bilingual Support

All content is available in English and Arabic using next-intl:

```typescript
import { useTranslations } from "next-intl";

function HeroSection() {
  const t = useTranslations("home.hero");
  
  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

## Components

### HeroSection
- Full-width carousel or single hero image
- Overlaid text and CTA buttons
- Responsive image sizing
- Auto-play carousel (optional)

### CompanyHighlights
- Grid of statistics
- Icon + number + label format
- Animated counters (optional)
- Bilingual labels

### FeaturedProducts
- Product grid (2-3 columns)
- Product images from R2
- Product names and brief descriptions
- "View all products" link

### RecentNews
- News article cards
- Thumbnail images
- Titles and dates
- Read more links
- Bilingual content

### ProductionCapabilities
- Split layout (video/image + text)
- Embedded YouTube video or photo gallery
- Key points list
- Quality certifications

### CTASection
- Prominent buttons
- Contact form modal
- Multiple CTA options
- Social proof elements

## Integration Points

### Homepage Route
Located at `/app/(visitor)/page.tsx`:

```typescript
import { HomeView } from "@/features/home";

export default function HomePage() {
  return <HomeView />;
}
```

### Data Sources
- Hero images: `dashboard-static-media` (KV: "homepage-hero")
- Products: `dashboard-product` (filtered by visibility)
- News: `dashboard-news` (status: "published", latest 3)
- Video: `dashboard-static-media` (KV: "homepage-video")

### Navigation
- Header: Links to all main pages
- Footer: Company info, links, social media
- Uses `VisitorLayout` component

## Dependencies

### External Packages
- `@mantine/core` - UI components
- `@mantine/carousel` - Hero carousel
- `framer-motion` - Animations
- `react-photo-view` - Image lightbox
- `next-intl` - Internationalization

### Internal Dependencies
- `@/features/dashboard-product` - Product data
- `@/features/dashboard-news` - News data
- `@/features/dashboard-static-media` - Media content
- `@/components/layouts/visitor-layout` - Layout wrapper
- `@/hooks/use-app-locale` - Current locale

## Usage Examples

### Fetching Homepage Data

```typescript
export function HomeView() {
  const { data: hero } = rpc.staticMedia.getPhotoList.useQuery({
    kvKey: "homepage-hero"
  });
  
  const { data: products } = rpc.dashboardProduct.listProducts.useQuery({
    page: 1,
    limit: 6
  });
  
  const { data: news } = rpc.dashboardNews.listNews.useQuery({
    page: 1,
    limit: 3,
    status: "published"
  });
  
  return (
    <Stack>
      <HeroSection photos={hero?.photos} />
      <FeaturedProducts products={products?.products} />
      <RecentNews articles={news?.items} />
    </Stack>
  );
}
```

## Component Guidelines

### Atoms
All atom components follow these patterns:
- Accept `className` prop for custom styling
- Use `cn()` utility for conditional classes
- Include JSDoc comments
- Export as named exports (not default)
- Properly typed with TypeScript interfaces

### Molecules
Molecule components should:
- Compose atoms when possible
- Accept data as props (avoid hardcoding)
- Include hover/interaction states
- Use semantic HTML elements
- Follow accessibility best practices

### Organisms
Organism components should:
- Import data from constants file
- Use utility functions for data transformation
- Handle responsive layouts internally
- Include proper section semantics
- Document complex logic with comments

## Best Practices for AI Agents

### When Adding Features
1. Keep homepage loading fast (lazy load below fold)
2. Optimize images for web (WebP, proper sizes)
3. Use skeleton loaders for data fetching
4. Maintain bilingual content parity
5. Test mobile responsiveness
6. Add new data to `lib/constants.ts`
7. Create types in `lib/types.ts` first

### When Modifying
1. Update both EN and AR translations
2. Maintain SEO metadata
3. Test with empty states (no products, no news)
4. Optimize Core Web Vitals
5. Ensure accessibility
6. Update constants instead of hardcoding
7. Maintain atomic design hierarchy

### When Debugging
1. Check data fetching queries
2. Verify KV keys for static media
3. Test with different locale settings
4. Check responsive breakpoints
5. Review image loading performance
6. Verify imports from constants/types
7. Check barrel exports in index.ts files

## Performance Optimizations

1. **Image Optimization**
   - Use Next.js Image component
   - Lazy load below-fold images
   - Use appropriate image sizes

2. **Data Fetching**
   - Prefetch on server
   - Cache with TanStack Query
   - Limit initial data load

3. **Code Splitting**
   - Dynamic imports for heavy components
   - Lazy load carousel if not in viewport

4. **SEO**
   - Static generation where possible
   - Proper meta tags
   - Structured data markup

## Accessibility

- Proper heading hierarchy
- Alt text for all images
- Keyboard navigation
- ARIA labels where needed
- Sufficient color contrast
- Focus indicators

## Related Features

- **dashboard-static-media** - Hero images, videos
- **dashboard-product** - Featured products
- **dashboard-news** - Recent articles
- **our-products** - Full product catalog
- **about-company** - Company information
- **contact-us** - Contact forms

## Future Enhancements

- [ ] Testimonials/reviews section
- [ ] Partners/clients logos
- [ ] Video background hero
- [ ] Interactive statistics
- [ ] Live chat widget
- [ ] Newsletter signup
- [ ] Cookie consent banner
- [ ] A/B testing capability
- [ ] Personalized content
- [ ] Analytics tracking

## License

Part of the Djavacoal project. See main project LICENSE file.
