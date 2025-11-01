# Dashboard Product Feature

## Overview

This feature provides comprehensive product catalog management for the Djavacoal admin dashboard. It supports complex product structures with bilingual content (English/Arabic), multiple media types (images/YouTube videos), specifications, variants with sizes, packaging options, and visibility controls. Products can be reordered via drag-and-drop.

**Note:** The dashboard UI uses hardcoded English text for labels, buttons, and messages. The `next-intl` internationalization library has been removed from this feature to simplify the admin interface, though the product data itself remains bilingual (EN/AR) for public display.

## Architecture

### Directory Structure

```
dashboard-product/
├── components/          # UI components organized by atomic design
│   ├── atoms/          # Basic product UI elements
│   ├── molecules/      # Composite components (media uploader, variant form)
│   └── organisms/      # Complex sections (product list, product editor)
├── hooks/              # React hooks for product operations
├── server/             # Server-side logic (RPC functions)
│   ├── functions.ts    # oRPC callable functions
│   ├── schemas.ts      # Zod schemas for input/output validation
│   ├── router.ts       # RPC router exports
│   └── index.ts        # Server module exports
├── utils/              # Client-side utility functions
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Product Management**
   - Create products with bilingual content
   - Update existing products
   - Delete products (with R2 cleanup)
   - List products with search and pagination
   - Get single product with all related data
   - Toggle product visibility (hidden/visible)
   - Reorder products via drag-and-drop

2. **Product Structure**
   - Basic Info: Name, description (EN/AR), MOQ, production capacity
   - Media: Multiple images and/or YouTube videos with custom thumbnails
   - Specifications: Photo-based specs with ordering
   - Variants: Named variants with sizes and photos
   - Packaging Options: Reference to packaging options
   - Visibility: Show/hide from public view
   - Order: Custom display order

3. **Media Management**
   - Images uploaded to R2 (product-media prefix)
   - YouTube video embeds (store video ID)
   - Custom thumbnails for videos
   - Media ordering within product
   - Multiple media per product

4. **Packaging Options**
   - Separate management of packaging options
   - Associate multiple packaging options with products
   - Packaging option details (name, description, photo) in EN/AR
   - Shared across products

5. **Authentication**
   - All operations require admin authentication
   - User tracking (created_by, updated_by)

## Technical Implementation

### Server-Side (RPC Functions)

All server functions are located in `server/functions.ts` and registered in the RPC router as `dashboardProduct`:

#### Product Functions

```typescript
// List products with search and pagination
rpc.dashboardProduct.listProducts.useQuery({
  page: 1,
  limit: 20,
  name_search: "coal"
})

// Get product by ID with all related data
rpc.dashboardProduct.getProductById.useQuery({ id: 123 })

// Create new product
rpc.dashboardProduct.createProduct.useMutation()

// Update existing product
rpc.dashboardProduct.updateProduct.useMutation()

// Delete product
rpc.dashboardProduct.deleteProduct.useMutation()

// Toggle visibility
rpc.dashboardProduct.toggleProductVisibility.useMutation()

// Reorder products
rpc.dashboardProduct.reorderProducts.useMutation()

// Generate presigned URL for product assets
rpc.dashboardProduct.generateProductUploadUrl.useMutation()
```

#### Packaging Option Functions

```typescript
// List packaging options
rpc.dashboardProduct.listPackagingOptions.useQuery({
  page: 1,
  limit: 20,
  search: "bag"
})

// Get packaging option by ID
rpc.dashboardProduct.getPackagingOptionById.useQuery({ id: 123 })

// Create new packaging option
rpc.dashboardProduct.createPackagingOption.useMutation()

// Update packaging option
rpc.dashboardProduct.updatePackagingOption.useMutation()

// Delete packaging option
rpc.dashboardProduct.deletePackagingOption.useMutation()

