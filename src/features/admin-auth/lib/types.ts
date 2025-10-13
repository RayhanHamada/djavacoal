/**
 * Admin user type based on the users table schema
 */
export type Admin = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Admin list item type for table display
 */
export type AdminListItem = Pick<Admin, "id" | "email" | "name">;
