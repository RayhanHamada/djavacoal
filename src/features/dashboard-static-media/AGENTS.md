# Dashboard Static Media Feature

## Overview

This feature provides management for static media content used across various pages of the Djavacoal website. It handles photo collections (galleries), YouTube video URLs, and YouTube Shorts (reels) stored in Cloudflare KV with photos in R2. This is used for homepage hero sections, company galleries, process videos, and social media content.

## Architecture

### Directory Structure

```
dashboard-static-media/
├── components/          # UI components organized by atomic design
│   ├── atoms/          # Basic media UI elements
│   ├── molecules/      # Composite components (photo uploader, video input)
│   └── organisms/      # Complex sections (gallery manager, reels editor)
├── hooks/              # React hooks for media operations
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

1. **Photo Collections**
   - Upload photos to R2 via presigned URLs
   - Save ordered photo lists to KV
   - Retrieve photo lists with public URLs
   - Delete photos from R2
   - Multiple collections per page section

2. **YouTube Videos**
   - Save YouTube video URLs to KV
   - Extract and validate YouTube video IDs
   - Retrieve video URLs and IDs
   - Support for regular YouTube videos

3. **YouTube Shorts (Reels)**
   - Manage multiple YouTube Shorts
   - Store as array in KV
   - Extract video IDs from URLs
   - Order management

4. **Storage Strategy**
   - Photos: R2 storage with keys in KV
   - Videos: URLs in KV (no R2 storage)
   - Reels: Array of URLs in KV
   - KV keys organized by page section

## Technical Implementation

### Server-Side (RPC Functions)

All server functions are located in `server/functions.ts` and registered in the RPC router as `staticMedia`:

#### Available RPC Functions

```typescript
// Generate presigned URL for photo upload
rpc.staticMedia.generateUploadUrl.useMutation()

// Save photo list to KV (ordered array of R2 keys)
rpc.staticMedia.savePhotoList.useMutation()

// Get photo list from KV with public URLs
rpc.staticMedia.getPhotoList.useQuery({ kvKey: "homepage-hero" })

// Save YouTube video URL to KV
rpc.staticMedia.saveYouTubeUrl.useMutation()

// Get YouTube video URL from KV
rpc.staticMedia.getYouTubeUrl.useQuery({ kvKey: "production-video" })

// Save reels (array of YouTube Shorts)
rpc.staticMedia.saveReels.useMutation()

// Get reels from KV
rpc.staticMedia.getReels.useQuery()

// Delete photo from R2
rpc.staticMedia.deletePhoto.useMutation()
```

### Storage Architecture

#### Photos (R2 + KV)
```typescript
// R2: Actual image files
// Key format: {prefix}/{nanoid}
"homepage-hero/abc123"
"about-gallery/def456"

