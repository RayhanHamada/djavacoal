# About Company Feature

## Overview

This feature provides the "About Company" page displaying Djavacoal's company information, history, mission, vision, team members, and company gallery. Content is bilingual (English/Arabic) and managed through various dashboard features.

## Architecture

### Directory Structure

```
about-company/
└── components/          # UI components for about page
    ├── atoms/          # Basic about page elements
    ├── molecules/      # Composite components (team member cards, timeline)
    └── organisms/      # Complex sections (company story, team grid)
```

## Features

### Core Functionality

1. **Company Story**
   - Company history and background
   - Mission statement
   - Vision statement
   - Core values
   - Bilingual content

2. **Team Members**
   - Display all team members
   - Photos, names, and positions
   - Ordered by display order
   - Managed via dashboard-team-member
   - Bilingual names and positions

3. **Company Gallery**
   - Photo gallery of facilities, operations, team events
   - Lightbox viewer
   - Managed via dashboard-static-media
   - Grid layout

4. **Company Timeline**
   - Key milestones and achievements
   - Chronological display
   - Bilingual descriptions

5. **Certifications**
   - Display of quality certifications
   - Certificate images
   - Descriptions and validity

## Technical Implementation

### Data Fetching

```typescript
// Team members
const { data: teamMembers } = rpc.dashboardTeamMember.listTeamMembers.useQuery();

// Company gallery
const { data: gallery } = rpc.staticMedia.getPhotoList.useQuery({
  kvKey: "about-company-gallery"
});

// Company video (if any)
const { data: video } = rpc.staticMedia.getYouTubeUrl.useQuery({
  kvKey: "about-company-video"
});
```

### SEO Optimization

```typescript
export const metadata: Metadata = {
  title: "About Djavacoal - Company Profile",
  description: "Learn about Djavacoal's history, mission, and team...",
  keywords: ["about", "company", "team", "history", "coal supplier"],
};
```

### Bilingual Support

```typescript
import { useTranslations } from "next-intl";

function CompanyStory() {
  const t = useTranslations("about.story");
  
  return (
    <div>
      <h2>{t("title")}</h2>
      <p>{t("history")}</p>
      <p>{t("mission")}</p>
      <p>{t("vision")}</p>
    </div>
  );
}
```

## Components

### CompanyStorySection
- Full-width or split layout
- Company history text
- Mission/vision boxes
- Core values grid

### TeamMembersGrid
- Responsive grid (2-4 columns)
- Team member cards with photos
- Names and positions
- Hover effects
- Empty state handling

### CompanyGallerySection
- Masonry or grid layout
- Clickable photos (lightbox)
- Photo captions (optional)
- "View more" pagination

### TimelineSection
- Vertical timeline layout
- Year/date markers
- Milestone descriptions
- Alternating left/right layout

### CertificationsSection
- Certificate images in grid
- Certificate names
- Validity dates
- Download links (optional)

## Integration Points

### About Page Route
Located at `/app/(visitor)/about-company/page.tsx`:

```typescript
import { AboutCompanyView } from "@/features/about-company";

export default function AboutCompanyPage() {
  return <AboutCompanyView />;
}
```

### Data Sources
- Team members: `dashboard-team-member` RPC
- Gallery: `dashboard-static-media` (KV: "about-company-gallery")
- Video: `dashboard-static-media` (KV: "about-company-video")
- Static text: i18n messages JSON files

### Navigation
- Header: Navigation to About page
- Footer: Quick link to About
- Uses `VisitorLayout` component

## Dependencies

### External Packages
- `@mantine/core` - UI components
- `framer-motion` - Animations
- `react-photo-view` - Gallery lightbox
- `next-intl` - Internationalization

### Internal Dependencies
- `@/features/dashboard-team-member` - Team member data
- `@/features/dashboard-static-media` - Gallery and video
- `@/components/layouts/visitor-layout` - Layout wrapper
- `@/hooks/use-app-locale` - Current locale

## Usage Examples

### Fetching Team Members

```typescript
export function TeamMembersSection() {
  const { data, isLoading } = rpc.dashboardTeamMember.listTeamMembers.useQuery();
  
  if (isLoading) return <Skeleton />;
  
  return (
    <Grid>
      {data?.teamMembers.map((member) => (
        <TeamMemberCard
          key={member.id}
          name={member.name}
          position={member.position}
          photoUrl={member.photoUrl}
        />
      ))}
    </Grid>
  );
}
```

### Fetching Gallery

```typescript
export function CompanyGallerySection() {
  const { data } = rpc.staticMedia.getPhotoList.useQuery({
    kvKey: "about-company-gallery"
  });
  
  return (
    <PhotoProvider>
      <Gallery photos={data?.photos || []} />
    </PhotoProvider>
  );
}
```

## i18n Structure

Messages file structure (`/src/i18n/messages/en.json`):

```json
{
  "about": {
    "story": {
      "title": "Our Story",
      "history": "Founded in...",
      "mission": "Our mission is to...",
      "vision": "We envision..."
    },
    "team": {
      "title": "Our Team",
      "description": "Meet the people behind Djavacoal"
    },
    "gallery": {
      "title": "Company Gallery",
      "description": "Explore our facilities and operations"
    }
  }
}
```

## Best Practices for AI Agents

### When Adding Features
1. Keep team member order consistent with dashboard
2. Maintain bilingual content parity
3. Optimize gallery images for web
4. Use proper heading hierarchy
5. Add empty states for missing data

### When Modifying
1. Update both EN and AR translations
2. Test with varying team member counts
3. Handle missing gallery gracefully
4. Maintain responsive design
5. Ensure accessibility

### When Debugging
1. Check RPC queries for team members
2. Verify KV keys for gallery
3. Test with different locale settings
4. Check image loading and lightbox
5. Review responsive breakpoints

## Accessibility

- Alt text for all team member photos
- Proper heading structure
- Keyboard-navigable gallery
- Focus indicators
- Screen reader friendly

## Performance Optimizations

1. **Image Loading**
   - Lazy load team member photos
   - Optimize gallery images
   - Use placeholder images

2. **Data Fetching**
   - Server-side data fetching
   - Cache team member data
   - Paginate large galleries

3. **Animations**
   - Reduce motion for users with preferences
   - Lightweight transitions

## Related Features

- **dashboard-team-member** - Team member management
- **dashboard-static-media** - Gallery and video content
- **home** - May link to about page
- **contact-us** - Related company information

## Future Enhancements

- [ ] Interactive company timeline
- [ ] Team member detail pages
- [ ] Video testimonials from team
- [ ] Awards and recognition section
- [ ] Company culture highlights
- [ ] CSR/sustainability initiatives
- [ ] Client testimonials
- [ ] Office locations map
- [ ] Career opportunities link
- [ ] Downloadable company profile PDF

## License

Part of the Djavacoal project. See main project LICENSE file.
