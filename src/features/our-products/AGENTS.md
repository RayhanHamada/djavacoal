# Our Products Feature

## Overview

This feature provides the public-facing product catalog page where visitors can view all Djavacoal products. It displays products with images, descriptions, specifications, variants, and packaging options. Products are filtered to show only visible items (not hidden) and ordered according to admin-defined order.

## Architecture

### Directory Structure

```
our-products/
├── components/          # UI components for products page
│   ├── atoms/          # Basic product elements
│   ├── molecules/      # Composite components (product cards, filters)
│   └── organisms/      # Complex sections (product grid, product detail)
└── hooks/              # React hooks for product data
```

## Features

### Core Functionality

1. **Product Listing**
   - Display all visible products
   - Grid or list view
   - Product images (first media)
   - Product names and brief descriptions
   - Bilingual content (English/Arabic)

2. **Product Detail**
   - Full product information
   - Image/video gallery with lightbox
   - Detailed specifications
   - Product variants with sizes
   - Packaging options
   - MOQ and production capacity
   - Inquiry/quote button

3. **Product Filtering** (Future)
   - Filter by category
   - Search by name
   - Sort options

4. **Product Media**
   - Multiple images
   - YouTube video embeds
   - Custom video thumbnails
   - Media carousel

## Technical Implementation

### Data Fetching

```typescript
// List all visible products
const { data } = rpc.dashboardProduct.listProducts.useQuery({
  page: 1,
  limit: 100, // Get all visible products
  name_search: ""
});

// Filter visible products client-side (or add is_hidden filter to RPC)
const visibleProducts = data?.products.filter(p => !p.is_hidden);

// Get single product detail
const { data: product } = rpc.dashboardProduct.getProductById.useQuery({
  id: productId
});
```

### SEO Optimization

```typescript
// Product listing page
export const metadata: Metadata = {
  title: "Our Products - Djavacoal Coal Products",
  description: "Explore our range of high-quality Indonesian coal products",
  keywords: ["coal products", "Indonesian coal", "coal types"],
};

// Individual product page
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProductById(params.id);
  
  return {
    title: `${product.en_name} - Djavacoal`,
    description: product.en_description,
    openGraph: {
      images: [product.firstMediaUrl],
    },
  };
}
```

### Bilingual Support

```typescript
import { useTranslations } from "next-intl";
import { useAppLocale } from "@/hooks/use-app-locale";

function ProductCard({ product }) {
  const locale = useAppLocale();
  const t = useTranslations("products");
  
  return (
    <Card>
      <h3>{locale === "en" ? product.en_name : product.ar_name}</h3>
      <p>{locale === "en" ? product.en_description : product.ar_description}</p>
      <Button>{t("viewDetails")}</Button>
    </Card>
  );
}
```

## Components

### ProductGrid
- Responsive grid (2-4 columns)
- Product cards
- Loading skeletons
- Empty state
- Pagination (if needed)

### ProductCard
- Product image
- Product name
- Brief description
- "View Details" button
- Hover effects

### ProductDetail
- Full-width hero with media gallery
- Product information section
- Specifications display
- Variants with sizes
- Packaging options display
- MOQ and production capacity
- Contact/inquiry CTA

### MediaGallery
- Main image/video viewer
- Thumbnail navigation
- Lightbox for images
- YouTube player for videos
- Custom video thumbnails

### SpecificationsDisplay
- Grid of specification images
- Lightbox viewer
- Captions (optional)

### VariantsDisplay
- Variant cards with images
- Size chips/badges
- Variant names

### PackagingOptionsDisplay
- Packaging option cards
- Images and descriptions
- Bilingual content

## Integration Points

### Product Routes
- `/app/(visitor)/our-products/page.tsx` - Product listing
- `/app/(visitor)/our-products/[id]/page.tsx` - Product detail

### Data Sources
- Products: `dashboard-product` RPC
- Images: R2 public URLs
- Videos: YouTube embeds

