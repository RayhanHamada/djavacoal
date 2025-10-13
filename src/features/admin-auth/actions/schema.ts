import z from "zod/v4";

export const OnboardingInputSchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const CheckIfAlreadyOnboardedOutputSchema = z.object({
  onboarded: z.boolean(),
});

export const GetAuthSessionOutputSchema = z.object({
  user: z
    .object({
      id: z.string(),
      email: z.email(),
      name: z.string(),
    })
    .nullish(),
});
