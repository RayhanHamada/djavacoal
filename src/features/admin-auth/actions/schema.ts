import z from "zod/v4";

export const OnboardingInputSchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().min(8).max(100),
});
