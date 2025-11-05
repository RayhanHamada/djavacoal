import "server-only";

import { headers } from "next/headers";

import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { TEAM_MEMBERS_PREFIX } from "./constants";
import {
    CreateTeamMemberInputSchema,
    CreateTeamMemberOutputSchema,
    DeleteTeamMemberInputSchema,
    GenerateTeamMemberUploadUrlInputSchema,
    GenerateTeamMemberUploadUrlOutputSchema,
    GetTeamMemberByIdInputSchema,
    GetTeamMemberByIdOutputSchema,
    ListTeamMembersOutputSchema,
    ReorderTeamMembersInputSchema,
    UpdateTeamMemberInputSchema,
} from "./schemas";
import { COMMON_COLUMNS, TEAM_MEMBER_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { teams } from "@/adapters/d1/schema";
import {
    DEFAULT_BUCKET_NAME,
    deleteObject,
    generatePresignedUploadUrl,
    getR2Client,
} from "@/adapters/r2";
import { getAuth } from "@/features/dashboard-auth/lib/better-auth-server";
import base from "@/lib/orpc/server";

/**
 * List all team members ordered by order_index
 */
export const listTeamMembers = base
    .output(ListTeamMembersOutputSchema)
    .handler(async function ({ context: { env } }) {
        const db = getDB(env.DJAVACOAL_DB);

        const teamMembers = await db
            .select({
                id: teams[COMMON_COLUMNS.ID],
                name: teams[TEAM_MEMBER_COLUMNS.NAME],
                position: teams[TEAM_MEMBER_COLUMNS.POSITION],
                photo_key: teams[TEAM_MEMBER_COLUMNS.PHOTO_KEY],
                order_index: teams[TEAM_MEMBER_COLUMNS.ORDER_INDEX],
                created_at: teams[COMMON_COLUMNS.CREATED_AT],
                updated_at: teams[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(teams)
            .orderBy(teams[TEAM_MEMBER_COLUMNS.ORDER_INDEX]);

        return {
            teamMembers,
            total: teamMembers.length,
        };
    })
    .callable();

/**
 * Get a single team member by ID
 */
export const getTeamMemberById = base
    .input(GetTeamMemberByIdInputSchema)
    .output(GetTeamMemberByIdOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);

        const result = await db
            .select({
                id: teams[COMMON_COLUMNS.ID],
                name: teams[TEAM_MEMBER_COLUMNS.NAME],
                position: teams[TEAM_MEMBER_COLUMNS.POSITION],
                photo_key: teams[TEAM_MEMBER_COLUMNS.PHOTO_KEY],
                order_index: teams[TEAM_MEMBER_COLUMNS.ORDER_INDEX],
                created_at: teams[COMMON_COLUMNS.CREATED_AT],
                updated_at: teams[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(teams)
            .where(eq(teams[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const teamMember = result.at(0);

        if (!teamMember) {
            throw errors.NOT_FOUND({ message: "Team member not found" });
        }

        return teamMember;
    })
    .callable();

/**
 * Create a new team member
 */
export const createTeamMember = base
    .input(CreateTeamMemberInputSchema)
    .output(CreateTeamMemberOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Get max order_index
        const maxOrderResult = await db
            .select({
                maxOrder: sql<number>`MAX(${teams[TEAM_MEMBER_COLUMNS.ORDER_INDEX]})`,
            })
            .from(teams);

        const nextOrder = (maxOrderResult.at(0)?.maxOrder ?? -1) + 1;

        // Insert team member
        const result = await db
            .insert(teams)
            .values({
                name: input.name,
                position: input.position,
                photo_key: input.photo_key,
                order_index: nextOrder,
            })
            .returning({
                id: teams[COMMON_COLUMNS.ID],
                name: teams[TEAM_MEMBER_COLUMNS.NAME],
                position: teams[TEAM_MEMBER_COLUMNS.POSITION],
                photo_key: teams[TEAM_MEMBER_COLUMNS.PHOTO_KEY],
                order_index: teams[TEAM_MEMBER_COLUMNS.ORDER_INDEX],
            });

        const teamMember = result.at(0);

        if (!teamMember) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to create team member",
            });
        }

        return teamMember;
    })
    .callable();

/**
 * Update an existing team member
 */
export const updateTeamMember = base
    .input(UpdateTeamMemberInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Check if team member exists
        const existing = await db
            .select()
            .from(teams)
            .where(eq(teams[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const teamMember = existing.at(0);

        if (!teamMember) {
            throw errors.NOT_FOUND({ message: "Team member not found" });
        }

        // If photo_key changed, delete old photo from R2
        if (teamMember.photo_key !== input.photo_key) {
            try {
                const r2Client = getR2Client({
                    endpoint: env.S3_API,
                    accessKeyId: env.R2_ACCESS_KEY_ID!,
                    secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
                });

                await deleteObject(
                    r2Client,
                    teamMember.photo_key,
                    DEFAULT_BUCKET_NAME
                );
            } catch (error) {
                console.error("Failed to delete old photo:", error);
                // Continue with update even if deletion fails
            }
        }

        // Update team member
        await db
            .update(teams)
            .set({
                name: input.name,
                position: input.position,
                photo_key: input.photo_key,
            })
            .where(eq(teams[COMMON_COLUMNS.ID], input.id));

        return { success: true };
    })
    .callable();

/**
 * Delete a team member
 */
export const deleteTeamMember = base
    .input(DeleteTeamMemberInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Get team member to delete photo from R2
        const existing = await db
            .select()
            .from(teams)
            .where(eq(teams[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const teamMember = existing.at(0);

        if (!teamMember) {
            throw errors.NOT_FOUND({ message: "Team member not found" });
        }

        // Delete photo from R2
        try {
            const r2Client = getR2Client({
                endpoint: env.S3_API,
                accessKeyId: env.R2_ACCESS_KEY_ID!,
                secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
            });

            await deleteObject(
                r2Client,
                teamMember.photo_key,
                DEFAULT_BUCKET_NAME
            );
        } catch (error) {
            console.error("Failed to delete photo from R2:", error);
            // Continue with deletion even if R2 deletion fails
        }

        // Delete team member
        await db.delete(teams).where(eq(teams[COMMON_COLUMNS.ID], input.id));

        // Reorder remaining team members
        const remainingMembers = await db
            .select({
                id: teams[COMMON_COLUMNS.ID],
            })
            .from(teams)
            .orderBy(teams[TEAM_MEMBER_COLUMNS.ORDER_INDEX]);

        for (let i = 0; i < remainingMembers.length; i++) {
            await db
                .update(teams)
                .set({ order_index: i })
                .where(eq(teams[COMMON_COLUMNS.ID], remainingMembers[i].id));
        }

        return { success: true };
    })
    .callable();

/**
 * Reorder team members
 */
export const reorderTeamMembers = base
    .input(ReorderTeamMembersInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Update order_index for each team member
        for (let i = 0; i < input.order.length; i++) {
            await db
                .update(teams)
                .set({ order_index: i })
                .where(eq(teams[COMMON_COLUMNS.ID], input.order[i]));
        }

        return { success: true };
    })
    .callable();

/**
 * Generate presigned upload URL for team member photo
 */
export const generateTeamMemberUploadUrl = base
    .input(GenerateTeamMemberUploadUrlInputSchema)
    .output(GenerateTeamMemberUploadUrlOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID!,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
        });

        // Generate unique key for the photo
        const uniqueId = nanoid();
        const photo_key = `${TEAM_MEMBERS_PREFIX}/${uniqueId}`;

        const upload_url = await generatePresignedUploadUrl(r2Client, {
            key: photo_key,
            contentType: input.contentType,
            bucketName: DEFAULT_BUCKET_NAME,
        });

        return {
            upload_url,
            photo_key,
        };
    })
    .callable();
