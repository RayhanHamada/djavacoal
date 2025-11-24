# Dashboard FAQs Feature

## Overview

This feature provides comprehensive FAQ (Frequently Asked Questions) management for the Djavacoal admin dashboard. It supports bilingual content (English/Arabic) with rich text answers, drag-and-drop reordering, and a clean collapsible interface. The dashboard UI uses hardcoded English text for labels and buttons, while FAQ data itself remains bilingual for public display.

## Architecture

### Directory Structure

```
dashboard-faqs/
├── components/          # UI components organized by atomic design
│   ├── atoms/          # Basic UI elements (rich text editor)
│   ├── molecules/      # Composite components (FAQ modal)
│   └── organisms/      # Complex sections (FAQ list, collapsible items)
├── hooks/              # React hooks for FAQ operations
├── lib/                # Constants, utilities, and form schemas
│   ├── constants.ts    # Validation constants
│   ├── form-schemas.ts # Zod schemas for client-side forms (Mantine Form)
│   └── index.ts        # Lib barrel export
├── server/             # Server-side logic (RPC functions)
│   ├── functions.ts    # oRPC callable functions
│   ├── schemas.ts      # Zod schemas for server function validation
│   ├── router.ts       # RPC router exports
│   └── index.ts        # Server module exports
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **FAQ Management**
   - Create FAQs with bilingual content (EN/AR)
   - Update existing FAQs
   - Delete FAQs with confirmation dialog
   - List FAQs with collapsible display
   - Reorder FAQs via drag-and-drop

2. **FAQ Structure**
   - Question (EN/AR): Text input with max 100 characters
   - Answer (EN/AR): Rich text editor with max 500 characters
   - Order Index: 0-based sequential ordering
   - Timestamps: created_at, updated_at

3. **Rich Text Editor**
   - Basic formatting: Bold, Italic, Strikethrough
   - Link support: Add/remove hyperlinks
   - Lists: Bullet and ordered lists
   - Undo/Redo functionality
   - Character counter with validation
   - Based on TipTap editor

4. **Language Support**
   - Bilingual content (English/Arabic)
   - Language switcher in modal and collapsible items
   - Only English fields are required
   - Arabic fields are optional
   - RTL support for Arabic text

5. **User Experience**
   - Collapsible FAQ items for space efficiency
   - Drag handle for intuitive reordering
   - Inline language switching within collapsed view
   - Empty state with call-to-action
   - Loading skeleton for better UX
   - Toast notifications for all actions

## Technical Implementation

### Schema Organization

This feature uses **separated validation schemas** for better maintainability:

**Form Schemas** (`lib/form-schemas.ts`):
- Used by client-side Mantine Form components
- Include user-friendly error messages
- Integrated with `zod4Resolver` for Mantine Form
- Types: `CreateFaqFormInput`, `UpdateFaqFormInput`

```typescript
// Example: Form schema with detailed error messages
export const CreateFaqFormSchema = z.object({
    en_question: z
        .string()
        .trim()
        .min(5, "English question must be at least 5 characters")
        .max(100, "English question must be at most 100 characters"),
    // ... other fields
});

export const validateCreateFaqForm = zod4Resolver(CreateFaqFormSchema);
```

**Server Schemas** (`server/schemas.ts`):
- Used by server-side RPC functions
- Minimal, concise validation (no custom error messages)
- Server handles validation errors
- Types: `CreateFaqInput`, `UpdateFaqInput`

```typescript
// Example: Server schema without custom messages
export const CreateFaqInputSchema = z.object({
    en_question: z.string().trim().min(5).max(100),
    ar_question: z.string().trim().max(100).optional().default(""),
    // ... other fields
});
```

**Why Separate?**
- **Clarity**: Clear separation between client and server validation
- **Flexibility**: Different error messages for forms vs API
- **Maintainability**: Changes to form UX don't affect server contracts
- **Type Safety**: Distinct types prevent accidental misuse

### Database Schema

The FAQ table schema is defined in `src/adapters/d1/schema.ts`:

```typescript
export const faqs = sqliteTable(TABLE_NAMES.FAQS, {
    id: int().primaryKey(),
    en_question: text().notNull(),
    ar_question: text().notNull(),
    en_answer: text().notNull(),
    ar_answer: text().notNull(),
    order_index: int().notNull(),
    created_at: int({ mode: "timestamp" }).notNull(),
    updated_at: int({ mode: "timestamp" }).notNull(),
});
```

### Server-Side (RPC Functions)

All server functions are located in `server/functions.ts` and registered in the RPC router as `dashboardFaqs`:

#### List FAQs

```typescript
// Get all FAQs ordered by order_index
rpc.dashboardFaqs.listFaqs.queryOptions()

