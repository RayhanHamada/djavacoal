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

export const InvitationEmailInputSchema = z.object({
  to: z.email(),
  link: z.url(),
});

export const RequestResetPasswordEmailInputSchema = z.object({
  to: z.email(),
  link: z.url(),
});
