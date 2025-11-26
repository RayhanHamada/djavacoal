/**
 * Dashboard Team Member Feature Constants
 *
 * Validation limits and UI configuration for team member management.
 */

// ============================================
// Field Length Constraints
// ============================================

/** Minimum length for team member name */
export const TEAM_MEMBER_NAME_MIN_LENGTH = 1;

/** Maximum length for team member name */
export const TEAM_MEMBER_NAME_MAX_LENGTH = 150;

/** Minimum length for team member position */
export const TEAM_MEMBER_POSITION_MIN_LENGTH = 1;

/** Maximum length for team member position */
export const TEAM_MEMBER_POSITION_MAX_LENGTH = 150;

// ============================================
// UI Display Limits
// ============================================

/** Maximum characters to show for name in cards before truncation */
export const CARD_NAME_TRUNCATE_LENGTH = 50;

/** Maximum characters to show for position in cards before truncation */
export const CARD_POSITION_TRUNCATE_LENGTH = 40;

// ============================================
// Storage
// ============================================

/** R2 prefix for team member photos */
export const TEAM_MEMBERS_PREFIX = "team-members";
