import { zod4Resolver } from "mantine-form-zod-resolver";
import z from "zod/v4";

import {
    TEAM_MEMBER_NAME_MAX_LENGTH,
    TEAM_MEMBER_NAME_MIN_LENGTH,
    TEAM_MEMBER_POSITION_MAX_LENGTH,
    TEAM_MEMBER_POSITION_MIN_LENGTH,
} from "../server/constants";

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
