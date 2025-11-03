# About Company Feature - AGENTS.md

## Overview

This feature provides the "About Company" page displaying Djavacoal's company information, team members, certifications, factory details, and multimedia gallery. The codebase follows **Atomic Design principles** with a focus on reusability, type safety, and clean code patterns.

**Key Characteristics:**
- Fully refactored with TypeScript interfaces and centralized constants
- Reusable animation wrappers to eliminate framer-motion duplication
- Custom hooks for common patterns (video player, image modals, scroll spy)
- Static content (certificates remain static per requirements)
- All UI/UX preserved from original implementation

---

## Architecture

### Directory Structure

```
about-company/
├── components/
│   ├── atoms/              # Basic UI elements & animation wrappers
│   │   ├── certificate-card.tsx
│   │   ├── fade-in-view.tsx        # Animation wrapper
│   │   ├── gallery-image.tsx
│   │   ├── image-modal.tsx         # Reusable modal with navigation
│   │   ├── info-card.tsx
│   │   ├── reel-card.tsx           # Video reel preview
│   │   ├── scale-on-hover.tsx      # Animation wrapper
│   │   ├── scale-x-view.tsx        # Animation wrapper
│   │   ├── slide-in-view.tsx       # Animation wrapper
│   │   ├── team-card.tsx
│   │   ├── video-player.tsx        # YouTube player with thumbnail
│   │   ├── company-legal-table.tsx
│   │   ├── social-media-links.tsx
│   │   └── export-countries-grid.tsx
│   ├── molecules/          # Composite components
│   │   ├── about-sidebar.tsx       # Navigation sidebar with scroll spy
│   │   ├── certificate-section.tsx # Certificate display with lightbox
│   │   ├── company-intro-section.tsx
│   │   ├── factory-section.tsx
│   │   ├── gallery-section.tsx     # Main gallery with reels & photos
│   │   ├── global-market-section.tsx
│   │   ├── photo-gallery.tsx       # Photo grid component
│   │   ├── reel-gallery.tsx        # Video reel carousel
│   │   └── team-section.tsx
│   └── organism/           # Complex page sections
│       ├── about-company-content.tsx
│       └── header-section.tsx
├── hooks/
│   ├── use-image-modal.tsx     # Generic modal + useGalleryViewer
│   ├── use-scroll-spy.tsx      # IntersectionObserver-based navigation
│   └── use-video-player.tsx    # Play/pause state management
├── lib/
│   ├── constants.ts            # All static data and configurations
│   └── types.ts                # TypeScript interfaces
└── app/(visitor)/about-company/
    └── page.tsx                # Main page route
```

---

## Core Concepts

### 1. Centralized Types (`lib/types.ts`)

All data structures are defined with strict TypeScript interfaces:

```typescript
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    orderIndex: number;
}

export interface Certificate {
    src: string;
    alt: string;
}

export interface GalleryImage {
    src: string;
    alt: string;
}

export type GalleryType = "reel" | "factory" | "product";

export interface GalleryViewerState {
    type: GalleryType;
    index: number;
}

// ... and more (SidebarItem, VideoReel, CompanyLegalData, SocialLink)
```

### 2. Centralized Constants (`lib/constants.ts`)

All static data, magic numbers, and image paths are extracted:

```typescript
// Sidebar Navigation
export const SIDEBAR_ITEMS: SidebarItem[] = [
    { id: "company-intro", label: "PT. Djavacoal Indonesia" },
    { id: "team", label: "Djavacoal's Team" },
    // ...
];

// Certificates (8 total)
export const CERTIFICATES: Certificate[] = [
    { src: "/images/certificates/certificate1.png", alt: "ISO 9001 Certificate" },
    // ...
];

// Gallery Data
export const GALLERY_REELS: string[] = ["EouOlxd_DlU", "q98uLQT6hh4", ...];
export const FACTORY_GALLERY: GalleryImage[] = [
    { src: "/images/factory-gallery1.png", alt: "Factory view 1" },
    // ...
];
export const PRODUCT_GALLERY: GalleryImage[] = [...];

// Team Members (simplified for static display)
export const TEAM_MEMBERS: Omit<TeamMember, "id" | "orderIndex">[] = [...];

// Animation Config
export const SCROLL_SPY_CONFIG = {
    rootMargin: "0px 0px -40% 0px",
    scrollOffset: -20,
};

// Image Paths
export const WATERMARK_IMAGE = "/images/watermark-legal.png";
export const BANNER_IMAGE = "/images/bg-banner-header.png";
// ... and more
```

---

## Animation Wrappers (Atoms)

To eliminate duplication of framer-motion code, we created 4 reusable animation wrapper components:

