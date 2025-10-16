"use client";

import { useForm } from "@mantine/form";
import { validateResetPasswordForm } from "@/features/admin-auth/lib/form-schema";
import { notifications } from "@mantine/notifications";
import { client } from "@/features/admin-auth/lib/better-auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";

type Options = {
  onSuccess?: () => void;
};

/**
 * Hook for handling password reset
 * Resets user password using the token from the email link
 */
export function useResetPassword(options?: Options) {
  const [isLoading, setIsLoading] = useState(false);
  const [token] = useQueryState("token", parseAsString.withDefault(""));
  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: validateResetPasswordForm,
  });

  const handleSubmit = form.onSubmit(async ({ password: newPassword }) => {
    setIsLoading(true);

    try {
      const res = await client.resetPassword({
        token,
        newPassword,
      });

      if (res?.error) {
        notifications.show({
          title: "Reset Failed",
          message: res.error.message || "Failed to reset password",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Password Reset Successful",
        message:
          "Your password has been reset. You can now login with your new password.",
        color: "green",
      });

      form.reset();

      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);

      options?.onSuccess?.();
    } catch {
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return {
    form,
    handleSubmit,
    isLoading,
  };
}
