# Home Feature

## Overview

This feature provides the homepage experience for visitors of the Djavacoal website. It displays hero sections, company highlights, featured products, recent news, production capabilities, and calls-to-action. Content is managed through various dashboard features and displayed dynamically.

## Architecture

### Directory Structure

```
home/
├── components/          # UI components for homepage
│   ├── atoms/          # Basic homepage UI elements
│   │   ├── banner-button.tsx
│   │   ├── carousel-dots.tsx    # Reusable carousel navigation dots
│   │   ├── country-tag.tsx
│   │   ├── feature-icon.tsx
│   │   ├── progress-bar.tsx
│   │   ├── section-heading.tsx
│   │   ├── stat-card.tsx
│   │   └── index.ts
│   ├── molecules/      # Composite components
│   │   ├── certificate-card.tsx
│   │   ├── cta-button.tsx
│   │   ├── feature-card.tsx
│   │   ├── news-card.tsx
│   │   ├── news-carousel.tsx    # Sliding carousel for news items
│   │   ├── product-card.tsx
│   │   └── index.ts
│   └── organisms/      # Complex sections
│       ├── news-list-section.tsx  # Responsive news section with auto-advance
│       └── ...
├── hooks/              # React hooks for homepage data
└── lib/                # Homepage-specific utilities and constants
    ├── constants.ts    # Centralized data (static content, config)
    ├── types.ts        # Shared TypeScript interfaces
    └── utils.ts        # Utility functions (data transformation, formatting)
```

**Best Practice**: Following the pattern established in `about-company` and `blog` features, this feature centralizes all static data, magic numbers, and reusable type definitions in the `lib/` folder to eliminate code duplication and improve maintainability.
```

### Code Organization Principles

**Atomic Design Pattern:**
- **Atoms**: Smallest reusable components (BannerButton, CarouselDots, SectionHeading, StatCard, etc.)
- **Molecules**: Combinations of atoms (ProductCard, FeatureCard, NewsCard, NewsCarousel, etc.)
- **Organisms**: Full page sections (BannerSection, DiscoverOurProductSection, NewsListSection, etc.)

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
   - Latest news articles in responsive carousel
   - Auto-advancing slides with navigation dots
   - Slides one item at a time
   - Responsive layout:
     - Mobile: 1 visible card
     - Tablet (md-xl): 2 visible cards
     - Desktop (xl+): 3 visible cards
   - Thumbnail images with title overlay
   - Publication dates and read more links
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

### Atoms

#### CarouselDots
Reusable navigation dots for carousel components:

```typescript
interface CarouselDotsProps {
    totalSlides: number;
    currentSlide: number;
    onSlideChange: (index: number) => void;
    className?: string;
}
```

- Displays clickable dots indicating current position
- Active dot highlighted with brand color (#EFA12D)
- Hover states for inactive dots
- Accessible with aria-labels

### Molecules

#### NewsCard
Individual news article preview card:
- Image with title overlay and gradient
- Date display below image
- Title repeated below for clarity
- Arrow CTA link to full article
- Centered within container (max-w-500px)

#### NewsCarousel
Sliding carousel for news items:

```typescript
interface NewsCarouselProps {
    items: NewsItem[];
    currentSlide: number;
    onSlideChange: (index: number) => void;
    itemsPerSlide: number;  // Number of visible items
    className?: string;
}
```

- Slides one item at a time (not whole groups)
- Shows multiple items simultaneously based on `itemsPerSlide`
- Smooth CSS transform transitions
- Uses CarouselDots for navigation
- Calculates total navigable positions: `items.length - itemsPerSlide + 1`

### Organisms

#### NewsListSection
Responsive news section with auto-advancing carousel:

```typescript
const VISIBLE_ITEMS = {
    mobile: 1,    // <md
    tablet: 2,    // md to xl
    desktop: 3,   // xl+
} as const;
```

- Three NewsCarousel instances with visibility classes
- Auto-advance via useEffect interval (NEWS_CAROUSEL_INTERVAL)
- Shared currentSlide state across breakpoints
- Each breakpoint normalizes slide position with modulo

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
- See NewsListSection for implementation details

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
- Include JSDoc comments with prop descriptions
- Export as named exports (not default)
- Properly typed with TypeScript interfaces

Example - CarouselDots:
```typescript
/**
 * CarouselDots - Navigation dots for carousel slides
 * Displays clickable dots indicating current position
 */
export function CarouselDots({
    totalSlides,
    currentSlide,
    onSlideChange,
    className,
}: CarouselDotsProps) {
    return (
        <div className={cn("flex items-center justify-center gap-3", className)}>
            {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onSlideChange(index)}
                    className={cn(
                        "h-3 w-3 rounded-full transition-all duration-300",
                        index === currentSlide
                            ? "bg-[#EFA12D]"
                            : "bg-[#4F4F4F] hover:bg-[#6F6F6F]"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    );
}
```

### Molecules
Molecule components should:
- Compose atoms when possible
- Accept data as props (avoid hardcoding)
- Include hover/interaction states
- Use semantic HTML elements
- Follow accessibility best practices

Example - NewsCarousel:
```typescript
/**
 * NewsCarousel - Sliding carousel for news items
 * Slides one item at a time while showing multiple items in view
 */
export function NewsCarousel({
    items,
    currentSlide,
    onSlideChange,
    itemsPerSlide,
    className,
}: NewsCarouselProps) {
    const totalSlides = Math.max(1, items.length - itemsPerSlide + 1);
    const activeSlide = currentSlide % totalSlides;
    const itemWidth = 100 / itemsPerSlide;

    return (
        <div className={className}>
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${activeSlide * itemWidth}%)` }}
                >
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="shrink-0 px-3"
                            style={{ width: `${itemWidth}%` }}
                        >
                            <NewsCard {...item} />
                        </div>
                    ))}
                </div>
            </div>
            <CarouselDots
                totalSlides={totalSlides}
                currentSlide={activeSlide}
                onSlideChange={onSlideChange}
                className="mt-8"
            />
        </div>
    );
}
```

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
