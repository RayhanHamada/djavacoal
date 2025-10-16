"use client";

import { useForm } from "@mantine/form";
import { validateForgotPasswordForm } from "@/features/admin-auth/lib/form-schema";
import { notifications } from "@mantine/notifications";
import { client } from "@/features/admin-auth/lib/better-auth-client";
import { useState } from "react";

type Options = {
  onSuccess?: () => void;
};

/**
 * Hook for handling forgot password request
 * Sends password reset email to the user
 */
export function useForgotPassword(options?: Options) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },
    validate: validateForgotPasswordForm,
  });

  const handleSubmit = form.onSubmit(async ({ email }) => {
    setIsLoading(true);

    try {
      const res = await client.forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
      });

      if (res?.error) {
        notifications.show({
          title: "Request Failed",
          message: res.error.message || "Failed to send reset email",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Email Sent",
        message: "Password reset instructions have been sent to your email",
        color: "green",
      });

      form.reset();
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
