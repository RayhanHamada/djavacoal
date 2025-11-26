/**
 * Dashboard Gallery Feature Constants
 *
 * Validation limits, pagination defaults, and UI configuration
 * for the centralized photo gallery management system.
 */

// ============================================
// Photo Name Validation
// ============================================

/** Minimum length for photo names */
export const PHOTO_NAME_MIN_LENGTH = 8;

/** Maximum length for photo names */
export const PHOTO_NAME_MAX_LENGTH = 100;

// ============================================
// Pagination
// ============================================

/** Default number of items per page */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum allowed items per page */
export const MAX_PAGE_SIZE = 100;

// ============================================
// Bulk Operations
// ============================================

/** Maximum number of photos that can be deleted in a single bulk operation */
export const MAX_BULK_DELETE = 100;

// ============================================
// UI Configuration
// ============================================

/** Height of photo cards in pixels */
export const PHOTO_CARD_HEIGHT = 192;

/** Responsive grid column configuration */
export const GRID_COLUMNS = { base: 1, sm: 2, md: 3, lg: 4 } as const;

// ============================================
// Debounce Delays (milliseconds)
// ============================================

/** Delay for search input debouncing */
export const SEARCH_DEBOUNCE_DELAY = 500;

/** Delay for photo name availability check */
export const NAME_CHECK_DEBOUNCE_DELAY = 1000;
