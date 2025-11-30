# Our Products Feature

## Overview

This feature provides the public-facing product catalog page where visitors can view all Djavacoal products. It displays products with images, descriptions, specifications, variants, and packaging options. Products are filtered to show only visible items (not hidden) and ordered according to admin-defined order.

The feature uses a **layout-level sidebar** architecture with React Context for state sharing, and includes a **static Djavacoal Brand page** that doesn't require API calls.

## Architecture

### Directory Structure

```
our-products/
├── components/
│   ├── atoms/              # Basic UI building blocks
│   │   ├── content-state.tsx      # LoadingState, EmptyState
│   │   ├── divider.tsx            # Section divider
│   │   ├── dropdown-item.tsx      # DropdownItemButton, DropdownItemLink
│   │   ├── dropdown-trigger.tsx   # DropdownTrigger for mobile
│   │   ├── section-heading.tsx    # Typography for section titles
│   │   ├── sidebar-nav-item.tsx   # SidebarNavButton, SidebarNavLink
│   │   ├── action-button.tsx
│   │   ├── card-brand.tsx
│   │   ├── filter-button.tsx
│   │   ├── image-modal.tsx
│   │   ├── packaging-card.tsx
│   │   ├── product-button.tsx
│   │   ├── shape-card.tsx
│   │   ├── video-*.tsx            # Video-related atoms
│   │   ├── youtube-modal.tsx
│   │   └── index.ts
│   ├── molecules/          # Composite components
│   │   ├── our-products-layout-sidebar.tsx  # Sidebar using context
│   │   ├── djavacoal-brand-page.tsx         # Static brand content
│   │   ├── media-gallery.tsx
│   │   ├── media-gallery-horizontal.tsx
│   │   ├── product-hero-section.tsx
│   │   ├── product-detail-table.tsx
│   │   ├── shapes-list.tsx
│   │   ├── packaging-list.tsx
│   │   └── index.ts
│   ├── organisms/          # Complex page sections
│   │   ├── our-products-layout-client.tsx   # Layout with context provider
│   │   ├── product-content.tsx              # Product detail display
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── use-products-context.tsx   # React Context for product state
│   └── index.ts
├── lib/
│   ├── types.ts            # MediaItem, ProductImage, etc.
│   ├── utils.ts            # getYouTubeThumbnailUrl, etc.
│   └── index.ts
└── AGENTS.md
```

### Route Structure

```
/our-products                    → Dynamic product listing (uses API)
/our-products/djavacoal-brand    → Static brand page (no API calls)
```

### Layout Architecture

The feature uses a **layout-level sidebar** pattern:

1. **Layout** (`src/app/(visitor)/our-products/layout.tsx`)
   - Server component rendering hero section
   - Wraps children with `OurProductsLayoutClient`

2. **Layout Client** (`components/organism/our-products-layout-client.tsx`)
   - Client component providing `ProductsProvider` context
   - Renders sidebar in both mobile and desktop positions
   - Children render in content area

3. **Context Provider** (`hooks/use-products-context.tsx`)
   - Manages product list fetching
   - Manages selected product state
   - Syncs selection with URL query params
   - Detects brand page route via `usePathname()`

4. **Pages**
   - `/our-products/page.tsx` - Renders `ProductContent`
   - `/our-products/djavacoal-brand/page.tsx` - Renders `DjavacoalBrandPage`

## Features

### Core Functionality

1. **Product Listing**
   - Display all visible products in sidebar navigation
   - Desktop: vertical navigation list
   - Mobile: dropdown menu with current selection
   - Product names with bilingual support (EN/AR)

2. **Product Detail**
   - Full product information display
   - Image/video gallery with lightbox
   - Detailed specifications table
   - Product variants with sizes
   - Packaging options
   - MOQ and production capacity
   - Inquiry/quote button

3. **Djavacoal Brand Page**
   - Static content (no API calls)
   - Brand information and values
   - Dedicated route: `/our-products/djavacoal-brand`

