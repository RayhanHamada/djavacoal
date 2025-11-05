/**
 * Admin role types for role-based access control
 */
export type AdminRole = "superadmin" | "admin";

/**
 * Type guard to check if a value is a valid AdminRole
 */
export function isAdminRole(value: unknown): value is AdminRole {
    return value === "superadmin" || value === "admin";
}

/**
 * Check if a role is superadmin
 */
export function isSuperAdmin(role: string | null | undefined): boolean {
    return role === "superadmin";
}

/**
 * Check if a role is admin (not superadmin)
 */
export function isRegularAdmin(role: string | null | undefined): boolean {
    return role === "admin";
}
