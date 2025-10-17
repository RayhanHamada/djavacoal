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

export const LoginFormSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export const InviteAdminFormSchema = z
  .object({
    email: z.email("Invalid email address").nonempty("Email is required"),
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
  })
  .transform((data) => {
    // Auto-populate name from email if not provided
    if (!data.name.trim()) {
      const match = data.email.match(/^([^@]+)@/);
      data.name = match ? match[1] : data.email;
    }
    return data;
  });

export const SetPasswordFormSchema = z
  .object({
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

export const ForgotPasswordFormSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
});

export const ResetPasswordFormSchema = z
  .object({
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
export const validateLoginForm = zod4Resolver(LoginFormSchema);
export const validateInviteAdminForm = zod4Resolver(InviteAdminFormSchema);
export const validateSetPasswordForm = zod4Resolver(SetPasswordFormSchema);
export const validateForgotPasswordForm = zod4Resolver(
  ForgotPasswordFormSchema
);
export const validateResetPasswordForm = zod4Resolver(ResetPasswordFormSchema);

export type OnboardingFormValues = z.infer<typeof OnboardingFormSchema>;
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
export type InviteAdminFormValues = z.infer<typeof InviteAdminFormSchema>;
export type SetPasswordFormValues = z.infer<typeof SetPasswordFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;