4. **Product Media**
   - Multiple images
   - YouTube video embeds
   - Custom video thumbnails
   - Media gallery with modal view

## Technical Implementation

### Data Flow

```
Layout (Server)
    ↓
OurProductsLayoutClient
    ↓
ProductsProvider (Context)
    ├── products: PublicProduct[]
    ├── selectedProduct: PublicProduct | null
    ├── setSelectedProduct: (id) => void
    ├── isLoading: boolean
    └── isBrandPage: boolean
    ↓
├── OurProductsLayoutSidebar (reads context)
└── Page Content
    ├── ProductContent (dynamic, reads context)
    └── DjavacoalBrandPage (static, no context needed)
```

### Data Fetching

```typescript
// In ProductsProvider context
const { data, isLoading } = rpc.publicProducts.getAll.useQuery({});

// Products are automatically filtered by visibility server-side
const products = data?.data ?? [];
```

### URL State Sync

```typescript
// Selected product syncs with URL query param
// /our-products?product=123

const searchParams = useSearchParams();
const selectedProductId = searchParams.get("product");

// On selection change
const setSelectedProduct = useCallback((productId: string | null) => {
  const params = new URLSearchParams(searchParams);
  if (productId) {
    params.set("product", productId);
  } else {
    params.delete("product");
  }
  router.push(`/our-products?${params.toString()}`);
}, [searchParams, router]);
```

### SEO Optimization

```typescript
// Product listing page
export const metadata: Metadata = {
  title: "Our Products - Djavacoal Coal Products",
  description: "Explore our range of high-quality Indonesian coal products",
  keywords: ["coal products", "Indonesian coal", "coal types"],
};
```

### Bilingual Support

```typescript
import { useTranslations } from "next-intl";
import { useAppLocale } from "@/hooks/use-app-locale";

function ProductCard({ product }) {
  const locale = useAppLocale();
  const t = useTranslations("our_products");
  
  return (
    <Card>
      <h3>{locale === "en" ? product.en_name : product.ar_name}</h3>
      <p>{locale === "en" ? product.en_description : product.ar_description}</p>
    </Card>
  );
}
```

## Components

### Atoms

#### `sidebar-nav-item.tsx`
Navigation buttons/links for desktop sidebar:
- **`SidebarNavButton`** - Button for product selection with active state
- **`SidebarNavLink`** - Next.js Link for static routes (Djavacoal Brand)

#### `dropdown-item.tsx`
Mobile dropdown menu items:
- **`DropdownItemButton`** - Button for mobile product selection
- **`DropdownItemLink`** - Link for static routes in mobile dropdown

#### `dropdown-trigger.tsx`
Mobile dropdown trigger showing current selection.

#### `content-state.tsx`
- **`LoadingState`** - Skeleton with spinner during data fetch
- **`EmptyState`** - Prompt to select a product

#### `divider.tsx`
Horizontal divider for section separation in product content.

#### `section-heading.tsx`
Typography component for section titles (specs, variants, etc.).

### Molecules

#### `our-products-layout-sidebar.tsx`
Sidebar consuming context with sub-components:
- **`MobileDropdown`** - Collapsed dropdown (visible on mobile)
- **`DropdownMenu`** - Shared menu content (products + brand link)
- **`DesktopNav`** - Vertical navigation (visible on desktop)

#### `djavacoal-brand-page.tsx`
Static brand content page (no API dependency).

#### `media-gallery.tsx`
- Handles both image and YouTube video media
- Responsive stacked layout
- Click to open modal for full view
- Custom thumbnail support for YouTube videos
- Djavacoal logo watermark on video thumbnails

#### `product-detail-table.tsx`
Detailed specifications display table.

#### `shapes-list.tsx`
Product shapes/forms display.

#### `packaging-list.tsx`
Packaging options display with cards.

### Organisms

