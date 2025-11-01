# Dashboard Gallery Feature

## Overview

This feature provides a centralized photo gallery management system for the Djavacoal admin dashboard. Admins can upload, organize, rename, search, and delete photos stored in Cloudflare R2. Photos are accessible throughout the application for use in various content types.

## Architecture

### Directory Structure

```
dashboard-gallery/
├── components/          # UI components organized by atomic design
│   ├── atoms/          # Basic gallery UI elements
│   ├── molecules/      # Composite gallery components
│   └── organisms/      # Complex gallery sections (photo grid, upload modal)
├── hooks/              # React hooks for gallery operations
├── server/             # Server-side logic (RPC functions)
│   ├── functions.ts    # oRPC callable functions
│   ├── schemas.ts      # Zod schemas for input/output validation
│   ├── helpers.ts      # Server-side utility functions
│   ├── router.ts       # RPC router exports
│   └── index.ts        # Server module exports
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Photo Upload**
   - Direct browser-to-R2 upload via presigned URLs
   - Unique name validation before upload
   - Metadata storage in D1 database
   - Support for JPEG, PNG, WebP, GIF formats
   - File size tracking

2. **Photo Management**
   - List all photos with pagination
   - Search photos by name
   - Sort by name or updated date (asc/desc)
   - Rename photos with uniqueness validation
   - Delete single or multiple photos (bulk delete)
   - Photo preview functionality

3. **Storage**
   - Photos stored in Cloudflare R2
   - Metadata in D1 database
   - Public URL generation for each photo
   - Automatic R2 cleanup on deletion

4. **Authentication**
   - All operations require admin authentication
   - Session validation via Better Auth

## Technical Implementation

### Server-Side (RPC Functions)

All server functions are located in `server/functions.ts` and registered in the RPC router as `gallery`:

#### Available RPC Functions

```typescript
// List photos with pagination, search, and sorting
rpc.gallery.listPhotos.useQuery({
  search: "sunset",
  page: 1,
  limit: 20,
  sortBy: "name" | "updated_at",
  sortOrder: "asc" | "desc"
})

// Create presigned URL for browser upload
rpc.gallery.createPresignedUrl.useMutation()

// Confirm upload and save metadata to database
rpc.gallery.confirmUpload.useMutation()

// Rename a photo
rpc.gallery.renamePhoto.useMutation()

// Delete single photo
rpc.gallery.deletePhoto.useMutation()

// Bulk delete photos
rpc.gallery.bulkDeletePhotos.useMutation()

// Check if photo name is available
rpc.gallery.checkNameAvailability.useQuery({
  name: "beach-sunset",
  excludeId: "optional-photo-id"
})
```

### Upload Workflow

The upload process uses presigned URLs for security and performance:

```typescript
// 1. Client requests presigned URL
const { uploadUrl, key, photoId } = await createPresignedUrl({
  name: "beach-sunset",
  mimeType: "image/jpeg"
});

// 2. Client uploads directly to R2
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});

// 3. Client confirms upload, saving metadata
await confirmUpload({
  photoId,
  name: "beach-sunset",
  key,
  size: file.size,
  mimeType: file.type
});
```

### Database Schema

Photos are stored in the `gallery_photos` table:

```typescript
{
  id: string;              // Primary key (nanoid)
  name: string;            // Unique, user-friendly name
  key: string;             // R2 storage key
  size: number;            // File size in bytes
  mime_type: string;       // MIME type (image/jpeg, etc.)
  created_at: Date;        // Auto-generated
  updated_at: Date;        // Auto-updated
}
```

### Helper Functions

Located in `server/helpers.ts`:

```typescript
// Generate public URL for photo
buildPhotoUrl(key: string, assetUrl: string): string

// Build R2 path with bucket prefix
buildR2Path(key: string, bucketName: string): string

// Find photo by ID
findPhotoById(db, id: string): Promise<Photo | null>

// Check if photo name is available (excluding optional ID)
isPhotoNameAvailable(db, name: string, excludeId?: string): Promise<boolean>
```

## Constants

R2 storage configuration:

```typescript
// From @/adapters/r2/constants.ts
GALLERY_PHOTOS_PREFIX = "gallery-photos"
DEFAULT_BUCKET_NAME = "djavacoal-bucket" // or from env
```

Database column names:

```typescript
// From @/adapters/d1/constants.ts
GALLERY_PHOTO_COLUMNS = {
  NAME: "name",
  KEY: "key",
  SIZE: "size",
  MIME_TYPE: "mime_type",
}
```

## Integration Points

### RPC Router Registration
The feature router must be registered in `/src/adapters/rpc/index.ts`:

```typescript
import { router as gallery } from "@/features/dashboard-gallery/server/router";

const router = {
  gallery,
  // ...other routers
};
```

### Route Page
Used in the admin route `/dashboard/gallery`:

```typescript
import { GalleryView } from "@/features/dashboard-gallery";

export default function GalleryPage() {
  return <GalleryView />;
}
```

### R2 Storage
- Bucket: Defined by `DEFAULT_BUCKET_NAME`
- Prefix: `gallery-photos/`
- Naming: `gallery-photos/{nanoid}`
- Public access via Cloudflare Assets binding

### Public URL Generation
Photos are accessible via public URLs:

```typescript
const photoUrl = `${env.NEXT_PUBLIC_ASSET_URL}/_r2/${key}`;
```

## Dependencies

### External Packages
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` - Database operations
- `nanoid` - Unique ID generation
- `zod` - Schema validation
- `@mantine/core`, `@mantine/hooks` - UI components
- `react-photo-view` - Photo preview/lightbox