### Navigation
- Header: Link to products page
- Footer: Quick link to products
- Homepage: Featured products link here
- Uses `VisitorLayout` component

## Dependencies

### External Packages
- `@mantine/core` - UI components
- `framer-motion` - Animations
- `react-photo-view` - Image lightbox
- `next-intl` - Internationalization
- `embla-carousel-react` - Media carousel

### Internal Dependencies
- `@/features/dashboard-product` - Product data
- `@/components/layouts/visitor-layout` - Layout wrapper
- `@/hooks/use-app-locale` - Current locale

## Usage Examples

### Product Listing Page

```typescript
export default function OurProductsPage() {
  const { data, isLoading } = rpc.dashboardProduct.listProducts.useQuery({
    page: 1,
    limit: 100
  });
  
  const visibleProducts = data?.products.filter(p => !p.is_hidden);
  
  return (
    <Container>
      <h1>Our Products</h1>
      <ProductGrid products={visibleProducts} loading={isLoading} />
    </Container>
  );
}
```

### Product Detail Page

```typescript
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading } = rpc.dashboardProduct.getProductById.useQuery({
    id: Number(params.id)
  });
  
  if (isLoading) return <Skeleton />;
  if (!product) return <NotFound />;
  
  return (
    <Container>
      <ProductDetail product={product} />
    </Container>
  );
}
```

## Product Display Order

Products are displayed in the order defined by `order_index` in the database. Admins can reorder products using drag-and-drop in the dashboard.

## Media Handling

### Images
```typescript
// First media from product
const firstImageUrl = product.medias.find(m => m.media_type === "image")?.image_key;
const imageUrl = `${env.NEXT_PUBLIC_ASSET_URL}/_r2/${firstImageUrl}`;
```

### YouTube Videos
```typescript
const videoMedia = product.medias.find(m => m.media_type === "youtube");
if (videoMedia) {
  const videoId = videoMedia.youtube_video_id;
  const thumbnailUrl = videoMedia.video_custom_thumbnail_key
    ? `${env.NEXT_PUBLIC_ASSET_URL}/_r2/${videoMedia.video_custom_thumbnail_key}`
    : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
```

## Best Practices for AI Agents

### When Adding Features
1. Respect `is_hidden` flag (don't show hidden products)
2. Maintain `order_index` for display order
3. Support both image and video media
4. Handle missing media gracefully
5. Maintain bilingual content

### When Modifying
1. Test with various product configurations
2. Handle products with no media
3. Test with different locale settings
4. Ensure responsive design
5. Optimize image loading

### When Debugging
1. Check `is_hidden` filter
2. Verify media URLs are correct
3. Test with empty product list
4. Check bilingual content display
5. Review media carousel functionality

## Accessibility

- Alt text for all product images
- Keyboard-navigable carousel
- Proper heading hierarchy
- Focus indicators
- Screen reader friendly
- Video controls accessible

## Performance Optimizations

1. **Image Loading**
   - Lazy load product images
   - Use Next.js Image component
   - Responsive image sizes

2. **Data Fetching**
   - Server-side rendering
   - Cache product list
   - Prefetch on hover

3. **Media Gallery**
   - Lazy load gallery images
   - Optimize video embeds
   - Use intersection observer

## SEO for Products

- Unique page per product
- Product schema markup
- Open Graph images
- Twitter Cards
- Canonical URLs
- Sitemap inclusion

## Related Features

- **dashboard-product** - Product management
- **home** - Featured products on homepage
- **contact-us** - Product inquiry form
- **production-info** - Production capabilities

## Future Enhancements

- [ ] Product categories/collections
- [ ] Product search and filtering
- [ ] Product comparison feature
- [ ] Related products suggestions
- [ ] Product reviews/ratings
- [ ] Quote request form per product
- [ ] Downloadable product sheets
- [ ] Product availability status
- [ ] Share product on social media
- [ ] Recently viewed products

## License

Part of the Djavacoal project. See main project LICENSE file.
