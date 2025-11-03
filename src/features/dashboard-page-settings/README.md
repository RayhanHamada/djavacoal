# Dashboard Page Settings Feature

SEO metadata management feature for static pages in the Djavacoal application.

## Overview

This feature provides a complete CRUD (Create, Read, Update, Delete) interface for managing SEO metadata of static pages. It includes:

- **List View**: Paginated table showing all page metadata entries with search functionality
- **Create**: Modal form to add new page metadata
- **Edit**: Modal form to update existing page metadata
- **Delete**: Confirmation modal for deleting page metadata

## Database Schema

The feature uses the `page_metadatas` table with the following fields:

```typescript
{
  id: number;                    // Primary key
  path: string;                  // Page path (e.g., /about, /contact)
  metadata_title: string;        // SEO title (1-60 characters)
  metadata_description: string;  // SEO description (1-160 characters)
  metadata_keywords: string[];   // SEO keywords (max 20 keywords)
  created_at: Date;             // Timestamp
  updated_at: Date;             // Timestamp
}
```

## Features

### 1. List Page with Table

- **Pagination**: 20 items per page
- **Search**: Filter by page path
- **Columns**:
  - Path (clickable, blue text)
  - Meta Title (truncated to 2 lines)
  - Meta Description (truncated to 2 lines, dimmed)
  - Keywords (shows first 4 badges, "+n more" for remaining)
  - Actions (Edit and Delete buttons)

### 2. Create Form

Modal with fields:
- **Path**: Required, must start with `/`
- **Meta Title**: Required, 1-60 characters
- **Meta Description**: Required, 1-160 characters
- **Keywords**: Optional, max 20 keywords (TagsInput component)

### 3. Edit Form

Same as create form, but pre-populated with existing data.

### 4. Delete Confirmation

Simple confirmation modal showing the path being deleted.

## Usage

### Basic Implementation

```tsx
import { PageSettingsPage } from "@/features/dashboard-page-settings";

export default function DashboardPageSettingsRoute() {
  return <PageSettingsPage />;
}
```

### Custom Implementation

```tsx
"use client";

import {
  PageMetadataTable,
  CreatePageMetadataModal,
  EditPageMetadataModal,
  DeletePageMetadataModal,
  usePageMetadataTable,
  usePageMetadataData,
  usePageMetadataModals,
} from "@/features/dashboard-page-settings";

export function CustomPageSettings() {
  // Table state (pagination and search)
  const { page, search, handlePageChange, handleSearchChange } =
    usePageMetadataTable();

  // Data fetching
  const { items, totalPages, handleRefresh, pageMetadataQuery } =
    usePageMetadataData({
      search,
      page,
      limit: 20,
    });

  // Modal state management
  const {
    createModalOpened,
    editModalOpened,
    deleteModalOpened,
    selectedPageMetadata,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  } = usePageMetadataModals();

  const handleEdit = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item) openEditModal(id, item.path);
  };

  const handleDelete = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item) openDeleteModal(id, item.path);
  };

  return (
    <>
      <PageMetadataTable
        items={items}
        isLoading={pageMetadataQuery.isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        search={search}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        isRefetching={pageMetadataQuery.isRefetching}
        onCreate={openCreateModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreatePageMetadataModal
        opened={createModalOpened}
        onClose={closeCreateModal}
        onSuccess={handleRefresh}
      />

      <EditPageMetadataModal
        opened={editModalOpened}
        onClose={closeEditModal}
        pageMetadataId={selectedPageMetadata?.id ?? null}
        onSuccess={handleRefresh}
      />

      <DeletePageMetadataModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        pageMetadata={selectedPageMetadata}
        onSuccess={handleRefresh}
      />
    </>
  );
}
```

## API (RPC Functions)

All RPC functions are available via `rpc.pageSettings.*`:

### List Page Metadata

```typescript
const { data } = useQuery(
  rpc.pageSettings.listPageMetadata.queryOptions({
    input: {
      search: "", // Optional search query
      page: 1,    // Page number (1-indexed)
      limit: 20,  // Items per page
    },
  })
);
```