// KV: Ordered array of R2 keys
// KV Key: Logical section name
{
  key: "homepage-hero",
  value: JSON.stringify([
    "homepage-hero/abc123",
    "homepage-hero/xyz789"
  ])
}
```

#### Videos (KV only)
```typescript
// KV: YouTube video URL
{
  key: "production-video",
  value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

#### Reels (KV only)
```typescript
// KV: Array of YouTube Shorts
{
  key: "reels",
  value: JSON.stringify([
    {
      url: "https://youtube.com/shorts/abc123",
      videoId: "abc123"
    },
    {
      url: "https://youtube.com/shorts/def456",
      videoId: "def456"
    }
  ])
}
```

### Helper Functions

Located in `server/helpers.ts`:

```typescript
// Generate R2 key with prefix
generateR2Key(prefix: string): string

// Get R2 prefix based on logical name
getR2Prefix(prefix: string): string

// Build public URL for photo
buildPhotoUrl(key: string, assetUrl: string): string

// Extract YouTube video ID from various URL formats
extractYouTubeId(url: string): string | null
```

## Common KV Keys

Typical KV keys used in the application:

```typescript
// Homepage
"homepage-hero"           // Hero section photos
"homepage-gallery"        // Homepage gallery
"homepage-video"          // Production/intro video

// About Company
"about-company-gallery"   // Company photos
"about-company-video"     // Company intro video

// Production Info
"production-gallery"      // Production process photos
"production-video"        // Production process video

// Social Media
"reels"                   // YouTube Shorts array
```

## R2 Prefixes

Photos are organized in R2 by prefix:

```typescript
// From helpers.ts getR2Prefix()
"homepage-hero"          → "static-media/homepage-hero"
"about-company-gallery"  → "static-media/about-company-gallery"
"production-gallery"     → "static-media/production-gallery"
// etc.
```

## Constants

Located in `@/adapters/r2/constants.ts` and `@/adapters/kv/constants.ts`:

```typescript
// R2
DEFAULT_BUCKET_NAME = "djavacoal-bucket"
STATIC_MEDIA_PREFIX = "static-media"

// KV (if any specific constants)
// KV keys are defined per use case
```

## Integration Points

### RPC Router Registration
```typescript
import { router as staticMedia } from "@/features/dashboard-static-media/server/router";

const router = {
  staticMedia,
  // ...other routers
};
```

### Admin Route Pages
Various pages under `/dashboard/page-settings/`:
- `/dashboard/page-settings/homepage` - Homepage media
- `/dashboard/page-settings/about-company` - About company media
- `/dashboard/page-settings/production-info` - Production media
- `/dashboard/page-settings/reels` - Social media reels

### Public Page Integration
Public pages fetch media from KV:

```typescript
// In page component
const { data } = rpc.staticMedia.getPhotoList.useQuery({
  kvKey: "homepage-hero"
});

return (
  <Gallery photos={data?.photos || []} />
);
```

### R2 Storage
- Photos stored with logical prefixes
- Public URLs generated via Assets binding
- Direct browser upload via presigned URLs

### KV Storage
- Ordered arrays for photo collections
- Single values for video URLs
- JSON arrays for reels
- No expiration (permanent storage)

## Dependencies

### External Packages
- `@tanstack/react-query` - Data fetching and caching
- `nanoid` - Unique ID generation
- `zod` - Schema validation
- `@mantine/core`, `@mantine/hooks` - UI components

### Internal Dependencies
- `@/adapters/r2` - R2 storage operations
- `@/adapters/kv` - KV storage (via Cloudflare binding)
- `@/features/admin-auth` - Authentication (implicit)
- `@/lib/orpc/server` - RPC base configuration
- `@/lib/rpc` - Client-side RPC client

## Usage Examples

### Managing Photo Collection

```typescript
// 1. Generate presigned URL
const generateMutation = rpc.staticMedia.generateUploadUrl.useMutation();
const { uploadUrl, key } = await generateMutation.mutateAsync({
  mimeType: "image/jpeg",
  prefix: "homepage-hero"
});

// 2. Upload to R2
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});

// 3. Save photo list to KV (with all photos in collection)
const saveMutation = rpc.staticMedia.savePhotoList.useMutation();
await saveMutation.mutateAsync({
  kvKey: "homepage-hero",
  photoKeys: [
    "homepage-hero/abc123",
    "homepage-hero/xyz789",
    key // newly uploaded photo
  ]
});

// 4. Retrieve photos
const { data } = rpc.staticMedia.getPhotoList.useQuery({
  kvKey: "homepage-hero"
});
// data.photos: Array<{ key: string, url: string }>
```

### Managing YouTube Video

```typescript
// Save video URL
const saveMutation = rpc.staticMedia.saveYouTubeUrl.useMutation();
await saveMutation.mutateAsync({
  kvKey: "production-video",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
});

// Retrieve video
const { data } = rpc.staticMedia.getYouTubeUrl.useQuery({
  kvKey: "production-video"
});
// data.url: string
// data.videoId: string (extracted)
```

### Managing Reels

```typescript
// Save reels array
const saveMutation = rpc.staticMedia.saveReels.useMutation();
await saveMutation.mutateAsync({
  reels: [
    {
      url: "https://youtube.com/shorts/abc123",
      videoId: "abc123"
    },
    {
      url: "https://youtube.com/shorts/def456",
      videoId: "def456"
    }
  ]
});

// Retrieve reels
const { data } = rpc.staticMedia.getReels.useQuery();
// data.reels: Array<{ url: string, videoId: string }>
```

### Deleting Photo

```typescript
const deleteMutation = rpc.staticMedia.deletePhoto.useMutation();
await deleteMutation.mutateAsync({
  key: "homepage-hero/abc123"
});

// Remember to also update the KV photo list
await saveMutation.mutateAsync({
  kvKey: "homepage-hero",
  photoKeys: remainingPhotoKeys // without deleted key
});
```

## KV Key Naming Convention

Use descriptive, hyphenated names:

```typescript
// Good
"homepage-hero"
"about-company-gallery"
"production-process-video"

// Avoid
"hp_hero"
"aboutgallery"
"video1"
```

## YouTube URL Formats Supported

The `extractYouTubeId()` helper supports:

```typescript
// Standard watch URLs
"https://www.youtube.com/watch?v=VIDEO_ID"
"https://youtube.com/watch?v=VIDEO_ID"

// Short URLs
"https://youtu.be/VIDEO_ID"

// Embed URLs
"https://www.youtube.com/embed/VIDEO_ID"

// Shorts
"https://youtube.com/shorts/VIDEO_ID"
"https://www.youtube.com/shorts/VIDEO_ID"

// Mobile
"https://m.youtube.com/watch?v=VIDEO_ID"
```

## Error Handling

### Server-Side
- `BAD_REQUEST` - Invalid input, malformed URL
- `UNAUTHORIZED` - No valid session (if auth required)
- `INTERNAL_SERVER_ERROR` - R2 or KV operation failed

### Client-Side
- Network errors shown via Mantine notifications
- Form validation errors displayed inline
- R2 upload failures handled gracefully
- YouTube URL validation before saving

## Best Practices for AI Agents

### When Adding Features
1. Always use KV for metadata/ordering, R2 for actual files
2. Maintain consistent prefix naming conventions
3. Update both R2 and KV when modifying photo collections
4. Validate YouTube URLs before saving
5. Use descriptive KV keys

### When Modifying
1. Clean up orphaned R2 objects when removing photos
2. Keep KV arrays in sync with R2 contents
3. Handle missing KV values gracefully (default to empty arrays)
4. Test with various YouTube URL formats
5. Consider KV storage limits for large arrays

### When Debugging
1. Check KV key naming consistency
2. Verify R2 keys match KV stored keys
3. Test YouTube video ID extraction
4. Check public URL generation
5. Review KV values in Cloudflare dashboard

## Performance Considerations

1. **KV Caching**: KV is edge-cached globally
2. **Photo Arrays**: Keep photo arrays reasonable (< 100 items)
3. **Query Invalidation**: Invalidate queries after mutations
4. **Public URLs**: Generated on-demand, cached by browser
5. **Reels Array**: Limited to ~20 items for performance

## Related Features

- **dashboard-gallery** - Centralized photo management
- **home** - Displays homepage media
- **about-company** - Displays company gallery
- **production-info** - Displays production media
- **admin-auth** - Authentication for admin operations

## Future Enhancements

- [ ] Video upload to R2 (not just YouTube)
- [ ] Image optimization (WebP conversion)
- [ ] Lazy loading for large galleries
- [ ] Drag-and-drop reordering UI
- [ ] Bulk photo upload
- [ ] Photo captions/alt text
- [ ] Video thumbnail customization
- [ ] Media usage analytics
- [ ] Cloudflare Images integration
- [ ] Video transcoding

## License

Part of the Djavacoal project. See main project LICENSE file.
