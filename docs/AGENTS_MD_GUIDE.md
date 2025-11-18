# AGENTS.md Documentation Guide

This guide explains the purpose, structure, and best practices for creating and maintaining `AGENTS.md` files in the Djavacoal project.

## Purpose

Each feature in `src/features/<feature-name>/` must have an `AGENTS.md` file that serves as comprehensive documentation for AI coding agents and human developers. These files provide:

- Complete feature overview and purpose
- Architecture and code organization details
- Database schemas and data structures
- RPC function definitions with examples
- Integration points with other features
- Usage examples and patterns
- Best practices and common pitfalls

## Required Sections

Every `AGENTS.md` file must include these sections in order:

### 1. Title and Overview

```markdown
# Feature Name

## Overview

[2-3 paragraphs explaining]:
- What the feature does
- Who uses it (admin/visitor/both)
- Key capabilities
- How it fits in the overall application
```

### 2. Architecture

```markdown
## Architecture

### Directory Structure

[Show the complete directory tree with explanations]

```
feature-name/
├── components/          # UI components organized by atomic design
│   ├── atoms/          # Basic UI elements
│   ├── molecules/      # Composite components
│   └── organisms/      # Complex sections
├── hooks/              # React hooks for feature operations
├── lib/                # Business logic, utilities, constants
│   ├── constants.ts    # Feature-specific constants
│   ├── types.ts        # TypeScript interfaces
│   └── utils.ts        # Helper functions
├── server/             # Server-side logic (if applicable)
│   ├── functions.ts    # oRPC callable functions
│   ├── schemas.ts      # Zod schemas for validation
│   ├── router.ts       # RPC router exports
│   └── index.ts        # Server module exports
├── AGENTS.md          # This file
└── index.ts            # Feature barrel export
```

[Explain any deviations from standard structure]
```

### 3. Features

```markdown
## Features

### Core Functionality

1. **Feature One**
   - Detailed description
   - Key capabilities
   - User actions

2. **Feature Two**
   - Detailed description
   - Key capabilities
   - User actions

[List all major features with clear descriptions]
```

### 4. Technical Implementation

```markdown
## Technical Implementation

### Server-Side (RPC Functions)

[If feature has RPC functions]

All server functions are located in `server/functions.ts` and registered in the RPC router as `featureName`:

#### Available RPC Functions

```typescript
// List all RPC functions with clear descriptions
rpc.featureName.functionName.useQuery({ param: value })
rpc.featureName.mutationName.useMutation()
```

### Database Schema

[If feature uses database]

#### `table_name` table

```typescript
{
  id: number;              // Primary key
  field_name: string;      // Description
  created_at: Date;        // Auto-generated
  updated_at: Date;        // Auto-updated
}
```

### Component Structure

[For visitor features with complex UI]

Explain component hierarchy and organization
```

### 5. Constants

```markdown
## Constants

[If feature has constants]

Located in `lib/constants.ts` or `server/constants.ts`:

```typescript
CONSTANT_NAME = "value"  // Description
```
```

### 6. Integration Points

```markdown
## Integration Points

### RPC Router Registration

[If feature has RPC]

```typescript
import { router as featureName } from "@/features/feature-name/server/router";

const router = {
  featureName,
  // ...other routers
};
```

### Route Pages

[List where feature is used]

- `/dashboard/feature` - Description
- `/public/feature` - Description

### Dependencies

[List integration with other features/adapters]
```

### 7. Dependencies

```markdown
## Dependencies

### External Packages
- `package-name` - Purpose and usage
- `another-package` - Purpose and usage

### Internal Dependencies
- `@/adapters/d1` - Database access
- `@/features/other-feature` - Description
- `@/lib/rpc` - RPC client
```

### 8. Usage Examples

```markdown
## Usage Examples

### Example 1: Common Use Case

```typescript
// Complete, runnable code examples
const { data } = rpc.feature.function.useQuery();
```

### Example 2: Another Common Pattern

```typescript
// More examples
```

[Provide 2-5 real-world usage examples]
```

### 9. Error Handling

```markdown
## Error Handling

### Server-Side
- `ERROR_CODE` - Description and when it occurs
- `ANOTHER_ERROR` - Description

### Client-Side
- Network errors handling
- Form validation
- User feedback patterns
```

### 10. Best Practices for AI Agents

```markdown
## Best Practices for AI Agents

### When Adding Features
1. Specific guidance for adding new functionality
2. Patterns to follow
3. Things to validate
4. Testing considerations

### When Modifying
1. What to check before making changes
2. Backward compatibility considerations
3. Update requirements (schemas, types, etc.)

### When Debugging
1. Common issues and solutions
2. Where to look for problems
3. Debugging strategies
```

### 11. Related Features

```markdown
## Related Features

- **feature-name** - How it relates
- **another-feature** - Integration points
```

### 12. Future Enhancements

```markdown
## Future Enhancements

- [ ] Potential improvement 1
- [ ] Potential improvement 2
- [ ] Feature request 3
```

### 13. License

```markdown
## License

Part of the Djavacoal project. See main project LICENSE file.
```

## Optional Sections