#### `our-products-layout-client.tsx`
Layout wrapper providing context:
```tsx
export function OurProductsLayoutClient({ children }: Props) {
  return (
    <ProductsProvider>
      <div className="flex flex-col md:flex-row">
        {/* Mobile sidebar at top */}
        <div className="md:hidden">
          <OurProductsLayoutSidebar />
        </div>

        {/* Desktop sidebar on left */}
        <aside className="hidden md:block md:w-52 lg:w-64">
          <OurProductsLayoutSidebar />
        </aside>

        {/* Content area */}
        <main className="flex-1">{children}</main>
      </div>
    </ProductsProvider>
  );
}
```

#### `product-content.tsx`
Product detail display using atoms:
```tsx
export function ProductContent() {
  const { selectedProduct, isLoading } = useProductsContext();

  if (isLoading) return <LoadingState />;
  if (!selectedProduct) return <EmptyState />;

  return (
    <>
      <MediaGallery medias={selectedProduct.medias} />
      <Divider />
      <SectionHeading>{t("detailed_specs")}</SectionHeading>
      <ProductDetailTable product={selectedProduct} />
      {/* ... more sections */}
    </>
  );
}
```

### Modal Components

#### `image-modal.tsx`
- Full-screen image viewer
- Click outside or X button to close
- Responsive sizing (max 90vh height)

#### `youtube-modal.tsx`
- Full-screen YouTube video player
- Autoplay enabled
- Responsive iframe with 16:9 aspect ratio

## Hooks

### `use-products-context.tsx`

React Context for product state management:

```tsx
// Constants
export const DJAVACOAL_BRANDS_PATH = "/our-products/djavacoal-brand";

// Context shape
interface ProductsContextType {
  products: PublicProduct[];
  selectedProduct: PublicProduct | null;
  setSelectedProduct: (productId: string | null) => void;
  isLoading: boolean;
  isBrandPage: boolean;
}

// Provider
export function ProductsProvider({ children }: Props) {
  const pathname = usePathname();
  const isBrandPage = pathname === DJAVACOAL_BRANDS_PATH;
  
  // Fetch products via RPC
  const { data, isLoading } = rpc.publicProducts.getAll.useQuery({});
  
  // Selection from URL or default to first
  const selectedProductId = searchParams.get("product");
  const selectedProduct = useMemo(() => {
    if (isBrandPage) return null;
    if (selectedProductId) return products.find(p => p.id === selectedProductId);
    return products[0] ?? null;
  }, [selectedProductId, products, isBrandPage]);

  return (
    <ProductsContext.Provider value={{
      products,
      selectedProduct,
      setSelectedProduct,
      isLoading,
      isBrandPage,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

// Hook
export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProductsContext must be used within ProductsProvider");
  }
  return context;
}
```

## Integration Points

### Routes
- `/app/(visitor)/our-products/layout.tsx` - Layout with hero + client wrapper
- `/app/(visitor)/our-products/page.tsx` - Main products page
- `/app/(visitor)/our-products/djavacoal-brand/page.tsx` - Static brand page

### Data Sources
- Products: `publicProducts.getAll` RPC (public API)
- Images: R2 public URLs
- Videos: YouTube embeds

### Navigation
- Header: Link to products page
- Footer: Quick link to products
- Homepage: Featured products link
- Uses `VisitorLayout` component

## Dependencies

### External Packages
- `@mantine/core` - UI components (Menu, Button, etc.)
- `framer-motion` - Animations
- `react-photo-view` - Image lightbox
- `next-intl` - Internationalization
- `embla-carousel-react` - Media carousel

### Internal Dependencies
- `@/features/public-api` - Public product data via RPC
- `@/components/layouts/visitor-layout` - Layout wrapper
- `@/hooks/use-app-locale` - Current locale
- `@/lib/rpc` - RPC client for data fetching

## Usage Examples

### Layout Structure

```tsx
// src/app/(visitor)/our-products/layout.tsx
export default function OurProductsLayout({ children }: Props) {
  return (
    <>
      {/* Server-rendered hero */}
      <ProductHeroSection />
      
      {/* Client wrapper with context */}
      <OurProductsLayoutClient>{children}</OurProductsLayoutClient>
    </>
  );
}
```