### FadeInView
```typescript
interface FadeInViewProps {
    children: React.ReactNode;
    delay?: number;      // Default: 0
    duration?: number;   // Default: 0.5
}

// Usage
<FadeInView delay={0.1} duration={0.6}>
    <p>This content fades in smoothly</p>
</FadeInView>
```

### SlideInView
```typescript
interface SlideInViewProps {
    children: React.ReactNode;
    yOffset?: number;    // Default: 20
    delay?: number;
    duration?: number;   // Default: 0.5
}

// Usage
<SlideInView yOffset={30} duration={0.6}>
    <h2>This slides in from below</h2>
</SlideInView>
```

### ScaleOnHover
```typescript
interface ScaleOnHoverProps {
    children: React.ReactNode;
    scale?: number;      // Default: 1.05
}

// Usage
<ScaleOnHover scale={1.02}>
    <TeamCard member={member} />
</ScaleOnHover>
```

### ScaleXView
```typescript
interface ScaleXViewProps {
    children: React.ReactNode;
    duration?: number;   // Default: 0.5
}

// Usage - Horizontal line reveal animation
<ScaleXView duration={0.6}>
    <div className="h-px bg-[#3A3A3A]" />
</ScaleXView>
```

**Benefits:**
- Eliminates repetitive `initial`, `whileInView`, `viewport`, `transition` props
- Consistent animation timing across feature
- Easy to modify animation behavior globally
- Cleaner component code

---

## Custom Hooks

### 1. `useVideoPlayer`

Manages video play/pause state:

```typescript
const { isPlaying, play, pause, toggle } = useVideoPlayer();

// Usage in VideoPlayer atom
{isPlaying ? (
    <iframe src={youtubeUrl} />
) : (
    <button onClick={play}>
        <Image src={thumbnail} />
    </button>
)}
```

### 2. `useImageModal` & `useGalleryViewer`

**Generic Modal Hook:**
```typescript
const { isOpen, currentItem, currentIndex, open, close, next, prev } = 
    useImageModal<Certificate>();

// Navigation requires passing items array
next(CERTIFICATES);
prev(CERTIFICATES);
```

**Specialized Gallery Viewer:**
```typescript
const { viewer, openViewer, closeViewer, nextItem, prevItem } = 
    useGalleryViewer();

// Open viewer
openViewer("factory", 2); // type: "reel" | "factory" | "product"

// Navigate (requires list length)
nextItem(FACTORY_GALLERY.length);
prevItem(GALLERY_REELS.length);
```

**Features:**
- Keyboard navigation (Arrow keys, Escape)
- Body scroll lock when modal open
- Automatic cleanup on unmount

### 3. `useScrollSpy`

Tracks active section via IntersectionObserver:

```typescript
const { activeId, scrollToSection } = useScrollSpy(
    ["company-intro", "team", "gallery"], // section IDs
    SCROLL_SPY_CONFIG
);

// Usage in AboutSidebar
<button 
    onClick={() => scrollToSection("team")}
    className={activeId === "team" ? "active" : ""}
>
    Team
</button>
```

---

## Component Patterns

### Atoms: Basic Building Blocks

**TeamCard** - Displays team member:
```typescript
interface TeamCardProps {
    member: Pick<TeamMember, "name" | "role" | "image">;
}

<TeamCard member={{ name: "John", role: "CEO", image: "/..." }} />
```

**VideoPlayer** - YouTube video with thumbnail:
```typescript
interface VideoPlayerProps {
    videoId: string;
    thumbnailSrc: string;
}

<VideoPlayer videoId="abc123" thumbnailSrc="/thumb.jpg" />
```

**ReelCard** - Video preview card:
```typescript
interface ReelCardProps {
    videoId: string;
    index: number;
    onClick: () => void;
}

<ReelCard videoId="xyz" index={0} onClick={() => openViewer("reel", 0)} />
```

### Molecules: Composite Components

**CertificateSection** - Full section with lightbox:
```typescript
export default function CertificateSection() {
    const { isOpen, currentItem, currentIndex, open, close, next, prev } = 
        useImageModal<Certificate>();

    return (
        <>
            {/* Grid of certificates */}
            {CERTIFICATES.map((cert, i) => (
                <ScaleOnHover key={cert.src}>
                    <CertificateCard 
                        certificate={cert} 
                        onClick={() => open(cert, i)} 
                    />
                </ScaleOnHover>
            ))}

            {/* Lightbox modal */}
            {isOpen && <CertificateLightbox {...props} />}
        </>
    );
}
```

