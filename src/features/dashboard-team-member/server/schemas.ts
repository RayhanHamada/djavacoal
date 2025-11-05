import z from "zod/v4";

import {
    TEAM_MEMBER_NAME_MAX_LENGTH,
    TEAM_MEMBER_NAME_MIN_LENGTH,
    TEAM_MEMBER_POSITION_MAX_LENGTH,
    TEAM_MEMBER_POSITION_MIN_LENGTH,
} from "./constants";
import { MAX_FILE_SIZE } from "@/adapters/r2/constants";

/**
 * Team member list item schema
 */
export const TeamMemberListItemSchema = z.object({
    id: z.number(),
    name: z.string(),
    position: z.string(),
    photo_key: z.string(),
    order_index: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type TeamMemberListItem = z.infer<typeof TeamMemberListItemSchema>;

/**
 * List team members output schema
 */
export const ListTeamMembersOutputSchema = z.object({
    teamMembers: z.array(TeamMemberListItemSchema),
    total: z.number().int(),
});

export type ListTeamMembersOutput = z.infer<typeof ListTeamMembersOutputSchema>;

/**
 * Get team member by ID input schema
 */
export const GetTeamMemberByIdInputSchema = z.object({
    id: z.number().int().positive(),
});

export type GetTeamMemberByIdInput = z.infer<
    typeof GetTeamMemberByIdInputSchema
>;

/**
 * Get team member by ID output schema
 */
export const GetTeamMemberByIdOutputSchema = z.object({
    id: z.number(),
    name: z.string(),
    position: z.string(),
    photo_key: z.string(),
    order_index: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type GetTeamMemberByIdOutput = z.infer<
    typeof GetTeamMemberByIdOutputSchema
>;

/**
 * Create team member input schema
 */
export const CreateTeamMemberInputSchema = z.object({
    name: z
        .string()
        .trim()
        .min(
            TEAM_MEMBER_NAME_MIN_LENGTH,
            `Name must be at least ${TEAM_MEMBER_NAME_MIN_LENGTH} character`
        )
        .max(
            TEAM_MEMBER_NAME_MAX_LENGTH,
            `Name must be at most ${TEAM_MEMBER_NAME_MAX_LENGTH} characters`
        ),
    position: z
        .string()
        .trim()
        .min(
            TEAM_MEMBER_POSITION_MIN_LENGTH,
            `Position must be at least ${TEAM_MEMBER_POSITION_MIN_LENGTH} character`
        )
        .max(
            TEAM_MEMBER_POSITION_MAX_LENGTH,
            `Position must be at most ${TEAM_MEMBER_POSITION_MAX_LENGTH} characters`
        ),
    photo_key: z.string().min(1, "Photo is required"),
});

export type CreateTeamMemberInput = z.infer<typeof CreateTeamMemberInputSchema>;

/**
 * Create team member output schema
 */
export const CreateTeamMemberOutputSchema = z.object({
    id: z.number(),
    name: z.string(),
    position: z.string(),
    photo_key: z.string(),
    order_index: z.number(),
});

export type CreateTeamMemberOutput = z.infer<
    typeof CreateTeamMemberOutputSchema
>;

/**
 * Update team member input schema
 */
export const UpdateTeamMemberInputSchema = z.object({
    id: z.number().int().positive(),
    name: z
        .string()
        .trim()
        .min(
            TEAM_MEMBER_NAME_MIN_LENGTH,
            `Name must be at least ${TEAM_MEMBER_NAME_MIN_LENGTH} character`
        )
        .max(
            TEAM_MEMBER_NAME_MAX_LENGTH,
            `Name must be at most ${TEAM_MEMBER_NAME_MAX_LENGTH} characters`
        ),
    position: z
        .string()
        .trim()
        .min(
            TEAM_MEMBER_POSITION_MIN_LENGTH,
            `Position must be at least ${TEAM_MEMBER_POSITION_MIN_LENGTH} character`
        )
        .max(
            TEAM_MEMBER_POSITION_MAX_LENGTH,
            `Position must be at most ${TEAM_MEMBER_POSITION_MAX_LENGTH} characters`
        ),
    photo_key: z.string().min(1, "Photo is required"),
});

export type UpdateTeamMemberInput = z.infer<typeof UpdateTeamMemberInputSchema>;

/**
 * Delete team member input schema
 */
export const DeleteTeamMemberInputSchema = z.object({
    id: z.number().int().positive(),
});

export type DeleteTeamMemberInput = z.infer<typeof DeleteTeamMemberInputSchema>;

/**
 * Reorder team members input schema
 */
export const ReorderTeamMembersInputSchema = z.object({
    /** Array of team member IDs in their new order */
    order: z.array(z.number().int().positive()),
});

export type ReorderTeamMembersInput = z.infer<
    typeof ReorderTeamMembersInputSchema
>;

/**
 * Generate presigned upload URL input schema
 */
export const GenerateTeamMemberUploadUrlInputSchema = z.object({
    filename: z.string().min(1),
    contentType: z.string().regex(/^image\//),
    fileSize: z
        .number()
        .int()
        .positive()
        .max(MAX_FILE_SIZE, "File size exceeds maximum allowed size"),
});

export type GenerateTeamMemberUploadUrlInput = z.infer<
    typeof GenerateTeamMemberUploadUrlInputSchema
>;

/**
 * Generate presigned upload URL output schema
 */
export const GenerateTeamMemberUploadUrlOutputSchema = z.object({
    upload_url: z.string().url(),
    photo_key: z.string(),
});

export type GenerateTeamMemberUploadUrlOutput = z.infer<
    typeof GenerateTeamMemberUploadUrlOutputSchema
>;