// Returns:
{
  faqs: [
    {
      id: number,
      en_question: string,
      ar_question: string,
      en_answer: string,
      ar_answer: string,
      order_index: number,
      created_at: Date,
      updated_at: Date
    }
  ],
  total: number
}
```

#### Get FAQ by ID

```typescript
// Get single FAQ by ID
rpc.dashboardFaqs.getFaqById.queryOptions({ id: 1 })

// Returns same structure as list item
```

#### Create FAQ

```typescript
// Create new FAQ (added to bottom of list)
rpc.dashboardFaqs.createFaq.mutationOptions()

// Input:
{
  en_question: string,  // Required, 5-100 characters
  ar_question?: string, // Optional, max 100 characters
  en_answer: string,    // Required, 10-500 characters (HTML)
  ar_answer?: string    // Optional, max 500 characters (HTML)
}

// Returns:
{
  id: number,
  en_question: string,
  ar_question: string,
  en_answer: string,
  ar_answer: string,
  order_index: number
}
```

#### Update FAQ

```typescript
// Update existing FAQ
rpc.dashboardFaqs.updateFaq.mutationOptions()

// Input:
{
  id: number,
  en_question: string,  // Required, 5-100 characters
  ar_question?: string, // Optional, max 100 characters
  en_answer: string,    // Required, 10-500 characters (HTML)
  ar_answer?: string    // Optional, max 500 characters (HTML)
}

// Returns: { success: boolean }
```

#### Delete FAQ

```typescript
// Delete FAQ and reorder remaining items
rpc.dashboardFaqs.deleteFaq.mutationOptions()

// Input: { id: number }
// Returns: { success: boolean }
// Note: Automatically reorders remaining FAQs
```

#### Reorder FAQs

```typescript
// Batch update order_index for all FAQs
rpc.dashboardFaqs.reorderFaqs.mutationOptions()

// Input:
{
  order: number[] // Array of FAQ IDs in new order
}

// Returns: { success: boolean }
```

#### Get FAQ Count

```typescript
// Get total number of FAQs
rpc.dashboardFaqs.getFaqCount.queryOptions()

// Returns: { count: number }
```

### Client-Side Components

#### FaqsListPage (Main Container)

The main page component that orchestrates the FAQ management interface:

**Location**: `components/organisms/faqs-list-page.tsx`

**Features**:
- Fetches and displays FAQs
- Handles drag-and-drop reordering
- Manages modal state for create/edit
- Displays empty state when no FAQs exist
- Loading skeleton during data fetch

**Usage**:
```tsx
import { FaqsListPage } from "@/features/dashboard-faqs";

