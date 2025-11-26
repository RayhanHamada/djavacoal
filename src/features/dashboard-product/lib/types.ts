/**
 * Dashboard Product Feature Types
 *
 * Type definitions for product-related data structures.
 * These types are inferred from server schemas but exported
 * separately for use in components and hooks.
 */

/**
 * Product list item - used in product grid/list views
 */
export interface ProductListItem {
    id: number;
    en_name: string;
    ar_name: string;
    image_url: string;
    is_hidden: boolean;
    order_index: number;
    created_at: Date;
    updated_at: Date;
}

/**
 * Product media item - images or YouTube videos
 */
export type ProductMediaItem =
    | {
          id?: number;
          order_index: number;
          media_type: "image";
          image_key: string;
      }
    | {
          id?: number;
          order_index: number;
          media_type: "youtube";
          youtube_video_id: string;
          video_custom_thumbnail_key?: string;
      };

/**
 * Product specification item
 */
export interface ProductSpecificationItem {
    id?: number;
    spec_photo_key: string;
    order_index: number;
}

/**
 * Product variant item
 */
export interface ProductVariantItem {
    id?: number;
    en_variant_name: string;
    ar_variant_name: string;
    variant_photo_key: string;
    variant_sizes: string[];
    order_index: number;
}

/**
 * Full product detail - used in edit forms
 */
export interface ProductDetail {
    id: number;
    en_name: string;
    ar_name: string;
    en_description: string;
    ar_description: string;
    moq: string;
    production_capacity: string;
    medias: ProductMediaItem[];
    specifications: ProductSpecificationItem[];
    variants: ProductVariantItem[];
    packaging_option_ids: number[];
    is_hidden: boolean;
    order_index: number;
    created_at: Date;
    updated_at: Date;
}

/**
 * List products output - paginated response
 */
export interface ListProductsOutput {
    products: ProductListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