### Internal Dependencies
- `@/adapters/d1` - Database access and constants
- `@/adapters/r2` - R2 storage operations
- `@/features/admin-auth` - Authentication
- `@/lib/orpc/server` - RPC base configuration
- `@/lib/rpc` - Client-side RPC client

## Usage Examples

### Listing Photos

```typescript
const { data, isLoading } = rpc.gallery.listPhotos.useQuery({
  search: "",
  page: 1,
  limit: 20,
  sortBy: "updated_at",
  sortOrder: "desc"
});

// data.photos: PhotoWithUrl[]
// data.total: number
// data.page: number
// data.pageSize: number
```

### Uploading a Photo

```typescript
// 1. Request presigned URL
const presignedMutation = rpc.gallery.createPresignedUrl.useMutation();
const { uploadUrl, key, photoId } = await presignedMutation.mutateAsync({
  name: "beach-sunset",
  mimeType: file.type
});

// 2. Upload to R2
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});

// 3. Confirm upload
const confirmMutation = rpc.gallery.confirmUpload.useMutation();
await confirmMutation.mutateAsync({
  photoId,
  name: "beach-sunset",
  key,
  size: file.size,
  mimeType: file.type
});
```

### Renaming a Photo

```typescript
const renameMutation = rpc.gallery.renamePhoto.useMutation({
  onSuccess: () => {
    // Refresh photo list
    queryClient.invalidateQueries(['gallery', 'listPhotos']);
  }
});

renameMutation.mutate({
  id: "photo-id",
  newName: "sunset-beach"
});
```

### Deleting Photos

```typescript
// Single delete
const deleteMutation = rpc.gallery.deletePhoto.useMutation();
deleteMutation.mutate({ id: "photo-id" });

// Bulk delete
const bulkDeleteMutation = rpc.gallery.bulkDeletePhotos.useMutation();
bulkDeleteMutation.mutate({ 
  ids: ["photo-id-1", "photo-id-2", "photo-id-3"] 
});
```

## Error Handling

### Server-Side
- `NOT_FOUND` - Photo doesn't exist
- `BAD_REQUEST` - Name already taken, invalid input
- `UNAUTHORIZED` - No valid session
- `INTERNAL_SERVER_ERROR` - Database or R2 operation failed

### Client-Side
- Network errors shown via Mantine notifications
- Form validation errors displayed inline
- R2 upload failures handled gracefully
- Concurrent name conflict detection

## Best Practices for AI Agents

### When Adding Features
1. Always validate photo names for uniqueness before upload
2. Use presigned URLs for direct browser-to-R2 uploads
3. Clean up R2 objects when deleting photos
4. Maintain metadata in D1 for searchability
5. Export new components through barrel files (`index.ts`)

### When Modifying
1. Check both database and R2 cleanup in delete operations
2. Update schemas in both `server/schemas.ts` and form validation
3. Test with various image formats and sizes
4. Ensure public URL generation matches R2 configuration
5. Verify authentication in all server operations

### When Debugging
1. Check RPC registration in `/src/adapters/rpc/index.ts`
2. Verify Cloudflare R2 bindings in `wrangler.jsonc`
3. Ensure presigned URLs are generated correctly
4. Check R2 bucket public access configuration
5. Review D1 database for orphaned records

## Security Considerations

1. **Presigned URLs**: Time-limited (15 minutes default)
2. **Name Validation**: Prevents duplicate names, XSS attacks
3. **MIME Type Validation**: Server-side verification recommended
4. **File Size Limits**: Configurable via R2 settings
5. **Admin-Only Access**: All operations require authentication

## Performance Optimizations

1. **Direct Upload**: Browser-to-R2 avoids server bandwidth
2. **Pagination**: Large galleries load efficiently
3. **Database Indexing**: Name and updated_at columns
4. **Query Caching**: TanStack Query caches photo lists
5. **Parallel Deletion**: Bulk delete uses Promise.all

## Common Use Cases

### Photo Selector Component
```typescript
// Other features can use gallery photos
import { useGalleryPhotos } from "@/features/dashboard-gallery/hooks";

function PhotoSelector() {
  const { data } = useGalleryPhotos();
  
  return (
    <Select
      data={data?.photos.map(p => ({
        value: p.key,
        label: p.name
      }))}
    />
  );
}
```

### Embed Photo in Content
```typescript
// News articles, products, etc. can reference gallery photos
const photoUrl = `${env.NEXT_PUBLIC_ASSET_URL}/_r2/${photoKey}`;

<img src={photoUrl} alt="Gallery photo" />
```

## Related Features

- **dashboard-news** - Uses gallery photos for article images
- **dashboard-product** - Can reference gallery photos
- **dashboard-static-media** - Similar media management patterns
- **admin-auth** - Provides authentication for all operations

## Future Enhancements

Potential improvements for this feature:
- [ ] Image editing (crop, resize, filters)
- [ ] Multiple photo upload
- [ ] Drag-and-drop upload
- [ ] Photo albums/folders
- [ ] Tags and categories
- [ ] Image optimization (WebP conversion)
- [ ] Usage tracking (where photo is used)
- [ ] Metadata editing (alt text, caption)
- [ ] Duplicate detection
- [ ] Trash/archive instead of permanent delete

## License

Part of the Djavacoal project. See main project LICENSE file.
