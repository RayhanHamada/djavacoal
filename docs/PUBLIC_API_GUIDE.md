# Public API Usage Guide

## Quick Start

The Public API provides access to products and news data without authentication.

## Base URL
```
http://localhost:3000/api/public  (development)
https://yoursite.com/api/public    (production)
```

## Endpoints

All endpoints use POST requests with JSON payloads (ORPC pattern).

### 1. List All Products

**Endpoint:** `POST /api/public/listProducts`

**Request:**
```json
{}
```

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name"
    }
  ]
}
```

---

### 2. Get Product by ID

**Endpoint:** `POST /api/public/getProductById`

**Request:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "metadataDescription": "SEO description",
  "packagingOptions": [
    {
      "id": 1,
      "name": "Standard Box",
      "price": 100,
      "description": "Standard packaging",
      "metadataDescription": "SEO for packaging"
    }
  ],
  "media": [
    {
      "type": "image",
      "key": "r2-key-123",
      "altText": "Product photo",
      "order": 1
    },
    {
      "type": "youtube",
      "videoId": "abc123",
      "thumbnailKey": "thumb-key-456",
      "order": 2
    }
  ]
}
```

**Media Types:**
- `image`: Has `key`, `altText`, `order`
- `youtube`: Has `videoId`, `thumbnailKey`, `order`

---

### 3. List News (Paginated)

**Endpoint:** `POST /api/public/listNews`

**Request:**
```json
{
  "page": 1,
  "pageSize": 10,
  "sortBy": "publishedAt",
  "sortOrder": "desc"
}
```

**Parameters:**
- `page` (optional): Page number, default 1
- `pageSize` (optional): Items per page, default 10
- `sortBy` (optional): Sort field, default "publishedAt"
- `sortOrder` (optional): "asc" or "desc", default "desc"

**Response:**
```json
{
  "news": [
    {
      "id": 1,
      "slug": "news-article-slug",
      "imageKey": "r2-image-key",
      "metadataTitle": "SEO title",
      "metadataDescription": "SEO description",
      "metadataTags": ["tag1", "tag2"],
      "enTitle": "English Title",
      "arTitle": "Arabic Title",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 25,
    "totalPages": 3
  }
}
```

**Note:** Only returns **published** news articles.

---

### 4. Get News by ID

**Endpoint:** `POST /api/public/getNewsById`

**Request:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "slug": "news-article-slug",
  "imageKey": "r2-image-key",
  "metadataTitle": "SEO title",
  "metadataDescription": "SEO description",
  "metadataTags": ["tag1", "tag2"],
  "enTitle": "English Title",
  "enContent": "<p>Full HTML content in English fetched from R2</p>",
  "arTitle": "Arabic Title",
  "arContent": "<p>Full HTML content in Arabic fetched from R2</p>",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** 
- Only returns **published** articles
- Content is fetched from Cloudflare R2 storage
- Returns both English and Arabic content

---

## Error Responses

### Not Found (404)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Validation Error (400)
```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "issues": [...]
  }
}
```

---

## Example Usage

### JavaScript/TypeScript

```typescript
// List all products
const products = await fetch("http://localhost:3000/api/public/listProducts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
}).then((r) => r.json());

// Get specific product
const product = await fetch("http://localhost:3000/api/public/getProductById", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 1 }),
}).then((r) => r.json());

// Get news with pagination
const newsResponse = await fetch("http://localhost:3000/api/public/listNews", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    page: 1,
    pageSize: 20,
    sortBy: "publishedAt",
    sortOrder: "desc",
  }),
}).then((r) => r.json());

// Get specific news article
const article = await fetch("http://localhost:3000/api/public/getNewsById", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 1 }),
}).then((r) => r.json());
```

### cURL

```bash
# List products
curl -X POST http://localhost:3000/api/public/listProducts \
  -H "Content-Type: application/json" \
  -d '{}'

# Get product by ID
curl -X POST http://localhost:3000/api/public/getProductById \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'

# List news
curl -X POST http://localhost:3000/api/public/listNews \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "pageSize": 10}'

# Get news by ID
curl -X POST http://localhost:3000/api/public/getNewsById \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'
```

---

## Testing

Run the included test script:

```bash
bun test-public-api.ts
```

This will test all 4 endpoints and display responses.

---

## Type-Safe Client (TypeScript)

For type-safe API calls in your frontend, you can generate an ORPC client:

```typescript
import { createORPCClient } from "@orpc/client";
import type { PublicAPIRouter } from "@/features/public-api";

const client = createORPCClient<PublicAPIRouter>({
  baseURL: "http://localhost:3000/api/public",
});

// Fully type-safe calls
const products = await client.listProducts();
const product = await client.getProductById({ id: 1 });
const news = await client.listNews({ page: 1, pageSize: 10 });
const article = await client.getNewsById({ id: 1 });
```

---

## CORS Configuration (if needed)

To enable cross-origin requests, add CORS headers in the route handler:

```typescript
// src/app/api/public/[...path]/route.ts
const response = new Response(body, {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  },
});
```
