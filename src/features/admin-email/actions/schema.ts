import z from "zod/v4";

export const InvitationEmailInputSchema = z.object({
  to: z.email(),
  token: z.string().nonempty(),
});

export const RequestResetPasswordEmailInputSchema = z.object({
  to: z.email(),
  token: z.string().nonempty(),
});