### Get Page Metadata by ID

```typescript
const { data } = useQuery(
  rpc.pageSettings.getPageMetadataById.queryOptions({
    input: { id: 1 },
  })
);
```

### Create Page Metadata

```typescript
const mutation = useMutation({
  mutationFn: (values) => client.pageSettings.createPageMetadata(values),
});

await mutation.mutateAsync({
  path: "/about",
  metadata_title: "About Us - Company",
  metadata_description: "Learn more about our company...",
  metadata_keywords: ["about", "company", "mission"],
});
```

### Update Page Metadata

```typescript
const mutation = useMutation({
  mutationFn: (values) => client.pageSettings.updatePageMetadata(values),
});

await mutation.mutateAsync({
  id: 1,
  path: "/about",
  metadata_title: "About Us - Updated",
  metadata_description: "Updated description...",
  metadata_keywords: ["about", "company"],
});
```

### Delete Page Metadata

```typescript
const mutation = useMutation({
  mutationFn: (values) => client.pageSettings.deletePageMetadata(values),
});

await mutation.mutateAsync({ id: 1 });
```

## File Structure

```
src/features/dashboard-page-settings/
├── components/
│   ├── atoms/
│   │   ├── page-metadata-table-cells.tsx  # Table cell components
│   │   └── index.ts
│   ├── lib/
│   │   ├── page-metadata-table-columns.tsx  # TanStack Table columns
│   │   └── index.ts
│   ├── molecules/
│   │   ├── create-page-metadata-modal.tsx  # Create modal
│   │   ├── edit-page-metadata-modal.tsx    # Edit modal
│   │   ├── delete-page-metadata-modal.tsx  # Delete modal
│   │   ├── page-metadata-table-actions.tsx # Action buttons
│   │   └── index.ts
│   ├── organisms/
│   │   ├── page-metadata-table.tsx         # Main table component
│   │   ├── page-settings-page.tsx          # Complete page example
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── use-page-metadata-data.ts     # Data fetching hook
│   ├── use-page-metadata-modals.ts   # Modal state management
│   ├── use-page-metadata-table.ts    # Table state management
│   └── index.ts
├── lib/
│   ├── form-schema.ts  # Zod schemas for forms
│   └── index.ts
├── server/
│   ├── constants.ts   # Validation constants
│   ├── functions.ts   # oRPC callable functions
│   ├── helpers.ts     # Database helpers
│   ├── router.ts      # RPC router export
│   ├── schemas.ts     # Zod schemas for RPC
│   └── index.ts
└── index.ts
```

## Atomic Design Pattern

The components follow Atomic Design principles:

- **Atoms**: `PathCell`, `MetadataTitleCell`, `MetadataDescriptionCell`, `KeywordsCell`
- **Molecules**: Modals (`CreatePageMetadataModal`, `EditPageMetadataModal`, `DeletePageMetadataModal`), Action buttons
- **Organisms**: `PageMetadataTable`, `PageSettingsPage`

## Validation Rules

- **Path**: 1-255 characters, must start with `/`
- **Meta Title**: 1-60 characters
- **Meta Description**: 1-160 characters
- **Keywords**: Individual keywords 1-50 characters, max 20 total

## Clean Code Principles

1. **Separation of Concerns**: Server logic, components, and hooks are separated
2. **Single Responsibility**: Each component has a single, well-defined purpose
3. **DRY**: Reusable hooks for common functionality
4. **Type Safety**: Full TypeScript coverage with Zod validation
5. **Accessibility**: Proper ARIA labels and semantic HTML
6. **Performance**: Debounced search, memoized columns, pagination

## Notes

- Migrations for the `page_metadatas` table are already created and applied
- The feature is registered in the RPC adapter (`src/adapters/rpc/index.ts`)
- All forms use Mantine + Zod validation via `zod4Resolver`
- Table uses TanStack Table v8 with Mantine UI components
- Search is debounced with 500ms delay using `ahooks`
