import "server-only";

import { headers } from "next/headers";

import { and, count, eq, like, ne, or, sql, SQL } from "drizzle-orm";

import { ACCOUNT_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { users, accounts } from "@/adapters/d1/schema";
import { getResend } from "@/adapters/email-service";
import { getAuth } from "@/features/dashboard-auth/lib/better-auth-server";
import {
    EMAIL_SENDER_NAME,
    EMAIL_SUBJECT,
} from "@/features/dashboard-auth/lib/constants";
import {
    InvitationEmailInputSchema,
    InviteAdminInputSchema,
    ListAdminInputSchema,
    ListAdminsOutputSchema,
    OnboardingInputSchema,
    RequestResetPasswordEmailInputSchema,
    SetPasswordInputSchema,
    CheckNeedsPasswordOutputSchema,
    RemoveAdminInputSchema,
    UpdateNameInputSchema,
    ChangePasswordInputSchema,
} from "@/features/dashboard-auth/server/schema";
import base from "@/lib/orpc/server";
import {
    AdminInvitationEmail,
    AdminResetPasswordEmail,
} from "@/templates/emails";

export const setupFirstUser = base
    .input(OnboardingInputSchema)
    .handler(async function ({
        context: { env },
        input: { name, email, password },
        errors,
    }) {
        const db = getDB(env.DJAVACOAL_DB);
        const user = await db.query.users.findFirst();

        if (user) {
            throw errors.BAD_REQUEST({
                message: "Admin user already exists",
            });
        }

        const auth = getAuth(env);
        await auth.api.createUser({
            body: {
                name,
                email,
                password,
                role: "admin",
            },
        });
    })
    .callable();

export const redirectJoinedUser = base
    .handler(async function ({ context: { env } }) {
        const db = getDB(env.DJAVACOAL_DB);
        const user = await db.query.users.findFirst();

        return {
            onboarded: !!user,
        };
    })
    .callable();

export const redirectUnauthenticatedUser = base
    .handler(async function ({ context: { env } }) {
        const auth = getAuth(env);
        const header = await headers();
        const session = await auth.api.getSession({ headers: header });

        return {
            user: session?.user,
        };
    })
    .callable();

export const redirectAuthenticatedUser = base
    .handler(async function ({ context: { env } }) {
        const auth = getAuth(env);
        const header = await headers();
        const session = await auth.api.getSession({ headers: header });

        return {
            user: session?.user,
        };
    })
    .callable();

/**
 * Send an invitation email to a new admin user
 */
export const sendInvitationEmail = base
    .input(InvitationEmailInputSchema)
    .handler(async function ({ context: { env }, input: { to, link } }) {
        const emailService = getResend(env.RESEND_API_KEY);
        await emailService.emails.send({
            to,
            react: <AdminInvitationEmail email={to} link={link} />,
            from: `${EMAIL_SENDER_NAME} <${env.SENDER_EMAIL}>`,
            subject: EMAIL_SUBJECT.INVITATION,
        });
    })
    .callable();

/**
 * Send a reset password email to an admin user
 */
export const sendRequestResetPasswordEmail = base
    .input(RequestResetPasswordEmailInputSchema)
    .handler(async function ({ context: { env }, input: { to, link } }) {
        const emailService = getResend(env.RESEND_API_KEY);
        await emailService.emails.send({
            to,
            react: <AdminResetPasswordEmail email={to} link={link} />,
            from: `${EMAIL_SENDER_NAME} <${env.SENDER_EMAIL}>`,
            subject: EMAIL_SUBJECT.RESET_PASSWORD,
        });
    })
    .callable();

/**
 * list all registered admin users
 */
export const listAllAdmins = base
    .input(ListAdminInputSchema)
    .output(ListAdminsOutputSchema)
    .handler(async function ({
        context: { env },
        input: { search = "", page, limit },
    }) {
        const header = await headers();
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const session = await auth.api.getSession({ headers: header });

        const currentUserId = session?.user?.id ?? "";

        const offset = (page - 1) * limit;
        const condition: SQL[] = [
            like(sql`lower(${users.email})`, `%${search}%`),
            like(sql`lower(${users.name})`, `%${search}%`),
        ];

        const admins = await db
            .select({
                data: users,
                total: count(),
            })
            .from(users)
            .where(and(ne(users.id, currentUserId), or(...condition)))
            .groupBy(users.id)
            .offset(offset)
            .limit(limit);

        return {
            admins: admins.map((v) => ({
                id: v.data.id,
                name: v.data.name,
                email: v.data.email,
                role: v.data.role,
                created_at: v.data.created_at!,
            })),
            total: admins.at(0)?.total ?? 0,
            page,
            pageSize: limit,
        };
    })
    .callable();

/**
 * Invite a new admin user via magic link
 * This will create a user account and send them an invitation email
 */
export const inviteAdmin = base
    .input(InviteAdminInputSchema)
    .handler(async function ({
        context: { env },
        input: { email, name },
        errors,
    }) {
        const header = await headers();
        const auth = getAuth(env);
        const db = getDB(env.DJAVACOAL_DB);

        // Check if user is authenticated
        const session = await auth.api.getSession({ headers: header });
        if (!session?.user) {
            throw errors.BAD_REQUEST({
                message: "You must be authenticated to invite admins",
            });
        }

        // Check if user with this email already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(like(sql`lower(${users.email})`, email.toLowerCase()))
            .limit(1);

        if (existingUser.length > 0) {
            throw errors.BAD_REQUEST({
                message: "An admin with this email already exists",
            });
        }

        // Send magic link invitation using Better Auth
        // The magic link plugin will create the user on first sign-in
        try {
            await auth.api.signInMagicLink({
                headers: header,
                body: {
                    email,
                    name,
                    callbackURL: "/dashboard",
                },
            });
        } catch {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to send invitation email",
            });
        }
    })
    .callable();

