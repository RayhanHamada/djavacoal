/**
 * Molecules - Composite components built from atoms
 * Following Atomic Design principles
 */

// Media components
export { MediaGallery } from "./media-gallery";
export { MediaGalleryHorizontal } from "./media-gallery-horizontal";

// Product display components
export { default as OurProductsSidebar } from "./our-product-sidebar";
export { ProductHeroSection } from "./product-hero-section";
export { ProductCategoryDropdown } from "./product-category-dropdown";
export { ProductDetailTable } from "./product-detail-table";
export { DjavacoalBrandPage } from "./djavacoal-brand-page";

// Product features components
export { ShapesList } from "./shapes-list";
export { PackagingList } from "./packaging-list";

// Legacy exports - may be refactored
export * from "./product-description";
export * from "./product-image-gallery";
export * from "./product-specifications";
export * from "./product-shapes";
export * from "./product-header";
export * from "./product-description-card";