// Generate presigned URL for packaging option image
rpc.dashboardProduct.generateImageUploadUrl.useMutation()
```

### Database Schema

#### `products` table
```typescript
{
  id: number;                     // Primary key (auto-increment)
  en_name: string;                // English product name
  ar_name: string;                // Arabic product name
  en_description: string;         // English description
  ar_description: string;         // Arabic description
  moq: string;                    // Minimum Order Quantity
  production_capacity: string;    // Production capacity
  is_hidden: boolean;             // Visibility flag (default: false)
  order_index: number;            // Display order (0-based)
  created_at: Date;               // Auto-generated
  created_by: string;             // Admin user ID
  updated_at: Date;               // Auto-updated
  updated_by: string;             // Admin user ID
}
```

#### `product_medias` table
```typescript
{
  id: number;                       // Primary key (auto-increment)
  product_id: number;               // Foreign key to products
  media_type: "image" | "youtube";  // Media type
  image_key: string | null;         // R2 key for image
  video_id: string | null;          // YouTube video ID
  video_custom_thumbnail_key: string | null; // R2 key for custom thumbnail
  order_index: number;              // Display order
}
```

#### `product_specifications` table
```typescript
{
  id: number;                // Primary key (auto-increment)
  product_id: number;        // Foreign key to products
  spec_photo_key: string;    // R2 key for specification photo
  order_index: number;       // Display order
}
```

#### `product_variants` table
```typescript
{
  id: number;                 // Primary key (auto-increment)
  product_id: number;         // Foreign key to products
  en_variant_name: string;    // English variant name
  ar_variant_name: string;    // Arabic variant name
  variant_photo_key: string;  // R2 key for variant photo
  variant_sizes: string[];    // Array of sizes (JSON)
  order_index: number;        // Display order
}
```

#### `packaging_options` table
```typescript
{
  id: number;                  // Primary key (auto-increment)
  en_name: string;             // English name
  ar_name: string;             // Arabic name
  en_description: string;      // English description
  ar_description: string;      // Arabic description
  photo_key: string;           // R2 key for photo
  created_at: Date;            // Auto-generated
  created_by: string;          // Admin user ID
  updated_at: Date;            // Auto-updated
  updated_by: string;          // Admin user ID
}
```

#### `product_packaging_options` table (join table)
```typescript
{
  product_id: number;           // Foreign key to products
  packaging_option_id: number;  // Foreign key to packaging_options
}
```

## Constants

Located in `@/adapters/d1/constants.ts` and `@/adapters/r2/constants.ts`:

```typescript
// R2 prefixes
PRODUCT_MEDIA_PREFIX = "product-media"
PRODUCT_SPECIFICATIONS_PREFIX = "product-specifications"
PRODUCT_VARIANTS_PREFIX = "product-variants"
PACKAGING_OPTIONS_PREFIX = "packaging-options" // in server/functions.ts

// Media types
PRODUCT_MEDIA_TYPE = {
  IMAGE: "image",
  YOUTUBE: "youtube"
}

// Database columns
PRODUCT_COLUMNS = {
  EN_NAME: "en_name",
  AR_NAME: "ar_name",
  EN_DESCRIPTION: "en_description",
  AR_DESCRIPTION: "ar_description",
  MOQ: "moq",
  PRODUCTION_CAPACITY: "production_capacity",
  IS_HIDDEN: "is_hidden",
  ORDER_INDEX: "order_index"
}
```

## Integration Points

### RPC Router Registration
```typescript
import { router as dashboardProduct } from "@/features/dashboard-product/server";

const router = {
  dashboardProduct,
  // ...other routers
};
```

### Route Pages
Admin routes:
- `/dashboard/products` - Product list
- `/dashboard/products/new` - Create product
- `/dashboard/products/[id]` - Edit product
- `/dashboard/products/packaging-options` - Manage packaging options

### R2 Storage
- Product media: `product-media/{nanoid}`
- Product specifications: `product-specifications/{nanoid}`
- Product variants: `product-variants/{nanoid}`
- Packaging options: `packaging-options/{nanoid}`
- Video thumbnails: `product-media/thumbnails/{nanoid}`

### Public Product Display
Products are displayed on `/our-products` page filtered by `is_hidden = false` and ordered by `order_index`.

## Dependencies

### External Packages
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` - Database operations
- `nanoid` - Unique ID generation
- `zod` - Schema validation
- `@mantine/core`, `@mantine/hooks`, `@mantine/form` - UI components
- `@mantine/notifications` - Toast notifications for user feedback
- `@dnd-kit/core`, `@dnd-kit/sortable` - Drag and drop

### Internal Dependencies
- `@/adapters/d1` - Database access and constants
- `@/adapters/r2` - R2 storage operations
- `@/features/admin-auth` - Authentication
- `@/lib/orpc/server` - RPC base configuration
- `@/lib/rpc` - Client-side RPC client

### UI Text Localization
This feature does **not** use `next-intl` for the dashboard UI. All interface text (labels, buttons, notifications, error messages) is hardcoded in English for simplicity. Product data (names, descriptions) remains bilingual (EN/AR) for public-facing pages.

## Usage Examples

### Creating a Product

```typescript
const createMutation = rpc.dashboardProduct.createProduct.useMutation();

await createMutation.mutateAsync({
  en_name: "Premium Coal",
  ar_name: "فحم متميز",
  en_description: "High quality coal...",
  ar_description: "فحم عالي الجودة...",
  moq: "1000 tons",
  production_capacity: "10,000 tons/month",
  is_hidden: false,
  medias: [
    {
      media_type: "image",
      image_key: "product-media/xyz123",
      order_index: 0
    },
    {
      media_type: "youtube",
      youtube_video_id: "dQw4w9WgXcQ",
      video_custom_thumbnail_key: "product-media/thumbnails/abc456",
      order_index: 1
    }
  ],
  specifications: [
    {
      spec_photo_key: "product-specifications/spec1",
      order_index: 0
    }
  ],
  variants: [
    {
      en_variant_name: "Standard",
      ar_variant_name: "قياسي",
      variant_photo_key: "product-variants/var1",
      variant_sizes: ["5kg", "10kg", "25kg"],
      order_index: 0
    }
  ],
  packaging_option_ids: [1, 2, 3]
});
```

### Listing Products

```typescript
const { data, isLoading } = rpc.dashboardProduct.listProducts.useQuery({
  page: 1,
  limit: 20,
  name_search: "coal"
});

// data.products: Product[]
// data.total: number
// data.page: number
// data.limit: number
// data.totalPages: number
```