/**
 * Check if the authenticated user needs to set a password
 * Returns true if user doesn't have a credential account (password-based)
 */
export const checkNeedsPassword = base
    .output(CheckNeedsPasswordOutputSchema)
    .handler(async function ({ context: { env }, errors }) {
        const header = await headers();
        const auth = getAuth(env);
        const session = await auth.api.getSession({ headers: header });

        if (!session?.user) {
            throw errors.BAD_REQUEST({
                message: "You must be authenticated",
            });
        }

        const db = getDB(env.DJAVACOAL_DB);

        // Check if user has a credential account (email/password)
        const credentialAccount = await db
            .select()
            .from(accounts)
            .where(
                and(
                    eq(accounts[ACCOUNT_COLUMNS.USER_ID], session.user.id),
                    eq(accounts[ACCOUNT_COLUMNS.PROVIDER_ID], "credential")
                )
            )
            .limit(1);

        return {
            needsPassword: credentialAccount.length === 0,
        };
    })
    .callable();

/**
 * Set password for the authenticated user
 * Uses Better Auth's setPassword API
 */
export const setPassword = base
    .input(SetPasswordInputSchema)
    .handler(async function ({
        context: { env },
        input: { password },
        errors,
    }) {
        const header = await headers();
        const auth = getAuth(env);
        const session = await auth.api.getSession({ headers: header });

        if (!session?.user) {
            throw errors.BAD_REQUEST({
                message: "You must be authenticated",
            });
        }

        try {
            await auth.api.setPassword({
                headers: header,
                body: {
                    newPassword: password,
                },
            });
        } catch {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to set password",
            });
        }
    })
    .callable();

/**
 * Remove an admin user
 * Only admins can remove other users
 * Admins cannot remove themselves
 */
export const removeAdmin = base
    .input(RemoveAdminInputSchema)
    .handler(async function ({ context: { env }, input: { id }, errors }) {
        const header = await headers();
        const auth = getAuth(env);
        const db = getDB(env.DJAVACOAL_DB);

        // Check if user is authenticated
        const session = await auth.api.getSession({ headers: header });
        if (!session?.user) {
            throw errors.BAD_REQUEST({
                message: "You must be authenticated to remove users",
            });
        }

        // Check if current user has admin role
        const currentUser = await db
            .select()
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

        if (!currentUser[0] || currentUser[0].role !== "admin") {
            throw errors.BAD_REQUEST({
                message: "Only admins can remove other users",
            });
        }

        // Prevent self-removal
        if (session.user.id === id) {
            throw errors.BAD_REQUEST({
                message: "You cannot remove yourself",
            });
        }

        // Check if target user exists
        const targetUser = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!targetUser[0]) {
            throw errors.NOT_FOUND({
                message: "User not found",
            });
        }

        // Remove the user using Better Auth API
        try {
            await auth.api.removeUser({
                headers: header,
                body: {
                    userId: id,
                },
            });
        } catch {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to remove user. Please try again.",
            });
        }
    })
    .callable();

/**
 * Update the authenticated user's name
 */
export const updateMyName = base
    .input(UpdateNameInputSchema)
    .handler(async function ({ context: { env }, input: { name }, errors }) {
        const header = await headers();
        const auth = getAuth(env);
        const session = await auth.api.getSession({ headers: header });

        if (!session?.user) {
            throw errors.BAD_REQUEST({
                message: "You must be authenticated",
            });
        }

        try {
            await auth.api.updateUser({
                headers: header,
                body: {
                    name,
                },
            });
        } catch {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to update name",
            });
        }
    })
    .callable();

/**
 * Change the authenticated user's password
 * Requires the current password for verification
 */
export const changeMyPassword = base
    .input(ChangePasswordInputSchema)
    .handler(async function ({
        context: { env },
        input: { currentPassword, newPassword },
        errors,
    }) {
        const header = await headers();
        const auth = getAuth(env);
        const session = await auth.api.getSession({ headers: header });

        if (!session?.user) {
            throw errors.BAD_REQUEST({
                message: "You must be authenticated",
            });
        }

        try {
            await auth.api.changePassword({
                headers: header,
                body: {
                    currentPassword,
                    newPassword,
                    revokeOtherSessions: false, // Keep user signed in on all devices
                },
            });
        } catch {
            throw errors.BAD_REQUEST({
                message:
                    "Invalid current password or failed to change password",
            });
        }
    })
    .callable();