export default function FaqsPage() {
  return <FaqsListPage />;
}
```

#### FaqCollapsibleItem

Individual FAQ item with collapsible content:

**Location**: `components/organisms/faq-collapsible-item.tsx`

**Features**:
- Sortable via @dnd-kit
- Language switcher (EN/AR)
- Edit/Delete action buttons
- Drag handle for reordering
- Collapse/expand toggle

**Props**:
```typescript
{
  faq: FaqListItem,
  onEdit: (faq: FaqListItem) => void,
  onDelete: (id: number) => void
}
```

#### FaqModal

Modal dialog for creating and editing FAQs:

**Location**: `components/molecules/faq-modal.tsx`

**Features**:
- Dual-mode: Create or Edit
- Language switcher (EN/AR)
- Form validation with Mantine Form + Zod
- Rich text editor for answers
- Character counters
- Real-time validation feedback

**Props**:
```typescript
{
  opened: boolean,
  onClose: () => void,
  faqToEdit?: {
    id: number,
    en_question: string,
    ar_question: string,
    en_answer: string,
    ar_answer: string
  }
}
```

#### FaqRichTextEditor

Simple rich text editor for FAQ answers:

**Location**: `components/atoms/faq-rich-text-editor.tsx`

**Features**:
- Based on TipTap editor
- Toolbar: Bold, Italic, Strikethrough, Link, Lists
- Bubble menu for inline formatting
- Character counter
- Placeholder support
- Error state display
- HTML output

**Props**:
```typescript
{
  value: string,          // HTML string
  onChange: (value: string) => void,
  placeholder?: string,
  label?: string,
  error?: string,
  maxLength?: number
}
```

### Validation Rules

#### Question Validation
- **English**: 
  - Required
  - Minimum: 5 characters
  - Maximum: 100 characters
- **Arabic**:
  - Optional
  - Maximum: 100 characters

#### Answer Validation
- **English**:
  - Required
  - Minimum: 10 characters (plain text)
  - Maximum: 500 characters (plain text)
  - Stored as HTML
- **Arabic**:
  - Optional
  - Maximum: 500 characters (plain text)
  - Stored as HTML

### Drag and Drop Implementation

The feature uses `@dnd-kit` library for drag-and-drop functionality:

```typescript
// Drag-and-drop setup
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Prevents accidental drags
    },
  })
);

// Handle drag end
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  
  if (over && active.id !== over.id) {
    const oldIndex = faqs.findIndex((f) => f.id === active.id);
    const newIndex = faqs.findIndex((f) => f.id === over.id);
    
    const newFaqs = arrayMove(faqs, oldIndex, newIndex);
    const newOrder = newFaqs.map((f) => f.id);
    
    reorderMutation.mutate({ order: newOrder });
  }
};
```

**Visual Feedback**:
- Drag handle icon (grip vertical) at left side
- 50% opacity on dragged item
- DragOverlay shows preview during drag
- Closest center collision detection

### Authentication

All server-side operations require admin authentication:

```typescript
const auth = getAuth(env);
const header = await headers();

const session = await auth.api.getSession({
  headers: header,
});

if (!session) {
  throw errors.UNAUTHORIZED();
}
```

### Form Management

FAQ forms use Mantine Form with separated form schemas:

```typescript
import { useFaqForm } from "../../hooks";
import { CreateFaqFormInput } from "../../lib";

// Initialize form with form schema validation
const form = useFaqForm(initialValues);

// Submit handler receives form input type
const handleSubmit = (values: CreateFaqFormInput) => {
  // Values are validated by form schema
  // Convert to server input if needed
  createMutation.mutate(values);
};

// Usage in JSX
<form onSubmit={form.onSubmit(handleSubmit)}>
  <TextInput
    label="English Question"
    required
    key={form.key("en_question")}
    {...form.getInputProps("en_question")}
  />