### Reordering Products

```typescript
const reorderMutation = rpc.dashboardProduct.reorderProducts.useMutation();

await reorderMutation.mutateAsync({
  product_orders: [
    { id: 1, order_index: 0 },
    { id: 3, order_index: 1 },
    { id: 2, order_index: 2 }
  ]
});
```

### Toggle Visibility

```typescript
const toggleMutation = rpc.dashboardProduct.toggleProductVisibility.useMutation();

await toggleMutation.mutateAsync({ id: 123 });
// Returns: { success: true, is_hidden: true }
```

### Generating Upload URL

```typescript
const uploadUrlMutation = rpc.dashboardProduct.generateProductUploadUrl.useMutation();

const { upload_url, key } = await uploadUrlMutation.mutateAsync({
  upload_type: "media" | "specification" | "variant" | "video-thumbnail",
  mime_type: "image/jpeg"
});

// Upload to R2
await fetch(upload_url, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});
```

## Complex Product Example

A typical product structure:

```
Product: Premium Indonesian Coal
├── Media (3 items)
│   ├── Image 1 (main product photo)
│   ├── Image 2 (detail photo)
│   └── YouTube video (production process)
├── Specifications (4 items)
│   ├── Spec 1: Chemical composition chart
│   ├── Spec 2: Calorific value table
│   ├── Spec 3: Size distribution graph
│   └── Spec 4: Certificate image
├── Variants (2 items)
│   ├── Standard Grade
│   │   └── Sizes: 5kg, 10kg, 25kg, 50kg
│   └── Premium Grade
│       └── Sizes: 10kg, 25kg
└── Packaging Options (3 references)
    ├── Woven PP Bags
    ├── Jumbo Bags
    └── Bulk Container
```

## Error Handling

### Server-Side
- `NOT_FOUND` - Product or packaging option doesn't exist
- `BAD_REQUEST` - Invalid input, negative values
- `UNAUTHORIZED` - No valid session
- `INTERNAL_SERVER_ERROR` - Database or R2 operation failed

### Client-Side
- Network errors shown via Mantine notifications (hardcoded English messages)
- Form validation errors displayed inline
- R2 upload failures handled gracefully
- Drag-and-drop state management

### Notification Examples
```typescript
// Success notification
notifications.show({
    title: "Packaging option created successfully",
    message: "",
    color: "green",
});

// Error notification
notifications.show({
    title: "Failed to upload image",
    message: "",
    color: "red",
});
```

## Best Practices for AI Agents

### When Adding Features
1. Always delete old R2 objects when replacing media/specs/variants
2. Maintain order_index consistency (0-based, sequential)
3. Use transactions for complex multi-table operations
4. Track user actions (created_by, updated_by)
5. Validate YouTube video IDs before saving
6. **Do not use `next-intl`** - Use hardcoded English strings for dashboard UI

### When Modifying
1. Update all related tables together (products, medias, specs, variants)
2. Handle cascade deletes properly
3. Maintain bilingual content consistency for product data (EN/AR)
4. Test drag-and-drop reordering thoroughly
5. Ensure R2 cleanup doesn't leave orphaned files
6. Keep UI text in English - translation is only for public-facing product data

### When Debugging
1. Check foreign key constraints
2. Verify R2 keys match database records
3. Test with various media combinations (images only, videos only, mixed)
4. Check order_index after reordering
5. Verify packaging option associations

### UI Text Guidelines
- **Labels and Forms**: Use clear, concise English labels (e.g., "English Name", "Arabic Description")
- **Notifications**: Hardcode success/error messages (e.g., "Product created successfully", "Failed to upload image")
- **Buttons**: Use simple action words (e.g., "Create", "Update", "Delete", "Cancel")
- **Placeholders**: Provide helpful hints (e.g., "Search packaging options...", "Enter product name in English")
- **No Translation Keys**: Do not use `t()` function or translation key strings like `t("form.submit")`

## YouTube Integration

### Video ID Extraction
```typescript
// Extract video ID from various YouTube URL formats
const videoId = extractYouTubeVideoId(url);
// Supports:
// - https://www.youtube.com/watch?v=VIDEO_ID
// - https://youtu.be/VIDEO_ID
// - https://www.youtube.com/embed/VIDEO_ID
```

### Custom Thumbnails
Products can use custom thumbnails for YouTube videos instead of YouTube's default thumbnails.

## Related Features

- **dashboard-gallery** - Photos may be used for products
- **dashboard-static-media** - Similar media management patterns
- **our-products** - Public product display
- **admin-auth** - Authentication and user tracking

## Future Enhancements

- [ ] Product categories/collections
- [ ] Price management (with currency)
- [ ] Inventory tracking
- [ ] Product comparison feature
- [ ] Related products suggestions
- [ ] Product reviews/ratings
- [ ] Downloadable documents (PDFs, datasheets)
- [ ] Product search/filter on public page
- [ ] Stock status (in stock, out of stock)
- [ ] Product analytics (views, interest)

## License

Part of the Djavacoal project. See main project LICENSE file.
