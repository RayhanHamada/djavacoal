# Dashboard Team Member Feature

## Overview

This feature provides complete team member management functionality for the Djavacoal admin dashboard. Team members are displayed on the "About Company" page and can be managed through a dedicated admin interface with full CRUD operations, photo management, and drag-and-drop reordering.

## Architecture

### Directory Structure

```
dashboard-team-member/
├── components/           # UI components organized by atomic design
│   ├── atoms/           # Basic UI elements
│   │   └── team-member-card.tsx
│   ├── molecules/       # Composite components
│   │   ├── team-member-form.tsx
│   │   └── team-member-modal.tsx
│   └── organisms/       # Complex page sections
│       └── team-members-list-view.tsx
├── hooks/               # React hooks for data fetching and mutations
│   ├── use-team-members-list.tsx
│   ├── use-team-member-mutations.tsx
│   └── use-file-upload.tsx
├── lib/                 # Business logic, constants, and form schemas
│   ├── constants.ts    # Validation limits, UI configuration, R2 prefix
│   ├── form-schema.ts  # Mantine form validation schemas
│   └── index.ts        # Barrel exports
├── server/              # Server-side logic (RPC functions)
│   ├── functions.ts    # oRPC callable functions
│   ├── schemas.ts      # Zod schemas for input/output validation
│   ├── router.ts       # RPC router exports
│   └── index.ts        # Server module exports
└── AGENTS.md           # This file
```

## Features

### Core Functionality

1. **CRUD Operations**
   - Create new team members with name, position, and photo
   - Update existing team member information
   - Delete team members (with automatic photo cleanup from R2)
   - View list of all team members

2. **Photo Management**
   - Direct upload to Cloudflare R2 storage
   - Presigned URL generation for secure uploads
   - Automatic old photo deletion on update
   - Preview functionality before upload
   - Image validation (type, size)

3. **Drag-and-Drop Reordering**
   - Visual reordering of team members via drag-and-drop
   - Automatic order_index management
   - Real-time UI updates

4. **Authentication**
   - All operations require admin authentication
   - Uses Better Auth session validation

## Technical Implementation

### Server-Side (RPC Functions)

All server functions are located in `server/functions.ts` and registered in the RPC router as `dashboardTeamMember`:

#### Available RPC Functions

```typescript
// List all team members (ordered by order_index)
rpc.dashboardTeamMember.listTeamMembers.useQuery()

// Get single team member by ID
rpc.dashboardTeamMember.getTeamMemberById.useQuery({ id })

// Create new team member
rpc.dashboardTeamMember.createTeamMember.useMutation()

// Update existing team member
rpc.dashboardTeamMember.updateTeamMember.useMutation()

// Delete team member
rpc.dashboardTeamMember.deleteTeamMember.useMutation()

// Reorder team members
rpc.dashboardTeamMember.reorderTeamMembers.useMutation()

// Generate presigned upload URL
rpc.dashboardTeamMember.generateTeamMemberUploadUrl.useMutation()
```

### Client-Side Hooks

#### `useTeamMembersList()`
Fetches the complete list of team members ordered by their display order.

```typescript
const { data, isLoading } = useTeamMembersList();
// data.teamMembers: TeamMemberListItem[]
// data.total: number
```

#### `useTeamMemberMutations()`
Provides mutation functions for all CRUD operations with automatic query invalidation and toast notifications.

```typescript
const { 
  createMutation, 
  updateMutation, 
  deleteMutation, 
  reorderMutation 
} = useTeamMemberMutations();

// Create
createMutation.mutate({ name, position, photo_key });

// Update
updateMutation.mutate({ id, name, position, photo_key });

// Delete
deleteMutation.mutate({ id });

// Reorder
reorderMutation.mutate({ order: [id1, id2, id3] });
```

#### `useFileUpload()`
Manages file selection, preview generation, and cleanup for photo uploads.

```typescript
const { file, preview, handleFileSelect, clearFile } = useFileUpload();
```

### Components

#### `TeamMembersListView` (Organism)
Main container component that displays the team members grid with:
- 4-column responsive layout (Grid: base=12, sm=6, md=4, lg=3)
- Drag-and-drop functionality via `@dnd-kit`
- Add new member button
- Empty state handling
- Loading states

#### `TeamMemberCard` (Atom)
Individual card component featuring:
- Photo display with fallback
- Name and position (with truncation)
- Drag handle (top-left)
- Actions menu (top-right) with delete option
- Click to edit functionality
- Hover states and transitions

#### `TeamMemberModal` (Molecule)
Modal wrapper for create/edit operations:
- Conditional title based on mode
- Handles form submission
- Manages loading states
- Prevents closing during submission

#### `TeamMemberForm` (Molecule)
Form component with:
- Name input (1-150 characters)
- Position input (1-150 characters)
- Photo upload with preview
- Mantine form validation
- Automatic presigned URL generation
- R2 upload handling
- Error display

## Database Schema

Team members are stored in the `team_members` table with the following columns:

```typescript
{
  id: number;              // Primary key
  name: string;            // 1-150 characters
  position: string;        // 1-150 characters
  photo_key: string;       // R2 storage key
  order_index: number;     // Display order (0-based)
  created_at: Date;        // Auto-generated
  updated_at: Date;        // Auto-updated
}
```

