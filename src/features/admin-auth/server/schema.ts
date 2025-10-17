import z from "zod/v4";

export const OnboardingInputSchema = z.object({
    name: z.string().nonempty(),
    email: z.email(),
    password: z.string().min(8).max(100),
});

export const CheckIfAlreadyOnboardedOutputSchema = z.object({
    onboarded: z.boolean(),
});

export const RemoveAdminInputSchema = z.object({
    id: z.string().nonempty(),
});

export const InviteAdminInputSchema = z.object({
    email: z.email(),
    name: z.string().min(1).max(100),
});

export const InvitationEmailInputSchema = z.object({
    to: z.email(),
    link: z.url(),
});

export const RequestResetPasswordEmailInputSchema = z.object({
    to: z.email(),
    link: z.url(),
});

export const ListAdminInputSchema = z.object({
    search: z.string().trim().toLowerCase().max(100).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),
});

export const ListAdminsOutputSchema = z.object({
    admins: z.array(
        z.object({
            id: z.string(),
            email: z.email(),
            name: z.string(),
            role: z.string().nullable(),
            created_at: z.date(),
        })
    ),
    total: z.int(),
    page: z.int(),
    pageSize: z.int(),
});

export const SetPasswordInputSchema = z.object({
    password: z.string().min(8).max(100),
});

export const CheckNeedsPasswordOutputSchema = z.object({
    needsPassword: z.boolean(),
});