</form>
```

**Form Hook** (`hooks/use-faq-form.ts`):
- Uses `CreateFaqFormSchema` from `lib/form-schemas.ts`
- Provides validation with user-friendly error messages
- Returns Mantine Form instance with type `CreateFaqFormInput`

**Type Flow**:
1. Form validates with `CreateFaqFormInput` (client-side)
2. Submit handler receives `CreateFaqFormInput`
3. Mutation accepts `CreateFaqInput` (server-side)
4. Server validates with `CreateFaqInputSchema`

## User Workflows

### Creating a FAQ

1. Admin clicks "Create FAQ" button
2. Modal opens with empty form
3. Admin enters English question (required)
4. Admin enters English answer using rich text editor (required)
5. Admin optionally switches to Arabic tab
6. Admin optionally enters Arabic translations
7. Admin clicks "Create FAQ"
8. FAQ is added to bottom of list
9. Success notification appears
10. Modal closes and list refreshes

### Editing a FAQ

1. Admin clicks edit icon on FAQ item
2. Modal opens with pre-filled form
3. Admin can switch between EN/AR tabs
4. Admin modifies fields
5. Admin clicks "Update FAQ"
6. Changes are saved
7. Success notification appears
8. Modal closes and list refreshes

### Deleting a FAQ

1. Admin clicks delete icon on FAQ item
2. Confirmation modal appears
3. Admin confirms deletion
4. FAQ is removed from database
5. Remaining FAQs are reordered automatically
6. Success notification appears
7. List refreshes

### Reordering FAQs

1. Admin clicks and holds drag handle
2. FAQ item becomes draggable
3. Admin drags FAQ to new position
4. Drop zone is highlighted
5. Admin releases mouse
6. New order is saved to database
7. Success notification appears
8. List updates with new order

## Constants

All validation constants are defined in `lib/constants.ts`:

```typescript
FAQ_QUESTION_MIN_LENGTH = 5
FAQ_QUESTION_MAX_LENGTH = 100
FAQ_ANSWER_MIN_LENGTH = 10
FAQ_ANSWER_MAX_LENGTH = 500
```

## Error Handling

All mutations include comprehensive error handling:

```typescript
onError: (error: Error) => {
  notifications.show({
    title: "Error",
    message: error.message || "Operation failed",
    color: "red",
  });
}
```

Common errors:
- `UNAUTHORIZED`: Session expired or invalid
- `NOT_FOUND`: FAQ doesn't exist
- `BAD_REQUEST`: Validation failed
- `INTERNAL_SERVER_ERROR`: Database error

## Best Practices

### When Creating FAQs
1. Write clear, concise questions
2. Provide complete answers with formatting
3. Use links sparingly in answers
4. Fill Arabic translations for better i18n support
5. Test both language versions

### When Editing FAQs
1. Preserve formatting when updating answers
2. Check both EN and AR versions if edited
3. Ensure questions remain clear after edits

### When Reordering FAQs
1. Group related FAQs together
2. Place most important FAQs at the top
3. Consider user flow when ordering

### Performance Considerations
1. FAQ list loads all items at once (no pagination)
2. Consider pagination if FAQ count exceeds 50
3. Rich text editor can be heavy with large content
4. Drag-and-drop is optimized for lists under 100 items

## Integration Points

### Dashboard Navigation

The FAQ management page is integrated into the dashboard navigation under "Page Settings":

**Location**: `src/features/dashboard/lib/navigation-config.ts`

```typescript
{
    label: "Page Settings",
    icon: IconLayoutDashboard,
    description: "Page configurations",
    children: [
        // ... other settings
        {
            icon: IconHelp,
            label: "FAQs",
            href: "/dashboard/faqs",
        },
    ],
}
```

**Access**: Navigate to Dashboard → Page Settings → FAQs

## Getting Started

### Quick Start Guide

1. **Access the Feature**
   - Log in to the admin dashboard
   - Click "Page Settings" in the sidebar
   - Select "FAQs" from the submenu
   - You'll be redirected to `/dashboard/faqs`

2. **Create Your First FAQ**
   - Click the "Create FAQ" button
   - Enter the English question (required)
   - Enter the English answer using the rich text editor (required)
   - Optionally switch to the Arabic tab to add translations
   - Click "Create FAQ" to save

3. **Manage Existing FAQs**
   - Click the expand icon (chevron) to view the answer
   - Click the edit icon to modify content
   - Click the delete icon to remove (with confirmation)
   - Drag the grip handle to reorder FAQs

4. **Best Practices**
   - Write clear, concise questions (max 100 characters)
   - Provide complete, helpful answers (max 500 characters)
   - Add Arabic translations for better multilingual support
   - Order FAQs by importance (most common at top)
   - Test formatting in the rich text editor

### Database Migration

If this is a fresh installation, ensure the FAQ table exists:

```bash
# Generate migration if needed
bun d1:generate