**GallerySection** - Complex gallery with reels & photos:
```typescript
export default function GallerySection() {
    const { viewer, openViewer, closeViewer, nextItem, prevItem } = 
        useGalleryViewer();

    return (
        <>
            <ReelGallery onReelClick={(i) => openViewer("reel", i)} />
            
            <GallerySubsection 
                galleryType="factory"
                onImageClick={(i) => openViewer("factory", i)}
            />
            
            {viewer && (
                <Modal onClose={closeViewer}>
                    {/* Render based on viewer.type */}
                    <button onClick={() => nextItem(getCurrentList().length)}>
                        Next
                    </button>
                </Modal>
            )}
        </>
    );
}
```

**TeamSection** - Team grid with animations:
```typescript
export default function TeamSection() {
    return (
        <>
            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden">
                {TEAM_MEMBERS.map((member, i) => (
                    <FadeInView key={i} delay={i * 0.05}>
                        <ScaleOnHover>
                            <TeamCard member={member} />
                        </ScaleOnHover>
                    </FadeInView>
                ))}
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid lg:grid-cols-4">
                {/* Same pattern */}
            </div>
        </>
    );
}
```

### Organisms: Page Sections

**HeaderSection** - Page banner with props:
```typescript
interface HeaderSectionProps {
    title?: string;
    backgroundImage?: string;
}

<HeaderSection title="About Company" backgroundImage={BANNER_IMAGE} />
```

**AboutCompanyContent** - Main content aggregator:
```typescript
export default function AboutCompanyContent() {
    return (
        <div className="space-y-12">
            <CompanyIntroSection />
            <TeamSection />
            <GlobalMarketSection />
            <CertificateSection />
            <FactorySection />
            <GallerySection />
        </div>
    );
}
```

---

## Best Practices for AI Agents

### Adding New Features
1. **Always use types from `lib/types.ts`** - Don't create inline interfaces
2. **Extract constants to `lib/constants.ts`** - No magic strings/numbers
3. **Use animation wrappers** - Don't write inline framer-motion code
4. **Follow atomic design** - Atoms → Molecules → Organisms
5. **Export through barrel files** - Update `index.ts` files

### Modifying Components
1. **Check existing atoms first** - Reuse before creating new
2. **Maintain type safety** - All props should be typed
3. **Use Pick/Omit for flexibility** - E.g., `Pick<TeamMember, "name" | "role">`
4. **Keep animations consistent** - Use wrapper components
5. **Preserve accessibility** - aria-labels, alt text, keyboard nav

### Working with Constants
```typescript
// ✅ GOOD - Use constants
import { CERTIFICATES, WATERMARK_IMAGE } from "../../lib/constants";

// ❌ BAD - Hardcoded values
const certs = [{ src: "/images/cert1.png", alt: "Certificate" }];
```

### Animation Pattern
```typescript
// ✅ GOOD - Use wrapper
<SlideInView yOffset={30} duration={0.6}>
    <h2>Title</h2>
</SlideInView>

// ❌ BAD - Inline framer-motion
<motion.h2
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
>
    Title
</motion.h2>
```

### Hook Usage
```typescript
// ✅ GOOD - Specialized hook
const { viewer, openViewer, closeViewer, nextItem, prevItem } = 
    useGalleryViewer();

nextItem(GALLERY_REELS.length); // Pass list length

// ❌ BAD - Manual state management
const [viewer, setViewer] = useState<GalleryViewerState | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
// ... lots of duplicate logic
```

---

## Common Patterns

### Section Header Pattern
Most sections follow this header structure:

```typescript
<header className="mb-2">
    <SlideInView yOffset={30} duration={0.6}>
        <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-white" />
            <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                Section Label
            </p>
        </div>
    </SlideInView>

    <SlideInView yOffset={30} duration={0.65}>
        <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
            Section Title
        </h2>
    </SlideInView>

    <SlideInView yOffset={35} duration={0.7}>
        <p className="font-medium text-[#EFA12D]">
            Section Subtitle
        </p>
    </SlideInView>

    <ScaleXView duration={0.6}>
        <div className="mt-4 h-px origin-left bg-[#3A3A3A]" />
    </ScaleXView>
</header>
```

### Modal/Lightbox Pattern
```typescript
const { isOpen, currentItem, currentIndex, open, close, next, prev } = 
    useImageModal<T>();

// Trigger
<button onClick={() => open(item, index)}>View</button>

// Modal
{isOpen && (
    <div onClick={close}>
        <button onClick={(e) => { e.stopPropagation(); prev(items); }}>
            Prev
        </button>
        
        {/* Render currentItem */}
        
        <button onClick={(e) => { e.stopPropagation(); next(items); }}>
            Next
        </button>
    </div>
)}
```