## Constants

Located in `server/constants.ts`:

```typescript
// Field length constraints
TEAM_MEMBER_NAME_MIN_LENGTH = 1
TEAM_MEMBER_NAME_MAX_LENGTH = 150
TEAM_MEMBER_POSITION_MIN_LENGTH = 1
TEAM_MEMBER_POSITION_MAX_LENGTH = 150

// Card display limits
CARD_NAME_TRUNCATE_LENGTH = 50
CARD_POSITION_TRUNCATE_LENGTH = 40

// R2 storage prefix
TEAM_MEMBERS_PREFIX = "team-members"
```

## Integration Points

### RPC Router Registration
The feature router must be registered in `/src/adapters/rpc/index.ts`:

```typescript
import { router as dashboardTeamMember } from "@/features/dashboard-team-member/server";

const router = {
  // ...other routers
  dashboardTeamMember,
};
```

### Route Page
Used in the admin route `/dashboard/page-settings/team-members`:

```typescript
import { TeamMembersListView } from "@/features/dashboard-team-member";

export default function TeamMembersPage() {
  return <TeamMembersListView />;
}
```

### R2 Storage
- Bucket: Defined by `DEFAULT_BUCKET_NAME` from `@/adapters/r2`
- Prefix: `team-members/`
- Naming: `team-members/{nanoid}`
- Max file size: 10MB (from `MAX_FILE_SIZE` constant)

### Authentication
All server operations validate session using:
```typescript
const auth = getAuth(env);
const session = await auth.api.getSession({ headers: header });
if (!session) throw errors.UNAUTHORIZED();
```

## Dependencies

### External Packages
- `@dnd-kit/core` & `@dnd-kit/sortable` - Drag and drop functionality
- `@mantine/core`, `@mantine/hooks`, `@mantine/form` - UI components and form management
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` - Database operations
- `nanoid` - Unique ID generation for photo keys
- `react-photo-view` - Image preview functionality
- `zod` - Schema validation
- `mantine-form-zod-resolver` - Zod integration with Mantine forms

### Internal Dependencies
- `@/adapters/d1` - Database access and constants
- `@/adapters/r2` - R2 storage operations
- `@/features/dashboard-auth` - Authentication
- `@/lib/orpc/server` - RPC base configuration
- `@/lib/rpc` - Client-side RPC client

## Usage Example

### Creating a Team Member

```typescript
// 1. User clicks "Add Team Member" button
// 2. Modal opens with empty form
// 3. User fills in name, position, and selects photo
// 4. Photo is uploaded to R2 via presigned URL
// 5. Team member is created with returned photo_key
// 6. List is automatically refreshed
// 7. Success notification is shown
```

### Reordering Team Members

```typescript
// 1. User drags a team member card to new position
// 2. Local state updates immediately (optimistic UI)
// 3. Reorder mutation is triggered with new order array
// 4. Backend updates order_index for all members
// 5. List is refreshed on success
```

### Deleting a Team Member

```typescript
// 1. User clicks delete in card menu
// 2. Confirmation dialog appears
// 3. On confirm, deletion starts
// 4. Photo is deleted from R2
// 5. Database record is deleted
// 6. Remaining members are reordered
// 7. List is refreshed and success notification shown
```

## Error Handling

### Server-Side
- `NOT_FOUND` - Team member doesn't exist
- `UNAUTHORIZED` - No valid session
- `INTERNAL_SERVER_ERROR` - Database or R2 operation failed

### Client-Side
- Network errors shown via Mantine notifications
- Form validation errors displayed inline
- File upload errors shown in form
- R2 upload failures handled gracefully

## Best Practices for AI Agents

### When Adding Features
1. Always maintain the atomic design structure (atoms/molecules/organisms)
2. Use existing hooks for consistency
3. Add new constants to `server/constants.ts`
4. Update schemas in `server/schemas.ts` for validation
5. Export new components through barrel files (`index.ts`)

### When Modifying
1. Check both server and client type definitions
2. Update form schemas in both `lib/form-schema.ts` and `server/schemas.ts`
3. Maintain backward compatibility or update all usages
4. Test with authentication enabled
5. Verify R2 operations don't leak resources

### When Debugging
1. Check RPC registration in `/src/adapters/rpc/index.ts`
2. Verify Cloudflare bindings in `wrangler.jsonc`
3. Ensure Better Auth session is valid
4. Check R2 credentials and bucket configuration
5. Review browser console for RPC errors

## Future Enhancements

Potential improvements for this feature:
- [ ] Bulk operations (multi-delete, multi-reorder)
- [ ] Team member search and filtering
- [ ] Photo cropping/editing before upload
- [ ] Multiple photo formats support
- [ ] Export/import team member data
- [ ] Team member analytics (views, clicks)
- [ ] Social media link fields
- [ ] Bio/description field
- [ ] Department/category grouping
- [ ] Archive instead of delete

## Related Features

- **dashboard-page-settings** - Manages SEO metadata for static pages
- **dashboard-auth** - Provides authentication for all operations
- **dashboard-gallery** - Similar photo management patterns

## License

Part of the Djavacoal project. See main project LICENSE file.
