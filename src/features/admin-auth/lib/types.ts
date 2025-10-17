/**
 * Admin user type based on the users table schema
 */
export type Admin = {
    id: string;
    name: string;
    email: string;
    email_verified: boolean;
    image: string | null;
    created_at: Date;
    updated_at: Date;
};

/**
 * Admin list item type for table display
 */
export type AdminListItem = Pick<
    Admin,
    "id" | "email" | "name" | "created_at"
> & {
    role: string | null;
};
