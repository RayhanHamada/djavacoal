# Production Info Feature

## Overview

This feature provides information about Djavacoal's production capabilities, processes, quality control, and facilities. It showcases the company's manufacturing expertise, capacity, and quality standards to build trust with potential clients.

## Architecture

### Directory Structure

```
production-info/
└── components/          # UI components for production page
    ├── atoms/          # Basic elements
    ├── molecules/      # Composite components (process steps, stats)
    └── organisms/      # Complex sections (process timeline, facilities)
```

## Features

### Core Functionality

1. **Production Process**
   - Step-by-step production process
   - Process photos/diagrams
   - Video walkthrough (optional)
   - Bilingual descriptions

2. **Production Capacity**
   - Monthly/annual capacity statistics
   - Production equipment details
   - Efficiency metrics
   - Scalability information

3. **Quality Control**
   - Quality assurance processes
   - Testing procedures
   - Certifications and standards
   - Quality metrics

4. **Facilities**
   - Photo gallery of facilities
   - Facility specifications
   - Equipment list
   - Location information

5. **Technology**
   - Production technology used
   - Innovation highlights
   - Automation level
   - Environmental considerations

## Technical Implementation

### Data Fetching

```typescript
// Production gallery
const { data: gallery } = rpc.staticMedia.getPhotoList.useQuery({
  kvKey: "production-gallery"
});

// Production process video
const { data: video } = rpc.staticMedia.getYouTubeUrl.useQuery({
  kvKey: "production-video"
});

// Static content from i18n messages
const t = useTranslations("production");
```

### SEO Optimization

```typescript
export const metadata: Metadata = {
  title: "Production Information - Djavacoal Manufacturing",
  description: "Learn about our production process, capacity, and quality control",
  keywords: ["production", "manufacturing", "capacity", "quality control"],
};
```

### Bilingual Support

```typescript
import { useTranslations } from "next-intl";

function ProductionProcess() {
  const t = useTranslations("production.process");
  
  return (
    <Timeline>
      <TimelineItem>
        <h3>{t("step1.title")}</h3>
        <p>{t("step1.description")}</p>
      </TimelineItem>
      {/* More steps... */}
    </Timeline>
  );
}
```

## Components

### ProductionProcessTimeline
- Vertical or horizontal timeline
- Process step cards
- Icons or images per step
- Step descriptions
- Bilingual content

### CapacityStatsSection
- Statistics grid
- Animated counters
- Units and labels
- Icon representations

### QualityControlSection
- Quality process cards
- Certification badges
- Testing procedure images
- Standards compliance

### FacilitiesGallery
- Photo gallery with lightbox
- Facility descriptions
- Equipment highlights
- Virtual tour (optional)

### TechnologyShowcase
- Technology cards
- Innovation highlights
- Equipment specifications
- Environmental features

## Integration Points

### Production Info Route
Located at `/app/(visitor)/production-info/page.tsx`:

```typescript
import { ProductionInfoView } from "@/features/production-info";

export default function ProductionInfoPage() {
  return <ProductionInfoView />;
}
```

### Data Sources
- Gallery: `dashboard-static-media` (KV: "production-gallery")
- Video: `dashboard-static-media` (KV: "production-video")
- Static content: i18n messages JSON files

### Navigation
- Header: Link to production info
- Footer: Quick link
- Homepage: May link to production capabilities
- Uses `VisitorLayout` component

## Dependencies

### External Packages
- `@mantine/core` - UI components
- `framer-motion` - Animations
- `react-photo-view` - Gallery lightbox
- `next-intl` - Internationalization

### Internal Dependencies
- `@/features/dashboard-static-media` - Gallery and video
- `@/components/layouts/visitor-layout` - Layout wrapper
- `@/hooks/use-app-locale` - Current locale

## Usage Examples

### Fetching Production Data

```typescript
export function ProductionInfoView() {
  const { data: gallery } = rpc.staticMedia.getPhotoList.useQuery({
    kvKey: "production-gallery"
  });
  
  const { data: video } = rpc.staticMedia.getYouTubeUrl.useQuery({
    kvKey: "production-video"
  });
  
  const t = useTranslations("production");
  
  return (
    <Stack>
      <ProductionProcessTimeline />
      <CapacityStatsSection />
      <QualityControlSection />
      <FacilitiesGallery photos={gallery?.photos} />
      {video?.url && <ProductionVideoSection videoUrl={video.url} />}
    </Stack>
  );
}
```

## i18n Structure

Messages file structure (`/src/i18n/messages/en.json`):

```json
{
  "production": {
    "process": {
      "title": "Production Process",
      "step1": {
        "title": "Raw Material Selection",
        "description": "We carefully select..."
      },
      "step2": {
        "title": "Processing",
        "description": "Our advanced processing..."
      }
    },
    "capacity": {
      "title": "Production Capacity",
      "monthly": "Monthly Capacity",
      "annual": "Annual Capacity"
    },
    "quality": {
      "title": "Quality Control",
      "description": "Our commitment to quality..."
    }
  }
}
```

## Best Practices for AI Agents

### When Adding Features
1. Keep production information current
2. Use real statistics and data
3. Include relevant certifications
4. Optimize gallery images
5. Maintain bilingual parity

### When Modifying
1. Update both EN and AR translations
2. Verify accuracy of technical data
3. Test with different content lengths
4. Maintain responsive design
5. Ensure accessibility

### When Debugging
1. Check KV keys for media content
2. Verify i18n message keys
3. Test with different locale settings
4. Check image loading
5. Review video embedding

## Accessibility

- Alt text for all images
- Proper heading structure
- Keyboard-navigable gallery
- Video captions (if applicable)
- Screen reader friendly

## Performance Optimizations

1. **Image Loading**
   - Lazy load gallery images
   - Optimize facility photos
   - Use responsive images

2. **Video Embedding**
   - Lazy load YouTube iframe
   - Use lite-youtube component

3. **Animations**
   - Reduce motion support
   - Performant counter animations

## Content Suggestions

### Production Process Steps
1. Raw material procurement
2. Quality inspection
3. Processing/refinement
4. Quality testing
5. Packaging
6. Storage
7. Logistics

### Key Statistics to Display
- Monthly production capacity
- Annual production capacity
- Years of experience
- Number of employees
- Factory area
- Equipment count

### Quality Standards to Mention
- ISO certifications
- Industry standards
- Testing procedures
- Quality metrics
- Environmental compliance

## Related Features

- **dashboard-static-media** - Gallery and video content
- **home** - May reference production capabilities
- **our-products** - Products created through this process
- **about-company** - Company overview

## Future Enhancements

- [ ] Virtual facility tour (360° photos)
- [ ] Production timeline/history
- [ ] Real-time production dashboard
- [ ] Equipment specifications download
- [ ] Production capacity calculator
- [ ] Environmental impact metrics
- [ ] Sustainability initiatives
- [ ] Supplier information
- [ ] Career opportunities in production
- [ ] Industry certifications showcase

## License

Part of the Djavacoal project. See main project LICENSE file.