### Responsive Grid Pattern
```typescript
// Mobile: Horizontal scroll
<div className="scrollbar-hide flex overflow-x-auto lg:hidden">
    {items.map((item, i) => (
        <FadeInView key={i} delay={i * 0.05}>
            <ItemCard item={item} />
        </FadeInView>
    ))}
</div>

// Desktop: Grid
<div className="hidden lg:grid lg:grid-cols-4">
    {items.map((item, i) => (
        <FadeInView key={i} delay={i * 0.05}>
            <ItemCard item={item} />
        </FadeInView>
    ))}
</div>
```

---

## File Organization

### Barrel Exports

**components/atoms/index.ts:**
```typescript
export { default as CertificateCard } from "./certificate-card";
export { default as FadeInView } from "./fade-in-view";
export { default as GalleryImage } from "./gallery-image";
export { default as ImageModal } from "./image-modal";
// ... all atoms
```

**components/molecules/index.ts:**
```typescript
export { default as AboutSidebar } from "./about-sidebar";
export { default as CertificateSection } from "./certificate-section";
export { default as PhotoGallery } from "./photo-gallery";
export { default as ReelGallery } from "./reel-gallery";
// ... all molecules
```

**hooks/index.ts:**
```typescript
export { default as useImageModal, useGalleryViewer } from "./use-image-modal";
export { default as useScrollSpy } from "./use-scroll-spy";
export { default as useVideoPlayer } from "./use-video-player";
```

**lib/index.ts:**
```typescript
export * from "./constants";
export * from "./types";
```

---

## Integration with Page

The main page route (`app/(visitor)/about-company/page.tsx`) uses the components:

```typescript
export default function AboutCompanyPage() {
    return (
        <main className="bg-primary text-white">
            <HeaderSection />

            <section className="mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-[260px_1fr]">
                    {/* Sidebar */}
                    <AboutSidebar />

                    {/* Content */}
                    <AboutCompanyContent />
                </div>
            </section>
        </main>
    );
}
```

---

## Testing Considerations

### Component Testing
- Test atoms independently with various props
- Test hooks with different initial states
- Test modal keyboard navigation
- Test scroll spy with different section counts

### Visual Regression
- Test responsive breakpoints (mobile, tablet, desktop)
- Test animations with `prefers-reduced-motion`
- Test image loading states
- Test empty states (no team members, no gallery)

### Accessibility
- All images have alt text
- Buttons have aria-labels
- Modals trap focus
- Keyboard navigation works
- Color contrast meets WCAG standards

---

## Performance Optimizations

1. **Image Optimization**
   - Use Next.js `<Image>` component
   - Lazy load gallery images
   - Proper `sizes` attribute for responsive images

2. **Animation Performance**
   - All wrappers use `viewport: { once: true }`
   - Reduce motion for users with preferences
   - GPU-accelerated transforms

3. **Code Splitting**
   - Components lazy loaded where appropriate
   - Barrel exports enable tree-shaking

---

## Future Enhancements

- [ ] Convert TEAM_MEMBERS to dynamic data (fetch from dashboard-team-member)
- [ ] Convert FACTORY_GALLERY/PRODUCT_GALLERY to dynamic (fetch from dashboard-static-media)
- [ ] Add video reel management via dashboard
- [ ] Add company timeline feature
- [ ] Add downloadable company profile PDF
- [ ] Add company culture/values section
- [ ] Integrate with CMS for text content

---

## Related Features

- **dashboard-team-member** - Team member management (future integration)
- **dashboard-static-media** - Gallery and video content (future integration)
- **home** - May link to about page
- **contact-us** - Related company information

---

## Troubleshooting

### Common Issues

**Animation not working:**
- Check that wrapper components are imported from `../atoms`
- Verify framer-motion is installed
- Check viewport settings in wrapper components

**Modal keyboard nav not working:**
- Verify `useEffect` in hooks properly adds/removes event listeners
- Check that event handlers call `e.stopPropagation()` correctly

**Scroll spy not updating:**
- Check section IDs match between page and SIDEBAR_ITEMS
- Verify IntersectionObserver thresholds in SCROLL_SPY_CONFIG
- Ensure sections have proper `id` attributes

**TypeScript errors:**
- Run `bun lint` to check for type issues
- Verify imports from `lib/types` and `lib/constants`
- Check that Pick/Omit are used correctly for partial types

---

## Summary

The about-company feature now follows a clean, maintainable architecture with:

✅ **Type-safe**: All components use TypeScript interfaces  
✅ **DRY**: Reusable animation wrappers and hooks eliminate duplication  
✅ **Consistent**: All sections follow similar patterns  
✅ **Testable**: Small, focused components with clear responsibilities  
✅ **Accessible**: Proper ARIA labels, keyboard navigation, alt text  
✅ **Performant**: Optimized images, efficient animations  

The refactoring maintains 100% of the original UI/UX while significantly improving code quality, maintainability, and developer experience.
