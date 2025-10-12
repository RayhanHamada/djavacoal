import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

const OnboardingFormSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.email("Invalid email address").nonempty("Email is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const validateOnboardingForm = zod4Resolver(OnboardingFormSchema);

export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
