import { zod4Resolver } from "mantine-form-zod-resolver";
import z from "zod/v4";

import { SITEMAP_CHANGEFREQ_ENUM } from "@/adapters/d1/constants";
import {
    MAX_KEYWORDS,
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_DESCRIPTION_MIN_LENGTH,
    METADATA_KEYWORD_MAX_LENGTH,
    METADATA_KEYWORD_MIN_LENGTH,
    METADATA_TITLE_MAX_LENGTH,
    METADATA_TITLE_MIN_LENGTH,
    PATH_MAX_LENGTH,
    PATH_MIN_LENGTH,
    SITEMAP_CHANGEFREQ_DEFAULT,
    SITEMAP_PRIORITY_DEFAULT,
    SITEMAP_PRIORITY_MAX,
    SITEMAP_PRIORITY_MIN,
} from "@/features/dashboard-page-settings/server/constants";
import {
    TEAM_MEMBER_NAME_MAX_LENGTH,
    TEAM_MEMBER_NAME_MIN_LENGTH,
    TEAM_MEMBER_POSITION_MAX_LENGTH,
    TEAM_MEMBER_POSITION_MIN_LENGTH,
} from "@/features/dashboard-page-settings/server/team-members/constants";

/**
 * Schema for creating page metadata
 */
export const CreatePageMetadataFormSchema = z.object({
    path: z
        .string()
        .trim()
        .startsWith("/", "Path must start with /")
        .min(PATH_MIN_LENGTH, "Path is required")
        .max(
            PATH_MAX_LENGTH,
            `Path must be at most ${PATH_MAX_LENGTH} characters`
        ),
    metadata_title: z
        .string()
        .trim()
        .min(METADATA_TITLE_MIN_LENGTH, "Metadata title is required")
        .max(
            METADATA_TITLE_MAX_LENGTH,
            `Metadata title must be at most ${METADATA_TITLE_MAX_LENGTH} characters`
        ),
    metadata_description: z
        .string()
        .trim()
        .min(
            METADATA_DESCRIPTION_MIN_LENGTH,
            "Metadata description is required"
        )
        .max(
            METADATA_DESCRIPTION_MAX_LENGTH,
            `Metadata description must be at most ${METADATA_DESCRIPTION_MAX_LENGTH} characters`
        ),
    metadata_keywords: z
        .array(
            z
                .string()
                .trim()
                .min(METADATA_KEYWORD_MIN_LENGTH)
                .max(METADATA_KEYWORD_MAX_LENGTH)
        )
        .max(MAX_KEYWORDS, `Maximum ${MAX_KEYWORDS} keywords allowed`)
        .default([]),
    sitemap_priority: z
        .number()
        .min(
            SITEMAP_PRIORITY_MIN,
            `Priority must be at least ${SITEMAP_PRIORITY_MIN}`
        )
        .max(
            SITEMAP_PRIORITY_MAX,
            `Priority must be at most ${SITEMAP_PRIORITY_MAX}`
        )
        .default(SITEMAP_PRIORITY_DEFAULT),
    sitemap_changefreq: z
        .enum(SITEMAP_CHANGEFREQ_ENUM)
        .default(SITEMAP_CHANGEFREQ_DEFAULT),
});

/**
 * Schema for editing page metadata
 */
export const EditPageMetadataFormSchema = z.object({
    id: z.number().int().positive(),
    path: z
        .string()
        .trim()
        .min(PATH_MIN_LENGTH, "Path is required")
        .max(
            PATH_MAX_LENGTH,
            `Path must be at most ${PATH_MAX_LENGTH} characters`
        )
        .regex(/^\//, "Path must start with /"),
    metadata_title: z
        .string()
        .trim()
        .min(METADATA_TITLE_MIN_LENGTH, "Metadata title is required")
        .max(
            METADATA_TITLE_MAX_LENGTH,
            `Metadata title must be at most ${METADATA_TITLE_MAX_LENGTH} characters`
        ),
    metadata_description: z
        .string()
        .trim()
        .min(
            METADATA_DESCRIPTION_MIN_LENGTH,
            "Metadata description is required"
        )
        .max(
            METADATA_DESCRIPTION_MAX_LENGTH,
            `Metadata description must be at most ${METADATA_DESCRIPTION_MAX_LENGTH} characters`
        ),
    metadata_keywords: z
        .array(
            z
                .string()
                .trim()
                .min(METADATA_KEYWORD_MIN_LENGTH)
                .max(METADATA_KEYWORD_MAX_LENGTH)
        )
        .max(MAX_KEYWORDS, `Maximum ${MAX_KEYWORDS} keywords allowed`)
        .default([]),
    sitemap_priority: z
        .number()
        .min(
            SITEMAP_PRIORITY_MIN,
            `Priority must be at least ${SITEMAP_PRIORITY_MIN}`
        )
        .max(
            SITEMAP_PRIORITY_MAX,
            `Priority must be at most ${SITEMAP_PRIORITY_MAX}`
        )
        .default(SITEMAP_PRIORITY_DEFAULT),
    sitemap_changefreq: z
        .enum(SITEMAP_CHANGEFREQ_ENUM)
        .default(SITEMAP_CHANGEFREQ_DEFAULT),
});

export const validateCreatePageMetadataForm = zod4Resolver(
    CreatePageMetadataFormSchema
);
export const validateEditPageMetadataForm = zod4Resolver(
    EditPageMetadataFormSchema
);

export type CreatePageMetadataFormValues = z.infer<
    typeof CreatePageMetadataFormSchema
>;
export type EditPageMetadataFormValues = z.infer<
    typeof EditPageMetadataFormSchema
>;

/**
 * Base schema for team member form fields (shared between create and edit)
 */
const BaseTeamMemberFormFields = {
    name: z
        .string()
        .trim()
        .min(TEAM_MEMBER_NAME_MIN_LENGTH, "Name is required")
        .max(
            TEAM_MEMBER_NAME_MAX_LENGTH,
            `Name must be at most ${TEAM_MEMBER_NAME_MAX_LENGTH} characters`
        ),
    position: z
        .string()
        .trim()
        .min(TEAM_MEMBER_POSITION_MIN_LENGTH, "Position is required")
        .max(
            TEAM_MEMBER_POSITION_MAX_LENGTH,
            `Position must be at most ${TEAM_MEMBER_POSITION_MAX_LENGTH} characters`
        ),
};

/**
 * Schema for creating team member
 * Note: existingPhotoKey validation is handled in the component
 * because it depends on file upload state
 */
export const CreateTeamMemberFormSchema = z.object({
    ...BaseTeamMemberFormFields,
    existingPhotoKey: z.string(),
});

/**
 * Schema for editing team member
 * Note: existingPhotoKey validation is handled in the component
 * because it depends on file upload state
 */
export const EditTeamMemberFormSchema = z.object({
    ...BaseTeamMemberFormFields,
    existingPhotoKey: z.string(),
});

export const validateCreateTeamMemberForm = zod4Resolver(
    CreateTeamMemberFormSchema
);
export const validateEditTeamMemberForm = zod4Resolver(
    EditTeamMemberFormSchema
);

export type CreateTeamMemberFormValues = z.infer<
    typeof CreateTeamMemberFormSchema
>;
export type EditTeamMemberFormValues = z.infer<typeof EditTeamMemberFormSchema>;