Add these sections when relevant:

### SEO Considerations

For public-facing features:

```markdown
## SEO Considerations

- Meta tags approach
- Structured data
- OpenGraph configuration
- Sitemap integration
```

### Performance Optimizations

For performance-critical features:

```markdown
## Performance Optimizations

1. **Optimization Category**
   - Specific optimization
   - Measurement approach
   - Results

2. **Another Category**
   - Details
```

### Security Considerations

For features handling sensitive data:

```markdown
## Security Considerations

1. Authentication/authorization approach
2. Data validation
3. Input sanitization
4. Rate limiting
5. CSRF protection
```

### Accessibility

For UI-heavy features:

```markdown
## Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management
```

## Writing Style Guidelines

### Voice and Tone
- Use clear, concise language
- Write in present tense
- Use active voice
- Be specific and detailed
- Assume reader has basic Next.js/React knowledge

### Code Examples
- Provide complete, runnable examples
- Include necessary imports
- Show actual usage, not pseudo-code
- Comment complex logic
- Use TypeScript with proper types

### Technical Accuracy
- Always verify code examples work
- Keep examples up-to-date with codebase
- Reference actual file paths
- Use correct function/variable names
- Match current API signatures

### Formatting
- Use proper markdown syntax
- Include code fences with language tags
- Use bullet points for lists
- Use numbered lists for sequential steps
- Bold important terms on first use

## Common Patterns

### RPC Function Documentation

```markdown
#### Function Name

Description of what it does.

```typescript
// Usage example
rpc.feature.functionName.useQuery({
  param1: "value",
  param2: 123
})
```

**Input Schema:**
```typescript
{
  param1: string;
  param2: number;
}
```

**Output Schema:**
```typescript
{
  data: ResultType;
  meta: MetaType;
}
```
```

### Database Schema Documentation

```markdown
#### `table_name` table

Purpose and usage of this table.

```typescript
{
  id: number;                    // Primary key (auto-increment)
  field_name: string;            // Description with constraints
  another_field: Date | null;    // Nullable field description
  created_at: Date;              // Auto-generated timestamp
  updated_at: Date;              // Auto-updated timestamp
}
```

**Indexes:**
- `field_name` - For fast lookups
- `another_field` - Composite index with...

**Relationships:**
- Belongs to `other_table` via `foreign_key_id`
```

### Component Documentation

```markdown
#### ComponentName

Description of component purpose and behavior.

**Props:**
```typescript
interface ComponentProps {
  prop1: string;           // Description
  prop2?: number;          // Optional prop
  onAction: () => void;    // Callback description
}
```

**Usage:**
```typescript
<ComponentName 
  prop1="value"
  prop2={42}
  onAction={() => console.log("Action")}
/>
```

**Features:**
- Feature 1 description
- Feature 2 description
```

## Maintenance

### When to Update

Update `AGENTS.md` files when:
- Adding new RPC functions
- Changing database schemas
- Adding new components
- Modifying API contracts
- Changing integration patterns
- Fixing bugs that reveal missing documentation
- Adding new dependencies

### Version Control

- Commit AGENTS.md updates with related code changes
- Use descriptive commit messages
- Review AGENTS.md in code reviews
- Keep examples synchronized with code

### Quality Checks

Before committing AGENTS.md updates:
- [ ] All code examples are tested and work
- [ ] File paths are correct
- [ ] No outdated information
- [ ] All sections are present
- [ ] Links work correctly
- [ ] Markdown renders properly
- [ ] No typos or grammar errors

## Template

Use this template when creating a new AGENTS.md:

```markdown
# Feature Name

## Overview

[Feature description and purpose]

## Architecture

### Directory Structure

[Directory tree with explanations]

## Features

### Core Functionality

1. **Feature Name**
   - Description
   - Capabilities

## Technical Implementation

[RPC functions, schemas, components, etc.]

## Constants

[Feature constants if any]

## Integration Points

[RPC registration, routes, dependencies]

## Dependencies

### External Packages
- List packages

### Internal Dependencies
- List internal deps

## Usage Examples

### Example Title

[Code example]

## Error Handling

### Server-Side
### Client-Side

## Best Practices for AI Agents

### When Adding Features
### When Modifying
### When Debugging

## Related Features

- **feature-name** - Relationship

## Future Enhancements

- [ ] Enhancement 1

## License

Part of the Djavacoal project. See main project LICENSE file.
```

## Examples

See existing AGENTS.md files for reference:
- `src/features/dashboard-product/AGENTS.md` - Complex dashboard feature
- `src/features/public-api/AGENTS.md` - API feature with OpenAPI
- `src/features/dashboard-news/AGENTS.md` - Content management
- `src/features/blog/AGENTS.md` - Public visitor feature
- `src/features/home/AGENTS.md` - Simple visitor feature

## Questions or Issues?

If you're unsure about how to document something:
1. Look at similar features' AGENTS.md files
2. Refer to this guide
3. Ask in team discussions
4. Update this guide if you find gaps

---

**Remember:** Good documentation is as important as good code. Take time to write clear, accurate, and helpful AGENTS.md files!