# Apply migration to remote database
bun d1:migrate:djavacoal
```

### Public API

FAQs are exposed via the public API for the visitor-facing FAQ section in the Production Info page:

**Endpoint**: `GET /api/public/faqs`

**Response Schema**:
```typescript
{
  data: {
    faqs: [
      {
        id: number,
        question: string,  // Localized based on Accept-Language or locale cookie
        answer: string,    // Localized HTML content
        order_index: number
      }
    ],
    total: number
  }
}
```

**Features**:
- Locale-aware: Returns EN or AR content based on user's locale
- Ordered by `order_index` ascending (same order as dashboard)
- No authentication required
- Cached on client-side via TanStack Query

**Usage in Components**:
```typescript
import { usePublicFaqsAPI } from "@/features/public-api/hooks";

function FAQSection() {
  const { data } = usePublicFaqsAPI();
  const faqs = data?.data.faqs ?? [];
  
  return (
    <div>
      {faqs.map(faq => (
        <div key={faq.id}>
          <h3>{faq.question}</h3>
          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
        </div>
      ))}
    </div>
  );
}
```

**Integration**:
- Router: `src/features/public-api/router.ts` (getPublicFaqs)
- Hook: `src/features/public-api/hooks/index.ts` (usePublicFaqsAPI)
- Schema: `src/features/public-api/schemas.ts` (PUBLIC_FAQS_OUTPUT_SCHEMA)
- Consumer: `src/features/production-info/components/organism/faq-section.tsx` (Server Component)
```

## Future Enhancements

1. **Categories**: Group FAQs by category (Product, Shipping, etc.)
2. **Search**: Filter FAQs by keyword
3. **Analytics**: Track which FAQs are viewed most
4. **Visibility Toggle**: Show/hide individual FAQs without deleting
5. **Version History**: Track changes to FAQ content
6. **Import/Export**: Bulk manage FAQs via CSV/JSON
7. **Preview Mode**: Preview how FAQ will appear to visitors
8. **Image Support**: Allow images in rich text answers

## Troubleshooting

### Rich Text Editor Not Updating
- Check that `value` prop is passed correctly
- Ensure `onChange` is updating parent state
- Verify HTML content is valid
- **Fixed**: Added `useEffect` to sync editor content when `value` prop changes (important for language switching)
- **Fixed**: Added unique `key` props ("en-answer", "ar-answer") to force re-render when switching languages

### Drag-and-Drop Not Working
- Confirm `@dnd-kit` packages are installed
- Check that each FAQ has unique `id`
- Verify `useSortable` is called correctly

### Form Validation Errors
- Check that English fields are filled (required)
- Verify character counts are within limits
- Ensure HTML content length is measured correctly

### Reorder Not Persisting
- Check authentication is valid
- Verify `reorderFaqs` mutation is called
- Confirm database update succeeds

## Testing Checklist

- [ ] Create FAQ with only English content
- [ ] Create FAQ with both EN and AR content
- [ ] Edit existing FAQ
- [ ] Delete FAQ (with confirmation)
- [ ] Reorder FAQs via drag-and-drop
- [ ] Test rich text formatting (bold, italic, links)
- [ ] Test character counter validation
- [ ] Test form validation (required fields)
- [ ] Test empty state display
- [ ] Test loading state
- [ ] Test error handling
- [ ] Test language switching in collapsible items
- [ ] Test language switching in modal
- [ ] Test RTL display for Arabic content

## Dependencies

- `@mantine/core` - UI components
- `@mantine/form` - Form management
- `@mantine/hooks` - React hooks (useDisclosure)
- `@mantine/modals` - Confirmation dialogs
- `@mantine/notifications` - Toast notifications
- `@mantine/tiptap` - Rich text editor wrapper
- `@tiptap/react` - TipTap React integration
- `@tiptap/starter-kit` - Basic TipTap extensions
- `@tiptap/extension-placeholder` - Placeholder support
- `@dnd-kit/core` - Drag-and-drop core
- `@dnd-kit/sortable` - Sortable list support
- `@tanstack/react-query` - Data fetching and caching
- `zod` - Schema validation

## License

Part of the Djavacoal project. See main project LICENSE file.