### Products Page

```tsx
// src/app/(visitor)/our-products/page.tsx
export default function OurProductsPage() {
  return <ProductContent />;
}
```

### Static Brand Page

```tsx
// src/app/(visitor)/our-products/djavacoal-brand/page.tsx
export default function DjavacoalBrandRoute() {
  return <DjavacoalBrandPage />;
}
```

### Using Context in Components

```tsx
function MyComponent() {
  const {
    products,           // All visible products
    selectedProduct,    // Currently selected product or null
    setSelectedProduct, // Function to change selection (updates URL)
    isLoading,          // Data loading state
    isBrandPage,        // Whether on /our-products/djavacoal-brand
  } = useProductsContext();
  
  // Use context values...
}
```

## Product Display Order

Products are displayed in the order defined by `order_index` in the database. Admins can reorder products using drag-and-drop in the dashboard.

## Media Handling

The MediaGallery component handles both images and YouTube videos with modal popups:

### Product Media Structure
```typescript
interface MediaItem {
  id: number;
  type: "image" | "youtube";
  image_url?: string;           // For image type
  youtube_url?: string;          // For YouTube type (e.g., "https://www.youtube.com/watch?v=VIDEO_ID")
  custom_thumbnail_url?: string; // Optional custom thumbnail for YouTube videos
}
```

### MediaGallery Component
Located at `components/molecules/media-gallery.tsx`, this component:

1. **Image Media**:
   - Displays the image
   - Opens ImageModal on click showing full-size image
   - Hover effect with scale transform

2. **YouTube Video Media**:
   - Shows video thumbnail (custom if provided, or YouTube default)
   - Displays Djavacoal logo watermark on thumbnail
   - Shows play button overlay
   - Opens YouTubeModal on click with embedded video (autoplay enabled)

### Usage Example
```typescript
import { MediaGallery } from "@/features/our-products/components/molecules";

function ProductDetail({ product }) {
  return (
    <MediaGallery medias={product.medias} />
  );
}
```

### Modal Components

**ImageModal** (`components/atoms/image-modal.tsx`):
- Full-screen modal displaying product images
- Click outside or X button to close
- Responsive sizing with max-height constraint

**YouTubeModal** (`components/atoms/youtube-modal.tsx`):
- Full-screen modal with YouTube embed
- Converts YouTube watch URLs to embed format
- Autoplay enabled
- Responsive iframe with proper aspect ratio

### Getting YouTube Thumbnails
```typescript
// Default YouTube thumbnail
const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

// Or use custom thumbnail if provided
const customThumbnail = media.custom_thumbnail_url;
```

### Extracting YouTube Video ID
```typescript
function getVideoId(youtubeUrl: string): string {
  const url = new URL(youtubeUrl);
  
  // For youtube.com format
  if (url.hostname.includes("youtube.com")) {
    return url.searchParams.get("v") || "";
  }
  
  // For youtu.be format
  if (url.hostname.includes("youtu.be")) {
    return url.pathname.slice(1);
  }
  
  return "";
}
```

## Best Practices for AI Agents

### When Adding Features
1. Use the context provider for product state
2. Add new atoms for reusable UI elements
3. Keep molecules focused on a single responsibility
4. Use the existing constants (e.g., `DJAVACOAL_BRANDS_PATH`)
5. Respect `is_hidden` flag (don't show hidden products)
6. Maintain `order_index` for display order
7. Support both image and video media
8. Handle missing media gracefully
5. Maintain bilingual content

### When Modifying
1. Test with various product configurations
2. Handle products with no media
3. Test with different locale settings
4. Ensure responsive design
5. Optimize image loading
6. Ensure context is used within `ProductsProvider`

### When Debugging
1. Check context is available (wrap with `ProductsProvider`)
2. Verify URL params sync (`?product=123`)
3. Check `isBrandPage` detection for route-specific behavior
4. Verify media URLs are correct
5. Test with empty product list
6. Check bilingual content display
7. Test mobile dropdown vs desktop nav

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
